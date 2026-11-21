"use client";

import { useUser } from "@/hooks/use-auth";
import { useBillingStatus } from "@/hooks/use-billing-status";
import { can, limit, type Capability, type NumericCapability } from "@/lib/billing/plans";
import { Plan, SubscriptionStatus } from "@/db/schema";

const PLANS = Object.values(Plan);

function toPlan(value: unknown): Plan {
  return PLANS.find((plan) => plan === value) ?? Plan.FREE;
}

export function useSubscription() {
  const { user, isLoaded } = useUser();
  const { data: billing, isLoading: isBillingLoading } = useBillingStatus(!!user);

  const plan = toPlan(user?.publicMetadata?.plan);

  const subscriptionStatus = billing?.subscriptionStatus ?? SubscriptionStatus.ACTIVE;
  const gracePeriodEndRaw = billing?.gracePeriodEnd;
  const gracePeriodEnd = gracePeriodEndRaw ? new Date(gracePeriodEndRaw) : null;

  const isPastDue = subscriptionStatus === SubscriptionStatus.PAST_DUE;
  const isExpired =
    subscriptionStatus === SubscriptionStatus.EXPIRED || subscriptionStatus === SubscriptionStatus.UNPAID;

  const isFree = plan === Plan.FREE || isExpired;
  const activePlan = isFree ? Plan.FREE : plan;

  const showPaymentBanner = isPastDue && gracePeriodEnd !== null;

  return {
    plan,
    can: (capability: Capability) => can(activePlan, capability),
    limit: (capability: NumericCapability) => limit(activePlan, capability),
    subscriptionStatus,
    gracePeriodEnd,
    isFree,
    isPastDue,
    isExpired,
    showPaymentBanner,
    isLoaded: isLoaded && !isBillingLoading,
  };
}
