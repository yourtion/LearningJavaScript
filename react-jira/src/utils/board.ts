import { QueryKey, useMutation, useQuery } from 'react-query';
import { Board } from 'types';
import { cleanObject } from 'utils';
import { useHttp } from './http';
import { reorder } from './reorder';
import { useAddConfig, useConfig, useDeleteConfig } from './use-optimistic-options';

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

export function useDeleteBoard(queryKey: QueryKey) {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`kanbans/${id}`, {
        method: 'DELETE',
      }),
    useDeleteConfig(queryKey)
  );
}

const useReorderBoardConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => reorder({ list: old, ...target }));

interface SortProps {
  // 要重新排序 item
  fromId: number;
  // 目标 item
  referenceId: number;
  // 在目标 item 前/后
  type: 'before' | 'after';
}
export function useReorderBoard(queryKey: QueryKey) {
  const client = useHttp();
  return useMutation(
    (param: SortProps) =>
      client(`kanbans/reorder`, {
        method: 'POST',
        data: param,
      }),
    useReorderBoardConfig(queryKey)
  );
}
