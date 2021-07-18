import { useQuery } from 'react-query';
import { TaskType } from 'types';
import { useHttp } from './http';

export const KEY_TASKTYPES = 'tasksTypes';

export function useTaskTypes() {
  const client = useHttp();
  return useQuery<TaskType[]>([KEY_TASKTYPES], () => client('taskTypes'));
}
