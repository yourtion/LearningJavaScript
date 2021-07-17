import { ReactNode, useCallback } from 'react';
import * as auth from 'auth-provider';
import { User } from 'screens/project-list/search-panel';
import { http } from 'utils/http';
import { useMount } from 'utils';
import { useAsync } from 'utils/use-async';
import { FullPageErrorFallback, FullPageLoading } from 'components/lib';
import { bootstrap, selectUser } from 'store/auth.slice';
import * as authStore from 'store/auth.slice';
import { useDispatch, useSelector } from 'react-redux';
export interface AuthForm {
  username: string;
  password: string;
}

export async function bootstrapUser() {
  let user = null;
  const token = await auth.getToken();
  if (token) {
    const data = await http('me', { token });
    user = data.user;
  }
  return user as User;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { run, isLoaing, isIdle, isError, error } = useAsync<User | null>();
  const dispatch: (...args: unknown[]) => Promise<User> = useDispatch();

  useMount(
    useCallback(() => {
      run(dispatch(bootstrap()));
    }, [run, dispatch])
  );

  if (isIdle || isLoaing) {
    return <FullPageLoading />;
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  return <div>{children}</div>;
}

export function useAuth() {
  const dispatch: (...args: unknown[]) => Promise<User> = useDispatch();
  const user = useSelector(selectUser);
  const login = useCallback((form: AuthForm) => dispatch(authStore.login(form)), [dispatch]);
  const register = useCallback((form: AuthForm) => dispatch(authStore.register(form)), [dispatch]);
  const logout = useCallback(() => dispatch(authStore.logout()), [dispatch]);
  return { user, login, register, logout };
}
