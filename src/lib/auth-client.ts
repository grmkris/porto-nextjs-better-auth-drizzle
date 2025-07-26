import { createAuthClient } from "better-auth/react";
import { clientEnv } from "@/env/clientEnv";

export const authClient = createAuthClient({
  baseURL: clientEnv.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [],
});

// siweClient plugin is not working yet so we are manually using fetch to call the api
export const siweNonce = async (walletAddress: string, chainId: string) => {
  const response = await fetch(`${clientEnv.NEXT_PUBLIC_BETTER_AUTH_URL}/siwe/nonce`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      walletAddress, 
      chainId: chainId.toString() 
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to get nonce");
  }
  
  return response.json();
};

export const siweVerify = async (
  message: string, 
  signature: string, 
  walletAddress: string, 
  chainId: string,
  email?: string
) => {
  const response = await fetch(`${clientEnv.NEXT_PUBLIC_BETTER_AUTH_URL}/siwe/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      message, 
      signature, 
      walletAddress, 
      chainId: chainId.toString(),
      ...(email && { email })
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to verify signature");
  }
  
  return response.json();
};