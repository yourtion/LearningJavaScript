import { useQuery } from 'react-query';
import { Task } from 'types';
import { cleanObject } from 'utils';
import { useHttp } from './http';

export const KEY_TASKS = 'tasks';

export function useTasks(param?: Partial<Task>) {
  const client = useHttp();
  const data = cleanObject(param);
  return useQuery<Task[]>([KEY_TASKS, data], () => client('tasks', { data }));
}
