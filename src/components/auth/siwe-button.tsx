"use client";

import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { Button } from "@/components/ui/button";
import { authClient, siweNonce, siweVerify } from "@/lib/auth-client";
import { createSiweMessage } from "viem/siwe";
import { useMutation } from "@tanstack/react-query";

export function SiweButton() {
  const { address, chainId, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { data: session, refetch } = authClient.useSession();
  
  const signInMutation = useMutation({
    mutationFn: async () => {
      if (!address || !chainId) {
        throw new Error("Address and chainId are required");
      }
      
      // 1. Get nonce from server
      const nonceResponse = await siweNonce(address, chainId.toString());
      const nonce = nonceResponse.nonce;

      // 2. Create SIWE message
      const message = createSiweMessage({
        address,
        chainId,
        domain: window.location.host,
        nonce,
        uri: window.location.origin,
        version: "1",
        statement: "Sign in with Ethereum to Unite DeFi",
      });

      // 3. Sign message with wallet
      const signature = await signMessageAsync({
        message,
      });

      // 4. Verify signature with Better Auth
      const verifyResponse = await siweVerify(
        message,
        signature,
        address,
        chainId.toString(),
        `${address.toLowerCase()}@unite-defi.com`
      );
      
      // 5. Refresh session after successful sign-in
      await refetch();
      
      return verifyResponse;
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      await authClient.signOut();
      await refetch();
    },
  });

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">
          {session.user.name || session.user.email}
        </span>
        <Button onClick={() => signOutMutation.mutate()} disabled={signOutMutation.isPending}>
          {signOutMutation.isPending ? "Signing out..." : "Sign Out"}
        </Button>
      </div>
    );
  }

  if (!isConnected) {
    return null; // Let wagmi handle wallet connection
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => signInMutation.mutate()} disabled={signInMutation.isPending || !address}>
        {signInMutation.isPending ? "Signing in..." : "Sign in with Ethereum"}
      </Button>
      {signInMutation.error && <p className="text-sm text-red-500">{signInMutation.error.message}</p>}
    </div>
  );
}