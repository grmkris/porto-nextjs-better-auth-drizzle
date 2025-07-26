import { serverEnv } from "@/env/serverEnv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./auth-schema";

export const db = drizzle(serverEnv.DATABASE_URL, { schema });
