import { useEffect, useRef, useState } from 'react';

/**
 * 判断除了 0 外的空值
 */
export function isVoid(val: unknown) {
  return val === undefined || val === null || val === '';
}

/**
 * 清理对象中的空值
 */
export function cleanObject(obj?: Record<string, unknown>) {
  if (!obj) return {};
  const result = { ...obj };
  Object.keys(obj).forEach((k) => {
    if (isVoid(obj[k])) {
      delete result[k];
    }
  });
  return result;
}

/**
 * 只在 mount 时执行一次
 */
export function useMount(callback: () => void) {
  useEffect(() => {
    callback();
  }, [callback]);
}

/**
 * debonce 一个
 */
export function useDebounce<V>(value: V, delay?: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 每次在 value 变化后，设置一个定时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    // 每次在上一个 useEffect 处理完以后再运行
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 设置页面标题
 */
export function useDocumentTitle(title: string, keepOnUnmount = false) {
  const oldTitle = useRef(document.title).current;
  useEffect(() => {
    document.title = title;
  });
  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle;
      }
    };
  }, [keepOnUnmount, oldTitle]);
}

/**
 * 重设路由
 */
export function resetRoute() {
  window.location.href = window.location.origin;
}

/**
 * 返回组件的挂载状态，如果还没挂载或已经卸载，返回 false 否则返回 true
 */
export function useMountedRef() {
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  });
  return mountedRef;
}
