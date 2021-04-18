import { createElement, render, Component } from './toy-react';

class MyComponent extends Component {
  render() {
    return (
      <div>
        <h1>my component</h1>
        {this.children}
      </div>
    );
  }
}

const a = (
  <MyComponent id="a" class="div1">
    <div>aaa</div>
    <div></div>
  </MyComponent>
);
console.log(a);

render(a, document.getElementById('app')!);
