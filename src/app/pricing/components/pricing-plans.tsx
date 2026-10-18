"use client";

import { useState } from "react";
import { useUser } from "@/hooks/use-auth";
import { usePricing } from "@/hooks/use-pricing";
import { useSubscription } from "@/hooks/use-subscription";
import { Plan } from "@/db/schema";
import { BillingInterval } from "@/lib/billing/products";
import BillingIntervalTabs from "@/components/editor/dialogs/billing-interval-tabs";
import PlanCard from "@/components/editor/dialogs/plan-card";
import CheckoutNote from "@/components/editor/dialogs/checkout-note";

const TIERS = [Plan.FREE, Plan.PRO, Plan.PREMIUM];

export default function PricingPlans() {
  const { isSignedIn, isLoaded } = useUser();
  const { plan: currentPlan } = useSubscription();
  const { data: pricing } = usePricing();
  const [interval, setBillingInterval] = useState<BillingInterval>(BillingInterval.MONTHLY);

  return (
    <div className="flex flex-col gap-8">
      <BillingIntervalTabs value={interval} onChange={setBillingInterval} />

      <div className="grid gap-4 md:grid-cols-3">
        {TIERS.map((tier) => (
          <PlanCard
            key={tier}
            tier={tier}
            currentPlan={currentPlan}
            interval={interval}
            isSignedIn={isSignedIn}
            isLoaded={isLoaded}
            pricing={pricing}
            signInRedirect="/pricing"
          />
        ))}
      </div>

      <CheckoutNote />
    </div>
  );
}
