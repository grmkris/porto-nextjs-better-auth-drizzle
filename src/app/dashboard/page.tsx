"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/hooks/useSession";
import { Skeleton } from "@/components/ui/skeleton";

import { TRPCClientError } from "@trpc/client";
import { useTRPC } from "../trpc/client";

export default function Dashboard() {
  const trpc = useTRPC();
  const session = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const queryClient = useQueryClient();
  // tRPC queries
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery(trpc.profile.queryOptions());
  const {
    data: walletAddresses,
    isLoading: walletsLoading,
    error: walletsError,
  } = useQuery(trpc.walletAddresses.queryOptions());
  const {
    data: userStats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery(trpc.userStats.queryOptions());

  // tRPC mutations
  const updateProfileMutation = useMutation({
    ...trpc.updateProfile.mutationOptions(),
    onSuccess: async () => {
      setIsEditing(false);
      await queryClient.invalidateQueries();
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      await authClient.signOut();
    },
    onSuccess: async () => {
      router.push("/");
      await queryClient.invalidateQueries();
    },
  });

  // Handle errors
  const error = profileError || walletsError || statsError;
  if (error instanceof TRPCClientError && error.data?.code === "UNAUTHORIZED") {
    router.push("/");
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Unauthorized Access</h2>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (session.isPending || profileLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <Skeleton className="h-9 w-48 mb-6" />

            {/* Profile Section Skeleton */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-5 w-72" />
                <Skeleton className="h-5 w-80" />
              </div>
            </div>

            {/* Wallets Section Skeleton */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-96" />
                <Skeleton className="h-5 w-96" />
              </div>
            </div>

            {/* Stats Section Skeleton */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-60" />
                <Skeleton className="h-5 w-60" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-52" />
              </div>
            </div>

            <div className="flex justify-end">
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session.data?.data?.user || !profile) {
    return null;
  }

  const handleEditProfile = () => {
    setEditName(profile.name);
    setEditEmail(profile.email);
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      name: editName !== profile.name ? editName : undefined,
      email: editEmail !== profile.email ? editEmail : undefined,
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          {/* Profile Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Profile Information</h3>
              {!isEditing && (
                <Button onClick={handleEditProfile} variant="outline" size="sm">
                  Edit
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {isEditing ? (
                <>
                  <div>
                    <label className="font-medium text-sm">Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-sm">Email</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={updateProfileMutation.isPending}
                      size="sm"
                    >
                      {updateProfileMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    <span>{profile.name}</span>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    <span>{profile.email}</span>
                  </div>
                  <div>
                    <span className="font-medium">User ID:</span>{" "}
                    <span className="font-mono text-sm">{profile.id}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Wallet Addresses Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Connected Wallets</h3>
            {walletsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            ) : walletAddresses && walletAddresses.length > 0 ? (
              <div className="space-y-2">
                {walletAddresses.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono text-sm">
                        {wallet.address}
                      </span>
                      {wallet.isPrimary && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      Chain ID: {wallet.chainId}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No wallet addresses connected</p>
            )}
          </div>

          {/* User Stats Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Account Statistics</h3>
            {statsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-60" />
                <Skeleton className="h-5 w-60" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-52" />
              </div>
            ) : userStats ? (
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Account Created:</span>{" "}
                  <span>
                    {new Date(userStats.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>{" "}
                  <span>
                    {new Date(userStats.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Email Verified:</span>{" "}
                  <span>{userStats.emailVerified ? "Yes" : "No"}</span>
                </div>
                <div>
                  <span className="font-medium">Connected Wallets:</span>{" "}
                  <span>{userStats.walletCount}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No statistics available</p>
            )}
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
