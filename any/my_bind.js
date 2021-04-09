Function.prototype.myBind = function (context = window, ...argArr) {
  const fnSymbol = Symbol('fn');
  context[fnSymbol] = this;

  return function (...argsArr2) {
    const args = argArr.concat(argsArr2);
    const result = context[fnSymbol](...args);
    delete context[fnSymbol];
    return result;
  };
};

function foo(...args) {
  console.log(this.a + ' - ' + args);
}

var obj = { a: 2 };

var foo2 = foo.myBind(obj, '1', 2, '3');

foo2(4);
