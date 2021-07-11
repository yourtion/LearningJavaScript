import { useMemo } from 'react';
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom';
import { cleanObject } from 'utils';

export function useUrlQueryParam<K extends string>(keys: K[]) {
  const [searchParams, setSearchParam] = useSearchParams();
  const params = keys.reduce((prev, key) => {
    return { ...prev, [key]: searchParams.get(key) || '' };
  }, {} as Record<K, string>);
  return [
    // 不关心 keys 是否变化，所以不加入依赖检查
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useMemo(() => params, [searchParams]),
    (params: Partial<{ [key in K]: unknown }>) => {
      const o = cleanObject({ ...Object.fromEntries(searchParams), ...params });
      return setSearchParam(o as URLSearchParamsInit);
    },
  ] as const;
}
