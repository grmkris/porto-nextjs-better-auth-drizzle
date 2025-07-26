import { defineConfig } from "drizzle-kit";
import { serverEnv } from "@/env/serverEnv";

export default defineConfig({
  schema: "./server/schema.db.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
});
