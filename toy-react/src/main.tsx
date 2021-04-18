import { createElement, render, Component } from './toy-react';

class MyComponent extends Component {
  state: Record<string, any>;
  constructor() {
    super();
    this.state = {
      a: 1,
      b: 2,
    };
  }
  render() {
    return (
      <div>
        <h1>my component</h1>
        <span>
          {this.state.a.toString()} --- {this.state.b.toString()}
        </span>
        <br />
        <button
          onclick={() => {
            this.setState({ a: this.state.a + 1 });
          }}
        >
          Add
        </button>
        {/* {this.children} */}
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
