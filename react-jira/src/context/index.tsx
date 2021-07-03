import { ReactNode } from 'react';
import { AuthProvider } from './auth-context';

export function AppProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
