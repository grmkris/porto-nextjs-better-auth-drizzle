import { fileURLToPath } from "node:url";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build
jiti("./env/serverEnv.ts");
jiti("./env/clientEnv.ts");

/** @type {import('next').NextConfig} */
export default {
  /* config options here */
};
