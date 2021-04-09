function flatten(arr) {
  const ret = [];
  for (let i = 0; i < arr.length; i++) {
    Array.isArray(arr[i]) ? ret.push(...flatten(arr[i])) : ret.push(arr[i]);
  }
  return ret;
}
function flatten2(arr) {
  while (arr.some(Array.isArray)) {
    arr = [].concat(...arr);
  }
  return arr;
}

const a = [1, [2, 3, [4, [5, [6]]]]];
console.log(flatten(a));
console.log(flatten2(a));
