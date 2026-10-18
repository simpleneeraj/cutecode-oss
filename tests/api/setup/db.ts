import { beforeEach } from "vitest";
import { databaseName, TEMPLATE_NAME, workerDatabaseUrl } from "./database-url";
import { recreateDatabase } from "./admin";
import { resetDatabase } from "../support/db";

const worker = globalThis as unknown as { testDatabaseReady?: boolean };

if (!worker.testDatabaseReady) {
  await recreateDatabase(databaseName(workerDatabaseUrl()), TEMPLATE_NAME);
  worker.testDatabaseReady = true;
}

beforeEach(async () => {
  await resetDatabase();
});
