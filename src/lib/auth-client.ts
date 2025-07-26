import { createAuthClient } from "better-auth/react";
import { siweClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [siweClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  siwe,
} = authClient;