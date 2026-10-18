import { Client } from "pg";
import { adminDatabaseUrl } from "./database-url";

export async function recreateDatabase(name: string, template?: string) {
  const admin = new Client({ connectionString: adminDatabaseUrl() });
  await admin.connect();
  try {
    await admin.query(`DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`);
    await admin.query(`CREATE DATABASE "${name}"${template ? ` TEMPLATE "${template}"` : ""}`);
  } finally {
    await admin.end();
  }
}
