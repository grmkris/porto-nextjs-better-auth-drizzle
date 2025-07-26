'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'

export function PortoConnect() {
  const account = useAccount()
  const { disconnect } = useDisconnect()
  
  const { connectors, connect } = useConnect()
  const connector = connectors.find(
    (connector) => connector.id === 'xyz.ithaca.porto',
  )!

  if (account.address) 
    return (
      <div className="flex items-center gap-4">
        <div className="font-mono">
          {account.address.slice(0, 6)}...{account.address.slice(-4)}
        </div>
        <Button onClick={() => disconnect()} variant="outline">
          Sign out
        </Button>
      </div>
    )

  return (
    <Button onClick={() => connect({ connector })}>
      Sign in
    </Button>
  )
}