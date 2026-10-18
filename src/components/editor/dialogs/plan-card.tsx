"use client";

import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CrownIcon, CubeIcon, FlashIcon, CheckmarkCircleIcon } from "@hugeicons/core-free-icons";
import type { PricingResult } from "@/hooks/use-pricing";
import { cn } from "@/utils/cn";
import { Plan } from "@/db/schema";
import { PLANS, type PlanKey } from "@/lib/billing/plans";
import type { BillingInterval } from "@/lib/billing/products";
import PlanCta from "./plan-cta";

const TIER_ICON = {
  FREE: CubeIcon,
  PRO: FlashIcon,
  PREMIUM: CrownIcon,
} satisfies Record<PlanKey, typeof CubeIcon>;

const INTERVAL_LABEL = {
  monthly: "/ month",
  yearly: "/ year",
} satisfies Record<BillingInterval, string>;

type PlanCardProps = {
  tier: PlanKey;
  currentPlan: Plan;
  interval: BillingInterval;
  isSignedIn: boolean;
  isLoaded: boolean;
  pricing?: PricingResult;
  signInRedirect?: string;
};

function badgeLabel(tier: PlanKey, currentPlan: Plan) {
  if (tier === currentPlan) return "Current plan";
  if (tier === Plan.PREMIUM) return "Most popular";
  return null;
}

function priceDetails(tier: PlanKey, interval: BillingInterval, pricing?: PricingResult) {
  if (tier === Plan.FREE) return { price: "$0", listPrice: null, label: "forever", isAvailable: true };
  const info = pricing?.[tier][interval];
  return {
    price: info?.price ?? `$${PLANS[tier].prices[interval]}`,
    listPrice: info?.listPrice ?? null,
    label: INTERVAL_LABEL[interval],
    isAvailable: info?.available ?? true,
  };
}

export default function PlanCard({ tier, currentPlan, interval, isSignedIn, isLoaded, pricing, signInRedirect }: PlanCardProps) {
  const meta = PLANS[tier];
  const isCurrent = tier === currentPlan;
  const badge = badgeLabel(tier, currentPlan);
  const { price, listPrice, label, isAvailable } = priceDetails(tier, interval, pricing);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "relative flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-xs/5",
        isCurrent && "border-primary shadow-lg/8 ring-1 ring-primary",
      )}
    >
      {badge && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground shadow-xs/10">
          {badge}
        </span>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-muted text-foreground">
            <HugeiconsIcon icon={TIER_ICON[tier]} className="size-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-foreground">{meta.name}</span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-4xl font-semibold tracking-tight text-foreground">{price}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
          {listPrice && <span className="text-xs text-muted-foreground line-through">{listPrice}</span>}
        </div>
      </div>

      <ul className="flex flex-1 flex-col gap-2.5 border-t pt-4">
        {meta.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <HugeiconsIcon icon={CheckmarkCircleIcon} className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <PlanCta
        tier={tier}
        currentPlan={currentPlan}
        interval={interval}
        isSignedIn={isSignedIn}
        isLoaded={isLoaded}
        isAvailable={isAvailable}
        signInRedirect={signInRedirect}
      />
    </motion.div>
  );
}
