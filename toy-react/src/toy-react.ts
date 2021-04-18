interface ToyComponent {
  root: HTMLElement | Text
}

class ElementWapper implements ToyComponent {
  root: HTMLElement
  constructor(tag: string) {
    this.root = document.createElement(tag)
  }
  setAttribute(key: string, value: any) {
    this.root.setAttribute(key, value)
  }
  appendChild(component: ToyComponent) {
    this.root.appendChild(component.root)
  }
}

class TextWapper implements ToyComponent {
  root: Text

  constructor(content: string) {
    this.root = document.createTextNode(content)
  }
}

export abstract class Component implements ToyComponent {
  _root: HTMLElement | null = null;
  props: Record<string, any> = Object.create(null)
  children: ToyComponent[] = []
  constructor() {
  }
  abstract render(): Component;

  get root(): HTMLElement {
    if (!this._root) {
      this._root = this.render().root

    }
    return this._root;
  }

  setAttribute(key: string, value: any) {
    this.props[key] = value
  }
  appendChild(component: ToyComponent) {
    this.children.push(component)
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
  parentElement.appendChild(component.root)
}