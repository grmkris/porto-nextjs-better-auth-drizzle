import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, siwe } from "better-auth/plugins";
import { db } from "@/server/db/drizzle";
import { serverEnv } from "@/env/serverEnv";
import { verifyMessage, createPublicClient, http, getAddress } from "viem";
import { mainnet } from "viem/chains";
import { Porto, ServerActions } from "porto";
import { ServerClient } from "porto/viem";
import { hashMessage } from "viem";
import { generateSiweNonce, parseSiweMessage } from "viem/siwe";

const porto = Porto.create();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  baseURL: serverEnv.BETTER_AUTH_URL,
  secret: serverEnv.BETTER_AUTH_SECRET,
  plugins: [
    openAPI(),
    siwe({
      domain: "localhost:3000",
      emailDomainName: "unite-defi.com",
      anonymous: true,
      getNonce: async () => {
        // Generate a cryptographically secure random nonce
        return generateSiweNonce();
      },
      verifyMessage: async ({ message, signature, address }) => {
        console.log("verifyMessage", message, signature, address);
        try {
          const { address, chainId, nonce } = parseSiweMessage(message);

          // Verify the signature.
          const client = ServerClient.fromPorto(porto, { chainId });
          const valid = await ServerActions.verifySignature(client, {
            address: address!,
            digest: hashMessage(message),
            signature: signature as `0x${string}`,
          });
          return valid.valid;
        } catch (error) {
          console.error("SIWE verification failed:", error);
          return false;
        }
      },
      ensLookup: async ({ walletAddress }) => {
        try {
          // Optional: lookup ENS name and avatar using viem
          const client = createPublicClient({
            chain: mainnet,
            transport: http(),
          });

          const ensName = await client.getEnsName({
            address: getAddress(walletAddress),
          });

          const ensAvatar = ensName
            ? await client.getEnsAvatar({
                name: ensName,
              })
            : null;

          return {
            name: ensName || walletAddress,
            avatar: ensAvatar || "",
          };
        } catch {
          return {
            name: walletAddress,
            avatar: "",
          };
        }
      },
    }),
  ],
  logger: {
    level: "debug",
  },
});
