Function.prototype.myApply = function (context = window, argArr = []) {
  const fnSymbol = Symbol('fn');
  context[fnSymbol] = this;

  const result = context[fnSymbol](...argArr);
  delete context[fnSymbol];
  return result;
};

function foo(...args) {
  console.log(this.a + ' - ' + args);
}

var obj = { a: 2 };

foo.myApply(obj, ['1', 2, '3']);
