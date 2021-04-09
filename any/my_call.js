Function.prototype.myCall = function (context = window, ...args) {
  const fnSymbol = Symbol('fn');
  context[fnSymbol] = this;

  const result = context[fnSymbol](...args);
  delete context[fnSymbol];
  return result;
};

function foo(...args) {
  console.log(this.a + ' - ' + args);
}

var obj = { a: 2 };

foo.myCall(obj, '1', 2, '3');
