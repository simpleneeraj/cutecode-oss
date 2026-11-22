"use client";

import {
  PriceCard,
  PriceCardAmount,
  PriceCardFeatures,
  PriceCardHeader,
  PriceCardNote,
} from "@cutecode/ui/tactile/price-card";
import type { PricingResult } from "@/hooks/use-pricing";
import { Plan } from "@/db/schema";
import { PLANS, type PlanKey } from "@/lib/billing/plans";
import type { BillingInterval } from "@/lib/billing/products";
import PlanCta from "@/components/editor/dialogs/plan-cta";
import { planAmount, yearlySavingNote } from "./plan-amount";
import { planGridStyles } from "./style";

const featuredTier = Plan.PREMIUM;

const tierDescriptions = {
  FREE: "All Classic and Brand themes and core exports.",
  PRO: "Premium themes and fonts, watermark-free exports.",
  PREMIUM: "Higher-resolution exports, private shares and analytics.",
} satisfies Record<PlanKey, string>;

export type PlanViewer = {
  currentPlan: Plan;
  isSignedIn: boolean;
  isLoaded: boolean;
};

type PlanPriceCardProps = {
  tier: PlanKey;
  interval: BillingInterval;
  pricing?: PricingResult;
  viewer: PlanViewer;
};

export default function PlanPriceCard({ tier, interval, pricing, viewer }: PlanPriceCardProps) {
  const isFeatured = tier === featuredTier;
  const isAvailable = tier === Plan.FREE || (pricing?.[tier][interval].available ?? true);
  const { price, period, listPrice } = planAmount(tier, interval, pricing);
  const styles = planGridStyles({ isFeatured });

  return (
    <div className={styles.item()}>
      <PriceCard isFeatured={isFeatured}>
        <PriceCardHeader name={PLANS[tier].name} badge={isFeatured ? "Most popular" : undefined} />
        <div>
          <PriceCardAmount price={price} period={period} />
          <p className={styles.detail()}>
            {listPrice && <span className={styles.listPrice()}>{listPrice}</span>}
            {yearlySavingNote(tier, interval)}
          </p>
        </div>
        <PriceCardNote>{tierDescriptions[tier]}</PriceCardNote>
        <PlanCta
          tier={tier}
          currentPlan={viewer.currentPlan}
          interval={interval}
          isSignedIn={viewer.isSignedIn}
          isLoaded={viewer.isLoaded}
          isAvailable={isAvailable}
          isRecommended={isFeatured}
          signInRedirect="/pricing"
        />
        <PriceCardFeatures features={PLANS[tier].features} />
      </PriceCard>
    </div>
  );
}
