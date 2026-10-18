"use client";

import { tv } from "tailwind-variants";
import type { PricingResult } from "@/hooks/use-pricing";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Plan } from "@/db/schema";
import { PLANS, type PlanKey } from "@/lib/billing/plans";
import type { BillingInterval } from "@/lib/billing/products";
import PlanCta from "./plan-cta";
import PlanFeatures from "./plan-features";
import PlanPrice from "./plan-price";

const RECOMMENDED_TIER = Plan.PREMIUM;

const TIER_DESCRIPTION = {
  FREE: "All Classic and Brand themes and core exports.",
  PRO: "Premium themes and fonts, watermark-free exports.",
  PREMIUM: "Higher-resolution exports, private shares and analytics.",
} satisfies Record<PlanKey, string>;

const planCard = tv({
  slots: {
    base: "md:row-span-4 md:grid md:grid-rows-subgrid md:gap-0",
    header: "flex flex-col gap-2 px-6 pt-6",
    title: "flex h-5 items-center justify-between gap-2 text-sm font-medium text-foreground",
    description: "text-sm text-pretty text-muted-foreground",
    cta: "px-6 pt-6",
  },
  variants: {
    isRecommended: {
      true: { base: "order-first border-primary/48 ring-1 ring-primary/24 md:order-none" },
    },
  },
});

type PlanCardProps = {
  tier: PlanKey;
  currentPlan: Plan;
  interval: BillingInterval;
  isSignedIn: boolean;
  isLoaded: boolean;
  pricing?: PricingResult;
  signInRedirect?: string;
};

export default function PlanCard({ tier, currentPlan, interval, isSignedIn, isLoaded, pricing, signInRedirect }: PlanCardProps) {
  const isRecommended = tier === RECOMMENDED_TIER;
  const styles = planCard({ isRecommended });
  const isAvailable = tier === Plan.FREE || (pricing?.[tier][interval].available ?? true);

  return (
    <Card className={styles.base()}>
      <div className={styles.header()}>
        <div className={styles.title()}>
          {PLANS[tier].name}
          {isRecommended && <Badge>Most popular</Badge>}
        </div>
        <p className={styles.description()}>{TIER_DESCRIPTION[tier]}</p>
      </div>
      <PlanPrice tier={tier} interval={interval} pricing={pricing} />
      <div className={styles.cta()}>
        <PlanCta
          tier={tier}
          currentPlan={currentPlan}
          interval={interval}
          isSignedIn={isSignedIn}
          isLoaded={isLoaded}
          isAvailable={isAvailable}
          isRecommended={isRecommended}
          signInRedirect={signInRedirect}
        />
      </div>
      <PlanFeatures features={PLANS[tier].features} />
    </Card>
  );
}
