import { useQuery } from 'react-query';
import { Board } from 'types';
import { cleanObject } from 'utils';
import { useHttp } from './http';

export const KEY_BOARDS = 'boards';

export function useBoards(param?: Partial<Board>) {
  const client = useHttp();
  const data = cleanObject(param);
  return useQuery<Board[]>([KEY_BOARDS, data], () => client('kanbans', { data }));
}
