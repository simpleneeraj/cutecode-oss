import path from "node:path";
import { config } from "dotenv";
import DodoPayments from "dodopayments";
import type { Discount } from "dodopayments/resources/discounts";
import { PRODUCT_LIST } from "../../src/lib/billing/products";

config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV ?? "development"}`) });

const DAY_MS = 24 * 60 * 60 * 1000;

const FOUNDING = {
  code: "FOUNDING30",
  name: "Founding member: 30% off for life",
  percentBasisPoints: 3000,
  usageLimit: 100,
  validDays: 90,
};

type Environment = "test_mode" | "live_mode";

function resolveEnvironment(): Environment {
  const environment = process.env.DODO_PAYMENTS_ENVIRONMENT || "test_mode";
  const isLive = process.argv.includes("--live");
  if (environment === "live_mode" && !isLive) throw new Error("DODO_PAYMENTS_ENVIRONMENT is live_mode: pass --live");
  if (environment === "test_mode" && isLive) throw new Error("--live needs DODO_PAYMENTS_ENVIRONMENT=live_mode");
  if (environment !== "test_mode" && environment !== "live_mode") {
    throw new Error(`DODO_PAYMENTS_ENVIRONMENT must be test_mode or live_mode, got ${environment}`);
  }
  return environment;
}

function paidProductIds(): string[] {
  const ids = PRODUCT_LIST.flatMap(({ envKey }) => process.env[envKey] ?? []);
  if (ids.length !== PRODUCT_LIST.length) throw new Error("Every NEXT_PUBLIC_DODO_PRODUCT_* id must be set");
  return ids;
}

async function findByCode(sdk: DodoPayments, code: string): Promise<Discount | null> {
  return sdk.discounts.retrieveByCode(code).catch(() => null);
}

async function main(): Promise<void> {
  const isDryRun = process.argv.includes("--dry-run");
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) throw new Error("DODO_PAYMENTS_API_KEY is not set");
  const sdk = new DodoPayments({ bearerToken: apiKey, environment: resolveEnvironment() });
  const existing = await findByCode(sdk, FOUNDING.code);
  if (existing) {
    process.stdout.write(`kept     ${existing.discount_id}  ${existing.code} (used ${existing.times_used}/${existing.usage_limit ?? "∞"})\n`);
    return;
  }
  if (isDryRun) {
    process.stdout.write(`created  (would create)  ${FOUNDING.code}\n`);
    return;
  }
  const created = await sdk.discounts.create({
    type: "percentage",
    amount: FOUNDING.percentBasisPoints,
    code: FOUNDING.code,
    name: FOUNDING.name,
    usage_limit: FOUNDING.usageLimit,
    expires_at: new Date(Date.now() + FOUNDING.validDays * DAY_MS).toISOString(),
    restricted_to: paidProductIds(),
    preserve_on_plan_change: true,
    metadata: { app: "cutecode", campaign: "founding" },
  });
  process.stdout.write(`created  ${created.discount_id}  ${created.code} expires ${created.expires_at}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
