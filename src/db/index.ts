import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "./schema";

config({ path: ".env" }); // or .env.local

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "POSTGRES_URL or DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });

export * from "./schema";
