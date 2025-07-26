"use client";

import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import { TRPCReactProvider } from "@/app/trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { getConfig } from "@/config/wagmiConfig";

export function Providers({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config} initialState={initialState}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
