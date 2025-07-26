"use client";

import { SignInButton } from "@/components/auth/sign-in-button";
import { WalletConnect } from "@/components/auth/wallet-connect";
import { useAccount } from "wagmi";

export default function Home() {
  const account = useAccount();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Unite DeFi</h1>

      <div className="flex flex-col items-center gap-4">
        {!account.address ? (
          <>
            <p className="text-gray-600 mb-4">
              First, connect your Porto wallet
            </p>
            <WalletConnect />
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-4">Now, sign in with your wallet</p>
            <SignInButton />
          </>
        )}
      </div>
    </div>
  );
}
