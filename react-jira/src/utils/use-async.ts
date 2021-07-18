import { useCallback, useReducer, useState } from 'react';
import { useMountedRef } from 'utils';

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: 'idle' | 'loading' | 'error' | 'success';
}

const defaultInintialState: State<null> = { stat: 'idle', data: null, error: null };
const defaultConfig = { throwOnError: false };

/** 判断是否挂载再执行 */
function useSafeDispatch<T>(dispatch: (...args: T[]) => void) {
  const mountedRef = useMountedRef();
  return useCallback((...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0), [dispatch, mountedRef]);
}

export function useAsync<D>(initialState?: State<D>, initialConfig?: typeof defaultConfig) {
  const config = { ...defaultConfig, ...initialConfig };
  const [state, dispatch] = useReducer((state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }), {
    ...defaultInintialState,
    ...initialState,
  });
  const [retry, setRetry] = useState(() => () => {});
  const safeDispatch = useSafeDispatch(dispatch);
  const setData = useCallback((data: D) => safeDispatch({ data, stat: 'success', error: null }), [safeDispatch]);
  const setError = useCallback((error: Error) => safeDispatch({ error, stat: 'error', data: null }), [safeDispatch]);
  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      if (!promise || !promise.then) {
        throw new TypeError('请传入 Promise 类型');
      }
      if (runConfig?.retry) {
        setRetry(() => () => run(runConfig.retry(), runConfig));
      }
      safeDispatch({ stat: 'loading' });
      return promise
        .then((data) => {
          setData(data);
          return data;
        })
        .catch((err) => {
          setError(err);
          return config.throwOnError ? Promise.reject(err) : err;
        });
    },
    [config.throwOnError, safeDispatch, setData, setError]
  );
  return {
    isIdle: state.stat === 'idle',
    isLoading: state.stat === 'loading',
    isError: state.stat === 'error',
    isSuccess: state.stat === 'success',
    run,
    setData,
    setError,
    // 重试/重新执行操作
    retry,
    ...state,
  };
}
