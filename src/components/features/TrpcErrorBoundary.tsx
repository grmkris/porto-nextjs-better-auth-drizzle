"use client";

import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface TrpcErrorBoundaryProps {
  children: React.ReactNode;
  error?: unknown;
}

export function TrpcErrorBoundary({ children, error }: TrpcErrorBoundaryProps) {
  const router = useRouter();

  useEffect(() => {
    if (error instanceof TRPCClientError) {
      if (error.data?.code === "UNAUTHORIZED") {
        // Redirect to home page if unauthorized
        router.push("/");
      }
    }
  }, [error, router]);

  if (error instanceof TRPCClientError) {
    if (error.data?.code === "UNAUTHORIZED") {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Unauthorized Access</h2>
            <p className="text-gray-600">Please sign in to continue.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
