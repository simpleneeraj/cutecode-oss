import type { PricingResult } from "@/hooks/use-pricing";
import { Plan } from "@/db/schema";
import { PLANS, type PlanKey } from "@/lib/billing/plans";
import { BillingInterval } from "@/lib/billing/products";

const INTERVAL_LABEL = {
  monthly: "/ month",
  yearly: "/ year",
} satisfies Record<BillingInterval, string>;

type PlanPriceProps = {
  tier: PlanKey;
  interval: BillingInterval;
  pricing?: PricingResult;
};

function priceDetails(tier: PlanKey, interval: BillingInterval, pricing?: PricingResult) {
  if (tier === Plan.FREE) return { price: "$0", listPrice: null, label: "forever" };
  const info = pricing?.[tier][interval];
  return {
    price: info?.price ?? `$${PLANS[tier].prices[interval]}`,
    listPrice: info?.listPrice ?? null,
    label: INTERVAL_LABEL[interval],
  };
}

function yearlySavingNote(tier: PlanKey, interval: BillingInterval) {
  if (tier === Plan.FREE || interval !== BillingInterval.YEARLY) return null;
  const { monthly, yearly } = PLANS[tier].prices;
  const percent = Math.round((1 - yearly / (monthly * 12)) * 100);
  return `Billed yearly, save ${percent}%`;
}

export default function PlanPrice({ tier, interval, pricing }: PlanPriceProps) {
  const { price, listPrice, label } = priceDetails(tier, interval, pricing);
  const savingNote = yearlySavingNote(tier, interval);

  return (
    <div className="flex flex-col gap-1 px-6 pt-6">
      <div className="flex items-baseline gap-1">
        <span className="font-heading text-4xl font-semibold tracking-tight tabular-nums text-foreground">{price}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex h-4 items-center gap-2 text-xs text-muted-foreground">
        {listPrice && <span className="line-through tabular-nums">{listPrice}</span>}
        {savingNote}
      </div>
    </div>
  );
}
