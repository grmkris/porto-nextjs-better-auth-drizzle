"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Check } from "lucide-react";

export function WalletConnect() {
  const account = useAccount();
  const { disconnect } = useDisconnect();

  const { connectors, connect } = useConnect();
  const connector = connectors.find(
    (connector) => connector.id === "xyz.ithaca.porto",
  )!;

  if (account.address) {
    return (
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <Check className="h-5 w-5" />
          <span className="text-sm font-medium">Wallet Connected</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
            <span className="font-mono text-sm">
              {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </span>
          </div>
          <Button
            onClick={() => disconnect()}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button onClick={() => connect({ connector })} size="lg" className="gap-2">
      <Wallet className="h-5 w-5" />
      Connect Porto Wallet
    </Button>
  );
}
