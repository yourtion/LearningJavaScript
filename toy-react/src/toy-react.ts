const RENDER_TO_DOM = Symbol("render_to_dom")
const TYPE_TEXT = "#text" as const
/** 虚拟 DOM */
interface VDOM {
  /** 类型 */
  readonly type: string
  /** 属性 */
  readonly props: Record<string, any>
  [key: string]: any
}
/** 组件 */
export abstract class Component implements VDOM {
  type: string;
  props: Record<string, any>;
  /** 上次渲染的 VDom 缓存 */
  private oldDVdom: Component | null = null;
  /** 上次渲染的 range 缓存 */
  protected range: Range | null = null;
  /** 子节点 */
  protected children: Component[] = []
  /** vdom 类型子节点 */
  protected vchildren: Component[] | null = null
  /** 状态 */
  protected state: Record<string, any> = Object.create(null);

  /** 渲染函数 */
  abstract render(): Component;

  constructor(props: Record<string, any> = Object.create(null)) {
    this.type = this.constructor.name;
    this.props = props
  }
  /** 设置属性 */
  setAttribute(name: string, value: any) {
    this.props[name] = value
  }
  /** 添加子节点 */
  appendChild(component: Component) {
    this.children.push(component)
  }
  /** 获取 VDom */
  protected get vdom(): Component {
    return this.render().vdom
  }

  /** 渲染函数实现 */
  protected [RENDER_TO_DOM](range: Range) {
    this.range = range;
    this.oldDVdom = this.vdom;
    // 递归调用，直到原始类型
    this.oldDVdom[RENDER_TO_DOM](range)
  }

  /** 更新内容 */
  private update() {
    /** 判断两个根节点是否一致 */
    function isSameNode(oldDVdom: VDOM, newVDom: VDOM) {
      if (oldDVdom.type !== newVDom.type) return false;
      // 比对各个属性
      for (const name in newVDom.props) {
        if (newVDom.props[name] !== oldDVdom.props[name]) return false;
      }
      // 如果旧属性长度大于新属性，也认为不同
      if (Object.keys(oldDVdom.props).length > Object.keys(newVDom.props).length) {
        return false;
      }
      // 对于文本类型节点，还需要比较内容
      if (newVDom.type === TYPE_TEXT) {
        if (newVDom.content !== oldDVdom.content) return false;
      }
      return true;
    }
    /** 更新节点实际执行函数 */
    function updateNode(oldDVdom: Component, newVDom: Component) {
      // type props children
      // #text content
      if (!isSameNode(oldDVdom, newVDom)) {
        return newVDom[RENDER_TO_DOM](oldDVdom.range!)
      }
      // 注意：只有 ElementWapper 和 TextWapper 可以
      newVDom.range = oldDVdom.range
      // 处理子节点
      const oldChildren = oldDVdom.vchildren
      const newChildren = newVDom.vchildren
      if (!oldChildren || !oldChildren.length) return;
      if (!newChildren || !newChildren.length) return;

      // 获取旧数据最后的位置
      let tailRange = oldChildren[oldChildren.length - 1].range;
      for (let i = 0; i < newChildren.length; i++) {
        const newChild = newChildren[i];
        const oldChild = oldChildren[i];
        if (i < oldChildren.length) {
          updateNode(oldChild, newChild)
        } else {
          // 插入新增的节点
          if (!tailRange) return;
          const range = document.createRange();
          range.setStart(tailRange.endContainer, tailRange.endOffset);
          range.setEnd(tailRange.endContainer, tailRange.endOffset);
          newChild[RENDER_TO_DOM](range)
          tailRange = range;
        }
      }
    }

    const vdom = this.vdom;
    updateNode(this.oldDVdom!, vdom)
    this.oldDVdom = vdom;
  }
  /** 设置新的状态 */
  setState(newState: Record<string, any>) {
    if (this.state === null || typeof this.state !== "object") {
      this.state = newState;
      this.update();
      return;
    }
    merge(this.state, newState)
    this.update();
  }
}

/** 普通元素 */
class ElementWapper extends Component {
  constructor(tag: string) {
    super()
    this.type = tag;
  }
  protected get vdom() {
    this.vchildren = this.children.map(c => c.vdom)
    return this
  }
  protected [RENDER_TO_DOM](range: Range) {
    this.range = range;

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
    if (!this.vchildren) {
      this.vchildren = this.children.map(c => c.vdom)
    }
    for (const child of this.vchildren) {
      const childRange = document.createRange()
      // 因为是 appendChild 所以一定是放在最后
      childRange.setStart(root, root.childNodes.length)
      childRange.setEnd(root, root.childNodes.length);
      childRange.deleteContents()
      child[RENDER_TO_DOM](childRange);
    }
    replaceContent(range, root)
  }
  render() { return this }
}

class TextWapper extends Component {
  protected content: string

  constructor(content: string) {
    super()
    this.content = content
    this.type = TYPE_TEXT;
  }
  protected get vdom() {
    return this
  }
  protected [RENDER_TO_DOM](range: Range) {
    this.range = range;
    const root = document.createTextNode(this.content)
    replaceContent(range, root)
  }
  render() { return this }
}

/**
 * 创建元素
 * @param type 类型
 * @param attributes 属性
 * @param children 子节点数组
 */
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
        // 对数组递归调用
        appendChildren(child)
      } else {
        e.appendChild(child);
      }
    }
  }
  appendChildren(children)
  return e;
}

/**
 * 渲染到真实 Dom 上
 * @param component 
 * @param parentElement 
 */
export function render(component: Component, parentElement: HTMLElement) {
  const range = document.createRange()
  range.setStart(parentElement, 0)
  range.setEnd(parentElement, parentElement.childNodes.length);
  range.deleteContents()
  component[RENDER_TO_DOM](range);
}

/** 合并两个对象 */
function merge(oldState: Record<string, any>, newState: Record<string, any>) {
  for (let k in newState) {
    if (oldState[k] === null || typeof oldState[k] !== "object") {
      // 处理非对象
      oldState[k] = newState[k]
    } else {
      merge(oldState[k], newState[k])
    }
  }
}

/** 执行内容替换 */
function replaceContent(range: Range, node: Node) {
  range.insertNode(node);
  range.setStartAfter(node);
  range.deleteContents();
  // 重新设置 range
  range.setStartBefore(node);
  range.setEndAfter(node);
}
