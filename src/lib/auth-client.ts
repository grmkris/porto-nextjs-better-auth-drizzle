import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { clientEnv } from "@/env/clientEnv";
import { getAddress } from "viem";

export const authClient = createAuthClient({
  baseURL: clientEnv.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [adminClient()],
});

/**
 * Get nonce for SIWE, This is a workaround since the siweClient plugin is not working yet
 * @param walletAddress - The wallet address to get the nonce for
 * @returns The nonce
 */
export const siweNonce = async (
  walletAddress: string,
): Promise<{ nonce: string }> => {
  const response = await fetch(
    `${clientEnv.NEXT_PUBLIC_BETTER_AUTH_URL}/siwe/nonce`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress: getAddress(walletAddress),
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to get nonce");
  }

  return response.json();
};

/**
 * Verify SIWE signature, This is a workaround since the siweClient plugin is not working yet
 * @param message - The SIWE message
 * @param signature - The signature
 * @param walletAddress - The wallet address
 * @returns The session
 */
export const siweVerify = async (props: {
  message: string;
  signature: string;
  walletAddress: string;
}) => {
  const response = await fetch(
    `${clientEnv.NEXT_PUBLIC_BETTER_AUTH_URL}/siwe/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: props.message,
        signature: props.signature,
        walletAddress: props.walletAddress,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to verify signature");
  }

  return response.json();
};
