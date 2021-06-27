export function isFalsy(val) {
  return val === 0 ? false : !val;
}

export function cleanObject(obj) {
  const result = { ...obj };
  Object.keys(obj).forEach((k) => {
    if (isFalsy(obj[k])) {
      delete result[k];
    }
  });
  return result;
}
