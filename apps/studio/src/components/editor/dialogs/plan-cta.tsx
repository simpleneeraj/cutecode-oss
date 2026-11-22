"use client";

import useBilling from "@/hooks/use-billing";
import { Link } from "@/components/link";
import { Button } from "@cutecode/ui/components/button";
import { Spinner } from "@cutecode/ui/components/spinner";
import { Plan } from "@/db/schema";
import { PLANS, isPlanAtLeast, type PlanKey } from "@/lib/billing/plans";
import { PRODUCTS, type BillingInterval } from "@/lib/billing/products";
import { getRedirectUrlWithParam } from "@/utils/url";
import { trackUpgrade } from "@/lib/analytics";
import { tv } from "tailwind-variants";

const planCta = tv({
  base: "h-control-large w-full px-control-inset-medium text-density-body",
});

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
  isRecommended: boolean;
  signInRedirect?: string;
};

export default function PlanCta({ tier, currentPlan, interval, isSignedIn, isLoaded, isAvailable, isRecommended, signInRedirect }: PlanCtaProps) {
  const { openCheckout, openPortal, isLoading } = useBilling();
  const label = disabledLabel(tier, currentPlan, isAvailable);
  const variant = isRecommended ? "default" : "outline";

  if (tier === Plan.FREE || label) {
    return (
      <Button variant="outline" className={planCta()} disabled>
        {label}
      </Button>
    );
  }

  if (!isSignedIn) {
    return (
      <Button variant={variant} className={planCta()} onClick={() => trackUpgrade.ctaClicked(false)} render={<Link href={signInHref(signInRedirect)} />}>
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
    <Button variant={variant} className={planCta()} disabled={!isLoaded || isLoading} onClick={onUpgrade}>
      {isLoading && <Spinner />}
      {`Upgrade to ${PLANS[tier].name}`}
    </Button>
  );
}
