import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
import fs from "node:fs";
import path from "node:path";
import { env } from "./env";

const rootEnvFile = path.resolve(__dirname, "../../.env");
if (fs.existsSync(rootEnvFile)) {
  dotenv.config({ path: rootEnvFile });
}

export default defineConfig({
  out: "./drizzle",
  schema: "./schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
