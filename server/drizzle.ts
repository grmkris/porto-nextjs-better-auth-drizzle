import { serverEnv } from "@/env/serverEnv";
import { drizzle } from "drizzle-orm/neon-http";

export const db = drizzle(serverEnv.DATABASE_URL);
