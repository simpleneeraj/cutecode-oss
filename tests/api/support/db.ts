import { sql } from "drizzle-orm";
import { db } from "@/db";

let tables: string[] | null = null;
let userOwnedTables: string[] | null = null;

async function publicTables() {
  if (tables) return tables;
  const { rows } = await db.execute<{ name: string }>(
    sql`SELECT tablename AS name FROM pg_tables WHERE schemaname = 'public'`,
  );
  tables = rows.map((row) => row.name);
  return tables;
}

async function tablesWithUserCreatedAt() {
  if (userOwnedTables) return userOwnedTables;
  const { rows } = await db.execute<{ name: string }>(sql`
    SELECT table_name AS name FROM information_schema.columns
    WHERE table_schema = 'public' AND column_name IN ('user_id', 'created_at')
    GROUP BY table_name HAVING count(*) = 2
  `);
  userOwnedTables = rows.map((row) => row.name);
  return userOwnedTables;
}

export async function resetDatabase() {
  const names = await publicTables();
  if (names.length === 0) return;
  await db.execute(sql.raw(`TRUNCATE ${names.map((name) => `"${name}"`).join(", ")} RESTART IDENTITY CASCADE`));
}

export async function backdate(userId: string, hoursAgo: number) {
  for (const name of await tablesWithUserCreatedAt()) {
    await db.execute(
      sql`UPDATE ${sql.identifier(name)} SET created_at = now() - make_interval(hours => ${hoursAgo}) WHERE user_id = ${userId}`,
    );
  }
}
