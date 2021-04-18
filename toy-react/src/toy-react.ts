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
      const event = RegExp.$1.replace(/^[/s/S]/, c => c.toLowerCase())
      this.root.addEventListener(event, value);
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
  props: Record<string, any> = Object.create(null)
  children: ToyComponent[] = []

  private range: Range | null = null

  constructor() {
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
  rerender() {
    if (!this.range) return
    this.range.deleteContents()
    this[RENDER_TO_DOM](this.range)
  }
}

export function createElement(type: any, attributes: Record<string, any>, ...children: any[]) {
  const e = typeof type === "string" ? new ElementWapper(type) : new type
  for (const p in attributes) {
    e.setAttribute(p, attributes[p]);
  }
  let appendChildren = (children: any[]) => {
    for (let child of children) {
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