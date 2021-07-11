import { useCallback } from 'react';
import { User } from 'screens/project-list/search-panel';
import { useMount } from 'utils';
import { useHttp } from './http';
import { useAsync } from './use-async';

export function useUsers(param?: Partial<User>) {
  const client = useHttp();
  const { run, ...result } = useAsync<User[]>();

  useMount(
    useCallback(() => {
      run(client('users'));
    }, [run, client])
  );

  return result;
}
