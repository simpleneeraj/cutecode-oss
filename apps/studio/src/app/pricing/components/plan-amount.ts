import type { PricingResult } from "@/hooks/use-pricing";
import { Plan } from "@/db/schema";
import { PLANS, type PlanKey } from "@/lib/billing/plans";
import { BillingInterval } from "@/lib/billing/products";

const intervalLabels = {
  monthly: "/ month",
  yearly: "/ year",
} satisfies Record<BillingInterval, string>;

export function planAmount(tier: PlanKey, interval: BillingInterval, pricing?: PricingResult) {
  if (tier === Plan.FREE) return { price: "$0", period: "forever", listPrice: null };
  const info = pricing?.[tier][interval];
  return {
    price: info?.price ?? `$${PLANS[tier].prices[interval]}`,
    period: intervalLabels[interval],
    listPrice: info?.listPrice ?? null,
  };
}

export function yearlySavingNote(tier: PlanKey, interval: BillingInterval) {
  const isPaidYearly = tier !== Plan.FREE && interval === BillingInterval.YEARLY;
  if (!isPaidYearly) {
    return null;
  }
  const { monthly, yearly } = PLANS[tier].prices;
  const percent = Math.round((1 - yearly / (monthly * 12)) * 100);
  return `Billed yearly, save ${percent}%`;
}
