import { ReactNode } from 'react';
import { AuthProvider } from './auth-context';
import { QueryClientProvider, QueryClient } from 'react-query';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
