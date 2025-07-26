import { http, createConfig, cookieStorage, createStorage } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { porto } from 'porto/wagmi'

export function getConfig() {
  return createConfig({
    chains: [base, baseSepolia],
    connectors: [porto()],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [base.id]: http(),
      [baseSepolia.id]: http(),
    },
  })
}