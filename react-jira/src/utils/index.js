import { useEffect, useState } from 'react';

/**
 * 判断除了 0 外的空值
 */
export function isFalsy(val) {
  return val === 0 ? false : !val;
}

/**
 * 清理对象中的空值
 */
export function cleanObject(obj) {
  const result = { ...obj };
  Object.keys(obj).forEach((k) => {
    if (isFalsy(obj[k])) {
      delete result[k];
    }
  });
  return result;
}

/**
 * 只在 mount 时执行一次
 */
export function useMount(callback) {
  useEffect(() => {
    callback();
  }, [callback]);
}

/**
 * debonce 一个
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 每次在 value 变化后，设置一个定时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    // 每次在上一个 useEffect 处理完以后再运行
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}
