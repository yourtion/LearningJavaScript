import { ReactNode } from 'react';
import { AuthProvider } from './auth-context';
import { QueryClientProvider, QueryClient } from 'react-query';

export function AppProviders({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
