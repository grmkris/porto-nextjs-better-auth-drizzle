import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, siwe } from "better-auth/plugins";
import { db } from "@/server/db/drizzle";
import { serverEnv } from "@/env/serverEnv";
import { generateRandomString } from "better-auth/crypto";
import { verifyMessage, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  baseURL: serverEnv.BETTER_AUTH_URL,
  secret: serverEnv.BETTER_AUTH_SECRET,
  plugins: [
    openAPI(),
    siwe({
      domain: "localhost:3000", // Will be updated for production
      emailDomainName: "unite-defi.com",
      anonymous: false, // Require email for account creation
      getNonce: async () => {
        // Generate a cryptographically secure random nonce
        return generateRandomString(32);
      },
      verifyMessage: async ({ message, signature, address }) => {
        try {
          // Verify the signature using viem
          const isValid = await verifyMessage({
            address: address as `0x${string}`,
            message,
            signature: signature as `0x${string}`,
          });
          return isValid;
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
            address: walletAddress as `0x${string}`,
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
});