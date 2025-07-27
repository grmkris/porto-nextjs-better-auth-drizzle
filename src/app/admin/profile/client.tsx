"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useTRPC } from "@/app/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function ProfileClient() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading } = useQuery(
    trpc.profile.queryOptions(),
  );
  const { data: stats, isLoading: statsLoading } = useQuery(
    trpc.userStats.queryOptions(),
  );
  const { data: walletAddresses } = useQuery(
    trpc.walletAddresses.queryOptions(),
  );

  const updateProfile = useMutation({
    ...trpc.updateProfile.mutationOptions(),
    onSuccess: () => {
      setIsEditing(false);
      // Refetch profile data
      queryClient.invalidateQueries(trpc.profile.queryOptions());
    },
  });

  // Initialize form data when profile loads
  if (profile && !isEditing && formData.name === "") {
    setFormData({
      name: profile.name || "",
      email: profile.email || "",
    });
  }

  const handleSave = () => {
    updateProfile.mutate({
      name: formData.name,
      email: formData.email,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: profile?.name || "",
      email: profile?.email || "",
    });
  };

  if (profileLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account information
          </p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter your name"
              />
            ) : (
              <p className="text-sm">{profile?.name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
              />
            ) : (
              <p className="text-sm">{profile?.email}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Role</Label>
            <div>
              <Badge
                variant={profile?.role === "admin" ? "default" : "secondary"}
              >
                {profile?.role || "user"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
          <CardDescription>Overview of your account activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Account Created</Label>
            <p className="text-sm">
              {stats?.createdAt
                ? new Date(stats.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Last Updated</Label>
            <p className="text-sm">
              {stats?.updatedAt
                ? new Date(stats.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Email Verification</Label>
            <div>
              <Badge variant={stats?.emailVerified ? "default" : "secondary"}>
                {stats?.emailVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Connected Wallets</Label>
            <p className="text-sm">
              {stats?.walletCount || 0} wallet(s) connected
            </p>
          </div>
        </CardContent>
      </Card>

      {walletAddresses && walletAddresses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Connected Wallets</CardTitle>
            <CardDescription>Your linked wallet addresses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {walletAddresses.map((wallet, index) => (
                <div key={wallet.id}>
                  {index > 0 && <Separator className="mb-3" />}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-mono">{wallet.address}</p>
                      <p className="text-xs text-muted-foreground">
                        Chain ID: {wallet.chainId}
                      </p>
                    </div>
                    {wallet.isPrimary && (
                      <Badge variant="outline">Primary</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
