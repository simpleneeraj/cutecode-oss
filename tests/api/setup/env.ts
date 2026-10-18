import { vi } from "vitest";
import { databaseName, workerDatabaseUrl } from "./database-url";
import { TEST_ENV } from "../support/env";

const databaseUrl = workerDatabaseUrl();
databaseName(databaseUrl);

for (const key of ["AWS_REGION", "SES_FROM_EMAIL", "GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"]) {
  delete process.env[key];
}
Object.assign(process.env, TEST_ENV, { DATABASE_URL: databaseUrl });

vi.mock("@/lib/ses", () => ({
  sendVerificationEmail: vi.fn(async () => undefined),
  sendResetPassword: vi.fn(async () => undefined),
}));
