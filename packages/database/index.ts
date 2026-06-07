import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "./env";

function isLocalDatabase(url: string) {
  return /localhost|127\.0\.0\.1/i.test(url);
}

function createPool() {
  const connectionString = env.DATABASE_URL;
  return new pg.Pool({
    connectionString,
    ssl: isLocalDatabase(connectionString) ? undefined : { rejectUnauthorized: false },
  });
}

export const db = drizzle(createPool());
export * from "drizzle-orm";
export default db;
