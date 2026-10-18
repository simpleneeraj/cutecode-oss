import { readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "dotenv";

const TEMPLATE_DATABASE = "cutecode_test";

function developmentUrl() {
  const file = path.resolve(import.meta.dirname, "../../../.env.development");
  const url = parse(readFileSync(file)).DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing from .env.development");
  return new URL(url);
}

function withDatabase(name: string) {
  const url = process.env.TEST_DATABASE_URL ? new URL(process.env.TEST_DATABASE_URL) : developmentUrl();
  url.pathname = `/${name}`;
  url.searchParams.delete("uselibpqcompat");
  return url.toString();
}

export function templateDatabaseUrl() {
  return withDatabase(TEMPLATE_DATABASE);
}

export function workerDatabaseUrl() {
  return withDatabase(`${TEMPLATE_DATABASE}_${process.env.VITEST_POOL_ID ?? "0"}`);
}

export function adminDatabaseUrl() {
  return withDatabase("postgres");
}

export function databaseName(url: string) {
  const name = new URL(url).pathname.slice(1);
  if (!name.startsWith(TEMPLATE_DATABASE)) throw new Error(`Refusing to touch non-test database "${name}"`);
  return name;
}

export const TEMPLATE_NAME = TEMPLATE_DATABASE;
