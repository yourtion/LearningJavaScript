import { useQuery } from 'react-query';
import { User } from 'types';
import { useHttp } from './http';

export const KEY_USERS = 'users';

export function useUsers(param?: Partial<User>) {
  const client = useHttp();
  return useQuery<User[]>([KEY_USERS, param], () => client('users', { data: param }));
}
