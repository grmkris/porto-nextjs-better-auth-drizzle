"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "@/hooks/useSession";

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();

  const signOutMutation = useMutation({
    mutationFn: async () => {
      await authClient.signOut();
      router.push("/");
    },
  });

  if (session.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!session.data?.data?.user) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold">Welcome!</h2>
            <p className="text-gray-600 dark:text-gray-300">
              You are successfully authenticated with your wallet.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Session Details</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">User ID:</span>{" "}
                <span className="font-mono text-sm">
                  {session.data.data.user.id}
                </span>
              </div>
              {session.data.data.user.email && (
                <div>
                  <span className="font-medium">Email:</span>{" "}
                  <span>{session.data.data.user.email}</span>
                </div>
              )}
              {session.data.data.user.name && (
                <div>
                  <span className="font-medium">Name:</span>{" "}
                  <span>{session.data.data.user.name}</span>
                </div>
              )}
              <div>
                <span className="font-medium">Created At:</span>{" "}
                <span>
                  {new Date(session.data.data.user.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => signOutMutation.mutate()}
              disabled={signOutMutation.isPending}
              variant="outline"
            >
              {signOutMutation.isPending ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
