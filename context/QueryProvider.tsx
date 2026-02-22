import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh
      staleTime: 1000 * 30, // 30 seconds
      
      // Cache time: how long unused data stays in cache
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      
      // Retry failed requests
      retry: 2,
      
      // Refetch on window focus
      refetchOnWindowFocus: true,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      // Retry failed mutations
      retry: 1,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export { queryClient };
