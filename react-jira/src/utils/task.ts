import { QueryKey, useMutation, useQuery } from 'react-query';
import { Task } from 'types';
import { cleanObject } from 'utils';
import { useHttp } from './http';
import { useAddConfig, useDeleteConfig, useEditConfig } from './use-optimistic-options';

export const KEY_TASKS = 'tasks';

export function useTasks(param?: Partial<Task>) {
  const client = useHttp();
  const data = cleanObject(param);
  return useQuery<Task[]>([KEY_TASKS, data], () => client('tasks', { data }));
}

export function useAddTask(queryKey: QueryKey) {
  const client = useHttp();
  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks`, {
        method: 'POST',
        data: params,
      }),
    useAddConfig(queryKey)
  );
}

export function useTask(id?: number) {
  const client = useHttp();
  return useQuery<Task>(['task', { id }], () => client(`tasks/${id}`), {
    enabled: !!id,
  });
}

export function useEditTask(queryKey: QueryKey) {
  const client = useHttp();

  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks/${params.id}`, {
        method: 'PATCH',
        data: params,
      }),
    useEditConfig(queryKey)
  );
}

export function useDeleteTasks(queryKey: QueryKey) {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`tasks/${id}`, {
        method: 'DELETE',
      }),
    useDeleteConfig(queryKey)
  );
}
