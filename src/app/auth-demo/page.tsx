"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { SiweButton } from "@/components/auth/siwe-button";

export default function AuthDemoPage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Better Auth + SIWE Demo</h1>

      <div className="space-y-6">
        {/* Wallet Connection */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Step 1: Connect Wallet</h2>

          {!isConnected ? (
            <div className="space-y-2">
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  className="w-full"
                >
                  Connect with {connector.name}
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Connected: {address}
              </p>
              <Button onClick={() => disconnect()} variant="outline">
                Disconnect Wallet
              </Button>
            </div>
          )}
        </div>

        {/* Authentication */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Step 2: Authenticate</h2>

          {isConnected ? (
            <SiweButton />
          ) : (
            <p className="text-sm text-muted-foreground">
              Please connect your wallet first
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
