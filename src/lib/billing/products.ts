import { Plan } from "@/db/enums";

export const BillingInterval = {
  MONTHLY: "monthly",
  YEARLY: "yearly",
} as const;

export type BillingInterval = (typeof BillingInterval)[keyof typeof BillingInterval];

export type PaidPlan = Exclude<Plan, "FREE">;

export type BillingProduct = {
  plan: PaidPlan;
  interval: BillingInterval;
  slug: string;
  envKey: string;
  productId: string | undefined;
};

function product(plan: PaidPlan, interval: BillingInterval, envKey: string, productId: string | undefined) {
  return { plan, interval, envKey, productId, slug: `${plan.toLowerCase()}-${interval}` };
}

export const PRODUCTS: Record<PaidPlan, Record<BillingInterval, BillingProduct>> = {
  PRO: {
    monthly: product(
      Plan.PRO,
      BillingInterval.MONTHLY,
      "NEXT_PUBLIC_DODO_PRODUCT_PRO_MONTHLY",
      process.env.NEXT_PUBLIC_DODO_PRODUCT_PRO_MONTHLY,
    ),
    yearly: product(
      Plan.PRO,
      BillingInterval.YEARLY,
      "NEXT_PUBLIC_DODO_PRODUCT_PRO_YEARLY",
      process.env.NEXT_PUBLIC_DODO_PRODUCT_PRO_YEARLY,
    ),
  },
  PREMIUM: {
    monthly: product(
      Plan.PREMIUM,
      BillingInterval.MONTHLY,
      "NEXT_PUBLIC_DODO_PRODUCT_PREMIUM_MONTHLY",
      process.env.NEXT_PUBLIC_DODO_PRODUCT_PREMIUM_MONTHLY,
    ),
    yearly: product(
      Plan.PREMIUM,
      BillingInterval.YEARLY,
      "NEXT_PUBLIC_DODO_PRODUCT_PREMIUM_YEARLY",
      process.env.NEXT_PUBLIC_DODO_PRODUCT_PREMIUM_YEARLY,
    ),
  },
};

export const PRODUCT_LIST = [
  PRODUCTS.PRO.monthly,
  PRODUCTS.PRO.yearly,
  PRODUCTS.PREMIUM.monthly,
  PRODUCTS.PREMIUM.yearly,
];

const LEGACY_PREMIUM_PRODUCT_ID = process.env.NEXT_PUBLIC_DODO_PRODUCT_PREMIUM;

export function planForProduct(productId: string): PaidPlan | undefined {
  if (productId === LEGACY_PREMIUM_PRODUCT_ID) return Plan.PREMIUM;
  return PRODUCT_LIST.find((listed) => listed.productId === productId)?.plan;
}
