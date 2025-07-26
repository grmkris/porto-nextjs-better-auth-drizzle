"use client";

import { useAccount, useSignMessage } from "wagmi";
import { Button } from "@/components/ui/button";
import { authClient, siweNonce, siweVerify } from "@/lib/auth-client";
import { createSiweMessage } from "viem/siwe";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";

export function SignInButton() {
  const account = useAccount();
  const signMessage = useSignMessage();
  const session = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const signInMutation = useMutation({
    mutationFn: async () => {
      if (!account.address) {
        throw new Error("Address and chainId are required");
      }

      // 1. Get nonce from server
      const nonceResponse = await siweNonce(account.address);
      const nonce = nonceResponse.nonce;

      // 2. Create SIWE message
      const message = createSiweMessage({
        address: account.address,
        chainId: account.chainId!,
        domain: window.location.host,
        nonce,
        uri: window.location.origin,
        version: "1",
        statement: "Sign in with Ethereum to Unite DeFi",
      });

      console.log(message);

      // 3. Sign message with wallet
      const signature = await signMessage.signMessageAsync({
        message,
      });

      // 4. Verify signature with Better Auth
      const verifyResponse = await siweVerify({
        message,
        signature,
        walletAddress: account.address,
      });

      return verifyResponse;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      router.push("/dashboard");
    },
  });

  const signOutMutation = useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });

  if (session.data?.data?.user) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-sm font-medium">Authenticated</span>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Signed in as
          </p>
          <p className="font-medium">
            {session.data.data.user.name || session.data.data.user.email}
          </p>
        </div>
        <Button
          onClick={() => signOutMutation.mutate()}
          disabled={signOutMutation.isPending}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {signOutMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          {signOutMutation.isPending ? "Signing out..." : "Sign Out"}
        </Button>
      </div>
    );
  }

  if (!account.address) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={() => signInMutation.mutate()}
        disabled={signInMutation.isPending || !account.address}
        size="lg"
        className="gap-2"
      >
        {signInMutation.isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ShieldCheck className="h-5 w-5" />
        )}
        {signInMutation.isPending ? "Signing in..." : "Sign in with Ethereum"}
      </Button>
      {signInMutation.error && (
        <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span>{signInMutation.error.message}</span>
        </div>
      )}
    </div>
  );
}
