declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

function createElement(tag: string, attributes: Record<string, any>, ...children: Node[]) {
  const e = document.createElement(tag);
  for (const p in attributes) {
    e.setAttribute(p, attributes[p]);
  }
  for (let child of children) {
    if (typeof child === 'string') {
      child = document.createTextNode(child);
    }
    e.appendChild(child);
  }
  return e;
}

const a = (
  <div id="a" class="div1">
    <div>aaa</div>
    <div></div>
  </div>
);
console.log(a);

document.getElementById('app')!.appendChild(a);
