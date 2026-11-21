"use client";

import { useUser } from "@/hooks/use-auth";
import { usePricing } from "@/hooks/use-pricing";
import { useSubscription } from "@/hooks/use-subscription";
import { Plan } from "@/db/schema";
import type { BillingInterval } from "@/lib/billing/products";
import PlanCard from "./plan-card";

const TIERS = [Plan.FREE, Plan.PRO, Plan.PREMIUM];

type PlanGridProps = {
  interval: BillingInterval;
  signInRedirect?: string;
};

export default function PlanGrid({ interval, signInRedirect }: PlanGridProps) {
  const { isSignedIn, isLoaded } = useUser();
  const { plan: currentPlan } = useSubscription();
  const { data: pricing } = usePricing();

  return (
    <div className="grid gap-4 md:grid-cols-3 md:gap-y-0">
      {TIERS.map((tier) => (
        <PlanCard
          key={tier}
          tier={tier}
          currentPlan={currentPlan}
          interval={interval}
          isSignedIn={isSignedIn}
          isLoaded={isLoaded}
          pricing={pricing}
          signInRedirect={signInRedirect}
        />
      ))}
    </div>
  );
}
