import "server-only";

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createTRPCContext } from "@/server/trpc/init";
import { makeQueryClient } from "@/server/trpc/query-client";
import { appRouter } from "@/server/trpc/routers/_app";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { TRPCQueryOptions } from "@trpc/tanstack-react-query";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: async () => {
    return createTRPCContext({
      headers: new Headers(),
    });
  },
  router: appRouter,
  queryClient: getQueryClient,
});

export const caller = appRouter.createCaller(async () => {
  return createTRPCContext({
    headers: new Headers(),
  });
});

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
