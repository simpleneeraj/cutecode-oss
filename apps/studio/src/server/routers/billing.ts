import { eq } from "drizzle-orm";
import type { Price } from "dodopayments/resources/products/products";
import { db } from "@/db";
import { Plan, subscriptions } from "@/db/schema";
import { SubscriptionStatus } from "@/db/schema";
import { dodoClient } from "@/lib/dodo";
import { cacheGet, cacheSet } from "@/lib/in-memory-store";
import { formatPrice } from "@/lib/billing/format";
import { PLANS } from "@/lib/billing/plans";
import { PRODUCTS, type BillingInterval, type BillingProduct, type PaidPlan } from "@/lib/billing/products";
import { router, protectedProcedure, publicProcedure } from "../init";

const PRICING_CACHE_TTL = 300;

const INTERVAL_LABEL: Record<BillingInterval, string> = {
  monthly: "/month",
  yearly: "/year",
};

export type PriceInfo = {
  productId: string | null;
  price: string;
  listPrice: string | null;
  currency: string;
  interval: string;
  discounted: boolean;
  available: boolean;
};

export type PlanPricing = Record<BillingInterval, PriceInfo>;

export type PricingResult = Record<PaidPlan, PlanPricing>;

function fallbackPrice(product: BillingProduct): PriceInfo {
  return {
    productId: product.productId ?? null,
    price: formatPrice(PLANS[product.plan].prices[product.interval] * 100, "USD"),
    listPrice: null,
    currency: "USD",
    interval: INTERVAL_LABEL[product.interval],
    discounted: false,
    available: Boolean(product.productId),
  };
}

function discountBps(price: Price.RecurringPrice): number {
  return price.discount_bps ?? (price.discount ?? 0) * 100;
}

async function fetchPrice(product: BillingProduct, productId: string): Promise<PriceInfo> {
  const { price } = await dodoClient.products.retrieve(productId);
  if (price.type !== "recurring_price") return fallbackPrice(product);
  const bps = discountBps(price);
  const hasDiscount = bps > 0;
  return {
    productId,
    price: formatPrice(price.price * (1 - bps / 10_000), price.currency),
    listPrice: hasDiscount ? formatPrice(price.price, price.currency) : null,
    currency: price.currency,
    interval: INTERVAL_LABEL[product.interval],
    discounted: hasDiscount,
    available: true,
  };
}

async function cachedPrice(product: BillingProduct): Promise<PriceInfo> {
  if (!product.productId) return fallbackPrice(product);
  const cacheKey = `pricing:${product.slug}`;
  const cached = await cacheGet<PriceInfo>(cacheKey);
  if (cached) return cached;
  try {
    const info = await fetchPrice(product, product.productId);
    await cacheSet(cacheKey, info, PRICING_CACHE_TTL);
    return info;
  } catch (error) {
    console.error(`[billing.pricing] failed to fetch ${product.slug}:`, error);
    return fallbackPrice(product);
  }
}

async function planPricing(plan: PaidPlan): Promise<PlanPricing> {
  const [monthly, yearly] = await Promise.all([cachedPrice(PRODUCTS[plan].monthly), cachedPrice(PRODUCTS[plan].yearly)]);
  return { monthly, yearly };
}

export const billingRouter = router({
  status: protectedProcedure.query(async ({ ctx }) => {
    const sub = await db.query.subscriptions.findFirst({ where: eq(subscriptions.userId, ctx.user.id) });

    return {
      plan: ctx.user.plan,
      subscriptionStatus: sub?.status ?? SubscriptionStatus.ACTIVE,
      gracePeriodEnd: sub?.gracePeriodEnd ?? null,
      renewsAt: sub?.currentPeriodEnd?.toISOString() ?? null,
      cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
    };
  }),

  pricing: publicProcedure.query(async (): Promise<PricingResult> => {
    const [pro, premium] = await Promise.all([planPricing(Plan.PRO), planPricing(Plan.PREMIUM)]);
    return { PRO: pro, PREMIUM: premium };
  }),
});
