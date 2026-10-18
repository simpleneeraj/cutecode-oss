"use client";

import useBilling from "@/hooks/use-billing";
import { Link } from "@/components/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Plan } from "@/db/schema";
import { PLANS, isPlanAtLeast, type PlanKey } from "@/lib/billing/plans";
import { PRODUCTS, type BillingInterval } from "@/lib/billing/products";
import { getRedirectUrlWithParam } from "@/utils/url";
import { trackUpgrade } from "@/lib/analytics";

function signInHref(redirectTo = getRedirectUrlWithParam("upgrade", "true")) {
  return `/account/sign-in?redirectedFrom=${encodeURIComponent(redirectTo)}`;
}

function disabledLabel(tier: PlanKey, currentPlan: Plan, isAvailable: boolean) {
  if (tier === currentPlan) return "Current plan";
  if (tier === Plan.FREE) return "Free forever";
  if (isPlanAtLeast(currentPlan, tier)) return "Included";
  if (!isAvailable) return "Coming soon";
  return null;
}

type PlanCtaProps = {
  tier: PlanKey;
  currentPlan: Plan;
  interval: BillingInterval;
  isSignedIn: boolean;
  isLoaded: boolean;
  isAvailable: boolean;
  signInRedirect?: string;
};

export default function PlanCta({ tier, currentPlan, interval, isSignedIn, isLoaded, isAvailable, signInRedirect }: PlanCtaProps) {
  const { openCheckout, openPortal, isLoading } = useBilling();
  const label = disabledLabel(tier, currentPlan, isAvailable);

  if (tier === Plan.FREE || label) {
    return (
      <Button variant="outline" className="w-full" disabled>
        {label}
      </Button>
    );
  }

  if (!isSignedIn) {
    return (
      <Button className="w-full" onClick={() => trackUpgrade.ctaClicked(false)} render={<Link href={signInHref(signInRedirect)} />}>
        Sign in to upgrade
      </Button>
    );
  }

  const { slug } = PRODUCTS[tier][interval];

  async function onUpgrade() {
    trackUpgrade.ctaClicked(true);
    if (currentPlan === Plan.FREE) {
      await openCheckout(slug);
      return;
    }
    await openPortal();
  }

  return (
    <Button className="w-full" disabled={!isLoaded || isLoading} onClick={onUpgrade}>
      {isLoading && <Spinner />}
      {`Upgrade to ${PLANS[tier].name}`}
    </Button>
  );
}
