"use client";

import { PortoConnect } from "@/components/features/PortoConnect";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Unite DeFi</h1>

      <div className="flex flex-col items-center gap-4">
        <p className="text-gray-600 mb-4">
          Connect and authenticate with your Porto wallet to get started
        </p>
        <PortoConnect />
      </div>
    </div>
  );
}
