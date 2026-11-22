"use client";

import { useState } from "react";
import { useUser } from "@/hooks/use-auth";
import { usePricing } from "@/hooks/use-pricing";
import { useSubscription } from "@/hooks/use-subscription";
import { Plan } from "@/db/schema";
import { BillingInterval } from "@/lib/billing/products";
import BillingIntervalTabs from "@/components/editor/dialogs/billing-interval-tabs";
import CheckoutNote from "@/components/editor/dialogs/checkout-note";
import PlanPriceCard from "./plan-price-card";
import { planGridStyles } from "./style";

const tiers = [Plan.FREE, Plan.PRO, Plan.PREMIUM];

const styles = planGridStyles();

export default function PricingPlans() {
  const [interval, setBillingInterval] = useState<BillingInterval>(BillingInterval.MONTHLY);
  const { isSignedIn, isLoaded } = useUser();
  const { plan: currentPlan } = useSubscription();
  const { data: pricing } = usePricing();
  const viewer = { currentPlan, isSignedIn, isLoaded };

  return (
    <div className={styles.root()}>
      <BillingIntervalTabs value={interval} onChange={setBillingInterval} />
      <div className={styles.grid()}>
        {tiers.map((tier) => (
          <PlanPriceCard key={tier} tier={tier} interval={interval} pricing={pricing} viewer={viewer} />
        ))}
      </div>
      <CheckoutNote />
    </div>
  );
}
