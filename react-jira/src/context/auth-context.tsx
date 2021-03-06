import React, { ReactNode, useCallback } from 'react';
import * as auth from 'auth-provider';
import { User } from 'screens/project-list/search-panel';
import { http } from 'utils/http';
import { useMount } from 'utils';
import { useAsync } from 'utils/use-async';
import { FullPageErrorFallback, FullPageLoading } from 'components/lib';
interface AuthForm {
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
  return user;
}

const AuthContext = React.createContext<
  | {
      user: User | null;
      login: (form: AuthForm) => Promise<void>;
      register: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
AuthContext.displayName = 'AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { run, isLoaing, isIdle, isError, error, data: user, setData: setUser } = useAsync<User | null>();

  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const logout = () => auth.logout().then(() => setUser(null));

  useMount(
    useCallback(() => {
      run(bootstrapUser());
    }, [run])
  );

  if (isIdle || isLoaing) {
    return <FullPageLoading />;
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  return <AuthContext.Provider children={children} value={{ user, login, register, logout }} />;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('userAuth 必须在 AuthProvider 中使用');
  return context;
}
