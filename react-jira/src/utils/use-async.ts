import { useState } from 'react';

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: 'idle' | 'loading' | 'error' | 'success';
}

const defaultInintialState: State<null> = { stat: 'idle', data: null, error: null };
const defaultConfig = { throwOnError: false };

export function useAsync<D>(initialState?: State<D>, initialConfig?: typeof defaultConfig) {
  const config = { ...defaultConfig, ...initialConfig };
  const [state, setState] = useState<State<D>>({
    ...defaultInintialState,
    ...initialState,
  });
  const setData = (data: D) => setState({ data, stat: 'success', error: null });
  const setError = (error: Error) => setState({ error, stat: 'error', data: null });
  const run = (promise: Promise<D>) => {
    if (!promise || !promise.then) {
      throw new TypeError('请传入 Promise 类型');
    }
    setState({ ...state, stat: 'loading' });
    return promise
      .then((data) => {
        setData(data);
        return data;
      })
      .catch((err) => {
        setError(err);
        return config.throwOnError ? Promise.reject(err) : err;
      });
  };
  return {
    isIdle: state.stat === 'idle',
    isLoaing: state.stat === 'loading',
    isError: state.stat === 'error',
    isSuccess: state.stat === 'success',
    run,
    setData,
    setError,
    ...state,
  };
}
