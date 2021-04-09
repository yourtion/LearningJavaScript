function getType(data) {
  return Object.prototype.toString.call(data).slice(8, -1);
}

console.log(getType(new Date()));
console.log(getType(new RegExp()));
console.log(getType(Math));
console.log(getType(JSON));
console.log(getType(17n));
console.log(getType('Demo'));
