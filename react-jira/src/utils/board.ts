import { QueryKey, useMutation, useQuery } from 'react-query';
import { Board } from 'types';
import { cleanObject } from 'utils';
import { useHttp } from './http';
import { useAddConfig } from './use-optimistic-options';

export const KEY_BOARDS = 'boards';

export function useBoards(param?: Partial<Board>) {
  const client = useHttp();
  const data = cleanObject(param);
  return useQuery<Board[]>([KEY_BOARDS, data], () => client('kanbans', { data }));
}

export function useAddBoard(queryKey: QueryKey) {
  const client = useHttp();
  return useMutation(
    (params: Partial<Board>) =>
      client(`kanbans`, {
        method: 'POST',
        data: params,
      }),
    useAddConfig(queryKey)
  );
}
