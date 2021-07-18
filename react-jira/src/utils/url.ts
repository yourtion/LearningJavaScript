import { useMemo, useState } from 'react';
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom';
import { cleanObject, subset } from 'utils';

export function useUrlQueryParam<K extends string>(keys: K[]) {
  const [searchParams] = useSearchParams();
  const setSearchParams = useSetUrlSearchParam();
  const [stateKeys] = useState(keys);
  return [
    useMemo(() => subset(Object.fromEntries(searchParams), stateKeys) as Record<K, string>, [searchParams, stateKeys]),
    (params: Partial<{ [key in K]: unknown }>) => setSearchParams(params),
  ] as const;
}

export function useSetUrlSearchParam<T = Record<string, unknown>>() {
  const [searchParams, setSearchParam] = useSearchParams();
  return (params: Partial<T>) => {
    const o = cleanObject({ ...Object.fromEntries(searchParams), ...params });
    return setSearchParam(o as URLSearchParamsInit);
  };
}
