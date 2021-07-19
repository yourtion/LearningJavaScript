import { QueryKey, useMutation, useQuery } from 'react-query';
import { Task } from 'types';
import { cleanObject } from 'utils';
import { useHttp } from './http';
import { useAddConfig } from './use-optimistic-options';

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
