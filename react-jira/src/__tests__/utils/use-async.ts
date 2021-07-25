import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { useAsync } from 'utils/use-async';

const defaultState: ReturnType<typeof useAsync> = {
  stat: 'idle',
  data: null,
  error: null,

  isIdle: true,
  isError: false,
  isLoaing: false,
  isSuccess: false,

  run: expect.any(Function),
  setData: expect.any(Function),
  setError: expect.any(Function),
  retry: expect.any(Function),
};

const loadingState: ReturnType<typeof useAsync> = { ...defaultState, stat: 'loading', isLoaing: true, isIdle: false };
const successState: ReturnType<typeof useAsync> = { ...defaultState, stat: 'success', isSuccess: true, isIdle: false };

test('useAsync', async () => {
  let resolve: (val: unknown) => void, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const { result } = renderHook(() => useAsync());
  expect(result.current).toEqual(defaultState);

  let p: Promise<any>;
  act(() => {
    p = result.current.run(promise);
  });
  expect(result.current).toEqual(loadingState);

  const resolveValue = { mockValue: 'resolve' };
  await act(async () => {
    resolve(resolveValue);
    await p;
  });
  expect(result.current).toEqual({ ...successState, data: resolveValue });
});
