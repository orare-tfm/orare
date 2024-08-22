'use client';
import React from 'react';
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

type Props = {
    children: React.ReactNode;
}

const queryClient = new QueryClient();

const Providers = ({ children }: Props) => {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Providers;
