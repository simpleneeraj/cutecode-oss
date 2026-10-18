import path from "node:path";
import { config } from "dotenv";
import DodoPayments from "dodopayments";
import type { TimeInterval } from "dodopayments/resources/subscriptions";
import type { Price, Product } from "dodopayments/resources/products/products";
import { PLANS } from "../../src/lib/billing/plans";
import { PRODUCT_LIST, type BillingInterval, type BillingProduct } from "../../src/lib/billing/products";

config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV ?? "development"}`) });

const PREFIX = "CuteCode";
const PAGE_SIZE = 100;

const PAYMENT_INTERVAL: Record<BillingInterval, TimeInterval> = {
  monthly: "Month",
  yearly: "Year",
};

const INTERVAL_NAME: Record<BillingInterval, string> = {
  monthly: "Monthly",
  yearly: "Yearly",
};

type Environment = "test_mode" | "live_mode";

type Wanted = { name: string; product: BillingProduct; price: Price.RecurringPrice };

function recurringPrice(cents: number, interval: BillingInterval): Price.RecurringPrice {
  return {
    type: "recurring_price",
    currency: "USD",
    price: cents,
    discount: 0,
    purchasing_power_parity: false,
    tax_inclusive: false,
    payment_frequency_count: 1,
    payment_frequency_interval: PAYMENT_INTERVAL[interval],
    subscription_period_count: 10,
    subscription_period_interval: "Year",
  };
}

function wantedProducts(): Wanted[] {
  return PRODUCT_LIST.map((product) => {
    const plan = PLANS[product.plan];
    return {
      name: `${PREFIX} ${plan.name} ${INTERVAL_NAME[product.interval]}`,
      product,
      price: recurringPrice(plan.prices[product.interval] * 100, product.interval),
    };
  });
}

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

function samePrice(found: Price, wanted: Price.RecurringPrice): boolean {
  if (found.type !== "recurring_price") return false;
  return (
    found.currency === wanted.currency &&
    found.price === wanted.price &&
    found.payment_frequency_interval === wanted.payment_frequency_interval &&
    found.payment_frequency_count === wanted.payment_frequency_count
  );
}

async function listOurs(sdk: DodoPayments): Promise<Map<string, Product>> {
  const ours = new Map<string, Product>();
  for (let page = 0; ; page += 1) {
    const { items } = await sdk.products.list({ page_number: page, page_size: PAGE_SIZE, recurring: true });
    for (const listed of items) {
      if (listed.name?.startsWith(PREFIX)) ours.set(listed.name, await sdk.products.retrieve(listed.product_id));
    }
    if (items.length < PAGE_SIZE) return ours;
  }
}

async function syncProduct(sdk: DodoPayments, wanted: Wanted, found: Product | undefined, isDryRun: boolean) {
  if (!found) {
    if (isDryRun) return { id: "(would create)", action: "created" };
    const created = await sdk.products.create({
      name: wanted.name,
      tax_category: "saas",
      price: wanted.price,
      metadata: { app: "cutecode", slug: wanted.product.slug },
    });
    return { id: created.product_id, action: "created" };
  }
  if (samePrice(found.price, wanted.price)) return { id: found.product_id, action: "kept" };
  if (!isDryRun) await sdk.products.update(found.product_id, { price: wanted.price });
  return { id: found.product_id, action: "updated" };
}

async function main(): Promise<void> {
  const isDryRun = process.argv.includes("--dry-run");
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) throw new Error("DODO_PAYMENTS_API_KEY is not set");
  const sdk = new DodoPayments({ bearerToken: apiKey, environment: resolveEnvironment() });
  const ours = await listOurs(sdk);
  const envLines: string[] = [];
  for (const wanted of wantedProducts()) {
    const { id, action } = await syncProduct(sdk, wanted, ours.get(wanted.name), isDryRun);
    process.stdout.write(`${action.padEnd(8)} ${id}  ${wanted.name}\n`);
    envLines.push(`${wanted.product.envKey}="${id}"`);
  }
  process.stdout.write(`\n${envLines.join("\n")}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
