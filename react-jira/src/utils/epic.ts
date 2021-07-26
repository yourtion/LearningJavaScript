import { QueryKey, useMutation, useQuery } from 'react-query';
import { Epic } from 'types';
import { cleanObject } from 'utils';
import { useHttp } from './http';
import { useAddConfig, useDeleteConfig } from './use-optimistic-options';

export const KEY_EPICS = 'epics';

export function useEpics(param?: Partial<Epic>) {
  const client = useHttp();
  const data = cleanObject(param);
  return useQuery<Epic[]>([KEY_EPICS, data], () => client('epics', { data }));
}

export function useAddEpic(queryKey: QueryKey) {
  const client = useHttp();
  return useMutation(
    (params: Partial<Epic>) =>
      client(`epics`, {
        method: 'POST',
        data: params,
      }),
    useAddConfig(queryKey)
  );
}

export function useDeleteEpic(queryKey: QueryKey) {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`epics/${id}`, {
        method: 'DELETE',
      }),
    useDeleteConfig(queryKey)
  );
}
