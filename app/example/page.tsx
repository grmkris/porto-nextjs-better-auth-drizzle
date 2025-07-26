import { HydrateClient, prefetch, trpc, caller } from '~/app/trpc/server';
import { Suspense } from 'react';
import { ClientGreeting } from './client-greeting';

export default async function ExamplePage() {
  prefetch(trpc.hello.queryOptions({ text: 'tRPC' }));

  return (
    <HydrateClient>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">tRPC Example</h1>
        
        <Suspense fallback={<div>Loading greeting...</div>}>
          <ClientGreeting />
        </Suspense>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Server Component Call</h2>
          <ServerGreeting />
        </div>
      </div>
    </HydrateClient>
  );
}

async function ServerGreeting() {
  const { greeting } = await caller.hello({ text: 'Server' });
  return <p className="text-gray-700">{greeting}</p>;
}