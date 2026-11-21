import { defineConfig } from "drizzle-kit";
import path from "node:path";
import { config } from "dotenv";

const nodeEnv = process.env.NODE_ENV ?? "development";
config({ path: path.resolve(process.cwd(), `.env.${nodeEnv}`) });

export default defineConfig({
  schema: ["./src/db/auth-schema.ts", "./src/db/schema.ts"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
