const RENDER_TO_DOM = Symbol("render_to_dom")

export abstract class Component {
  props: Record<string, any>
  children: Component[] = []
  protected state: Record<string, any> = Object.create(null);

  private range: Range | null = null

  constructor(props: Record<string, any> = Object.create(null)) {
    this.props = props
  }
  abstract render(): Component;

  setAttribute(key: string, value: any) {
    this.props[key] = value
  }
  appendChild(component: Component) {
    this.children.push(component)
  }
  get vdom(): Component {
    return this.render()
  }
  get vchildren(): Component[] {
    return this.children.map(c => c.vdom)
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
class ElementWapper extends Component {
  type: string
  constructor(tag: string) {
    super()
    this.type = tag;
  }
  get vdom() {
    return this
  }
  [RENDER_TO_DOM](range: Range) {
    range.deleteContents()
    const root = document.createElement(this.type)
    for (const name in this.props) {
      const value = this.props[name];
      if (name.match(/^on([\s\S]+)$/)) {
        const event = RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase())
        root.addEventListener(event, value);
      } else if (name === "className") {
        root.setAttribute("class", value)
      } else {
        root.setAttribute(name, value)
      }
    }
    for (const child of this.children) {
      const childRange = document.createRange()
      // 因为是 appendChild 所以一定是放在最后
      childRange.setStart(root, root.childNodes.length)
      childRange.setEnd(root, root.childNodes.length);
      childRange.deleteContents()
      child[RENDER_TO_DOM](childRange);
    }
    range.insertNode(root)
  }
  render() {
    return this
  }
}

class TextWapper extends Component {
  type: string
  content: string

  constructor(content: string) {
    super()
    this.content = content
    this.type = "#text";
  }
  get vdom() {
    return this
  }
  [RENDER_TO_DOM](range: Range) {
    range.deleteContents()
    const root = document.createTextNode(this.content)
    range.insertNode(root)
  }
  render() {
    return this
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

export function render(component: Component, parentElement: HTMLElement) {
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