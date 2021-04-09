function isComplexType(obj) {
  return ['object', 'function'].includes(typeof obj) && obj !== null;
}

function myNew() {
  const obj = new Object();
  const Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;

  const ret = Constructor.apply(obj, arguments);
  return isComplexType(ret) ? ret : obj;
}

function A(a, b) {
  return () => a + b;
}
var obj1 = myNew(A, 1, 2);
console.log(obj1());

var obj2 = myNew(A, 3, 4);
console.log(obj2());
