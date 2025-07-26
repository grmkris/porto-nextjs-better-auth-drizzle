import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
