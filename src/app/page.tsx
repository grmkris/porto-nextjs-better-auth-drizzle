"use client";

import { PortoConnect } from "@/components/features/PortoConnect";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
        <h1 className="text-4xl font-bold mb-8">Welcome to Unite DeFi</h1>

        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground mb-4">
            Connect and authenticate with your Porto wallet to get started
          </p>
          <PortoConnect />
        </div>
      </div>
    </div>
  );
}
