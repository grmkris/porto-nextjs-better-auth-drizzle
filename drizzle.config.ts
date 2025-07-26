import { defineConfig } from "drizzle-kit";
import { serverEnv } from "./src/env/serverEnv";

export default defineConfig({
  schema: "./src/server/db/schema.db.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
});
