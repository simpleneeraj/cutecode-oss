"use client";

import { useState } from "react";
import { useUser } from "@/hooks/use-auth";
import { usePricing } from "@/hooks/use-pricing";
import { useSubscription } from "@/hooks/use-subscription";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Plan } from "@/db/schema";
import { BillingInterval } from "@/lib/billing/products";
import PlanCard from "@/components/editor/dialogs/plan-card";

const TIERS = [Plan.FREE, Plan.PRO, Plan.PREMIUM];
const INTERVALS = Object.values(BillingInterval);

export default function PricingPlans() {
  const { isSignedIn, isLoaded } = useUser();
  const { plan: currentPlan } = useSubscription();
  const { data: pricing } = usePricing();
  const [interval, setBillingInterval] = useState<BillingInterval>(BillingInterval.MONTHLY);

  function onIntervalChange(value: string[]) {
    const next = INTERVALS.find((option) => value.includes(option));
    if (next) setBillingInterval(next);
  }

  return (
    <div className="flex flex-col gap-8">
      <ToggleGroup variant="outline" className="self-center" value={[interval]} onValueChange={onIntervalChange}>
        <ToggleGroupItem value={BillingInterval.MONTHLY}>Monthly</ToggleGroupItem>
        <ToggleGroupItem value={BillingInterval.YEARLY}>
          Yearly
          <Badge variant="success" size="sm">
            2 months free
          </Badge>
        </ToggleGroupItem>
      </ToggleGroup>

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

      <p className="text-center text-xs text-muted-foreground">Secure checkout · Cancel anytime · Instant access</p>
    </div>
  );
}
