"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Wallet, ShieldCheck, Loader2, LogOut } from "lucide-react";
import { useSession } from "@/hooks/useSession";

export function PortoConnect() {
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const { connectors, connect } = useConnect({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries();
        router.push("/dashboard");
      },
    },
  });
  const session = useSession();
  const queryClient = useQueryClient();

  const connector = connectors.find(
    (connector) => connector.id === "xyz.ithaca.porto",
  )!;

  const signOutMutation = useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });

  // State 1: Not connected to wallet
  if (!account.address) {
    return (
      <Button
        onClick={() =>
          connect({
            connector,
            capabilities: {
              signInWithEthereum: {
                authUrl: {
                  logout: "/api/auth/sign-out",
                  nonce: "/api/auth/siwe/nonce",
                  verify: "/api/auth/siwe/verify",
                },
              },
            },
          })
        }
        size="lg"
      >
        <Wallet className="h-5 w-5" />
        Connect Porto Wallet
      </Button>
    );
  }

  // State 2: Connected to wallet but not authenticated
  if (!session.data?.data?.user) {
    return (
      <div className="flex flex-col gap-3 p-4 bg-card rounded-lg border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-xs text-muted-foreground">Connected</p>
              <p className="font-mono text-sm">
                {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </p>
            </div>
          </div>
          <button
            onClick={() => disconnect()}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            disconnect
          </button>
        </div>
      </div>
    );
  }

  // State 3: Fully authenticated
  return (
    <div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg border">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium">
            {session.data.data.user.name ||
              session.data.data.user.email ||
              "User"}
          </p>
          <p className="text-xs text-muted-foreground">Authenticated</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-2">
          <Wallet className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-xs text-muted-foreground">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </span>
        </div>
        <Button
          onClick={() => signOutMutation.mutate()}
          disabled={signOutMutation.isPending}
          variant="ghost"
          size="sm"
        >
          {signOutMutation.isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <LogOut className="h-3 w-3" />
          )}
          Sign Out
        </Button>
      </div>
    </div>
  );
}
