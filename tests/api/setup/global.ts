import path from "node:path";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { databaseName, templateDatabaseUrl } from "./database-url";
import { recreateDatabase } from "./admin";

export default async function setup() {
  const url = templateDatabaseUrl();
  await recreateDatabase(databaseName(url));
  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    await migrate(drizzle(client), { migrationsFolder: path.resolve(import.meta.dirname, "../../../drizzle") });
  } finally {
    await client.end();
  }
}
