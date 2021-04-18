const RENDER_TO_DOM = Symbol("render_to_dom")

interface ToyComponent {
  [RENDER_TO_DOM]: (range: Range) => void
}

class ElementWapper implements ToyComponent {
  private root: HTMLElement
  constructor(tag: string) {
    this.root = document.createElement(tag)
  }
  setAttribute(key: string, value: any) {
    if (key.match(/^on([\s\S]+)$/)) {
      const event = RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase())
      this.root.addEventListener(event, value);
    } else if (key === "className") {
      this.root.setAttribute("class", value)
    } else {
      this.root.setAttribute(key, value)
    }
  }
  appendChild(component: ToyComponent) {
    const range = document.createRange()
    // 因为是 appendChild 所以一定是放在最后
    range.setStart(this.root, this.root.childNodes.length)
    range.setEnd(this.root, this.root.childNodes.length);
    range.deleteContents()
    component[RENDER_TO_DOM](range);
  }
  [RENDER_TO_DOM](range: Range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

class TextWapper implements ToyComponent {
  private root: Text

  constructor(content: string) {
    this.root = document.createTextNode(content)
  }
  [RENDER_TO_DOM](range: Range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

export abstract class Component implements ToyComponent {
  props: Record<string, any>
  children: ToyComponent[] = []
  protected state: Record<string, any> = Object.create(null);

  private range: Range | null = null

  constructor(props: Record<string, any> = Object.create(null)) {
    this.props = props
  }
  abstract render(): Component;

  setAttribute(key: string, value: any) {
    this.props[key] = value
  }
  appendChild(component: ToyComponent) {
    this.children.push(component)
  }
  [RENDER_TO_DOM](range: Range) {
    this.range = range;
    this.render()[RENDER_TO_DOM](range)
  }
  private reRender() {
    if (!this.range) return
    // 保留老 range
    const oldRange = this.range;
    // 创建一个新 range 设置成老 range 的 start
    const range = document.createRange();
    range.setStart(oldRange.startContainer, oldRange.startOffset)
    range.setEnd(oldRange.startContainer, oldRange.startOffset)
    // 执行渲染，在前面插入渲染的内容
    this[RENDER_TO_DOM](range)
    // 把老 range 的起点放到渲染后的 range 结尾，并删除之后的内容
    oldRange.setStart(range.endContainer, range.endOffset);
    oldRange.deleteContents()
  }
  setState(newState: Record<string, any>) {
    console.log(newState);
    if (this.state === null || typeof this.state !== "object") {
      this.state = newState;
      this.reRender();
      return
    }
    merge(this.state, newState)
    this.reRender();
  }
}

export function createElement(type: any, attributes: Record<string, any>, ...children: any[]) {
  const e = typeof type === "string" ? new ElementWapper(type) : new type
  for (const p in attributes) {
    e.setAttribute(p, attributes[p]);
  }
  let appendChildren = (children: any[]) => {
    for (let child of children) {
      if (child === null) {
        continue;
      }
      if (typeof child === 'string') {
        child = new TextWapper(child);
      }
      if (Array.isArray(child)) {
        appendChildren(child)
      } else {
        e.appendChild(child);
      }
    }
  }
  appendChildren(children)
  return e;
}

export function render(component: ToyComponent, parentElement: HTMLElement) {
  const range = document.createRange()
  range.setStart(parentElement, 0)
  range.setEnd(parentElement, parentElement.childNodes.length);
  range.deleteContents()
  component[RENDER_TO_DOM](range);
}

function merge(oldState: Record<string, any>, newState: Record<string, any>) {
  for (let k in newState) {
    if (oldState[k] === null || typeof oldState[k] !== "object") {
      oldState[k] = newState[k]
    } else {
      merge(oldState[k], newState[k])
    }
  }
}