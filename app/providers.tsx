'use client'

import { type ReactNode, useState } from 'react'
import { type State, WagmiProvider } from 'wagmi'
import { TRPCReactProvider } from './trpc/client'

import { getConfig } from '../wagmiConfig'

export function Providers({
  children,
  initialState,
}: {
  children: ReactNode
  initialState?: State
}) {
  const [config] = useState(() => getConfig())

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </WagmiProvider>
  )
}