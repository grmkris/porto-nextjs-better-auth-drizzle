"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/app/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";

export function ClientGreeting() {
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(
    trpc.hello.queryOptions({ text: "Client Component" }),
  );

  if (isLoading)
    return (
      <div className="p-4 bg-blue-50 rounded">
        <Skeleton className="h-5 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div className="p-4 bg-blue-50 rounded">
      <h3 className="font-semibold">Client Component Response:</h3>
      <p>{data.greeting}</p>
    </div>
  );
}
