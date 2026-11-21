import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.delete("uselibpqcompat");
    return u.toString();
  } catch {
    return url;
  }
}

const globalForDb = globalThis as unknown as { db: ReturnType<typeof createDb> | undefined };

function createDb() {
  const connectionString = normalizeUrl(process.env.DATABASE_URL!);
  const pool = new Pool({ connectionString });
  return drizzle(pool, { schema });
}

export const db = globalForDb.db ?? createDb();
if (process.env.NODE_ENV !== "production") globalForDb.db = db;

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export { schema };
