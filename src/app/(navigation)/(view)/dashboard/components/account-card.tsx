"use client";

import { useSetAtom } from "jotai";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PLANS } from "@/lib/billing/plans";
import useBilling from "@/hooks/use-billing";
import { usePricing, type PricingResult } from "@/hooks/use-pricing";
import { Plan } from "@/db/schema";
import type { PaidPlan } from "@/lib/billing/products";
import { plansDialogOpenAtom } from "@/store/editor/plans";
import { FREE_DAILY_PUBLISH_LIMIT } from "@/lib/billing/constants";

type AccountCardProps = {
  plan: keyof typeof PLANS;
  renewsAt: string | null;
  cancelAtPeriodEnd: boolean;
  totalSnippets: number;
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));
}

const NEXT_PLAN: Record<Plan, PaidPlan | null> = {
  FREE: Plan.PRO,
  PRO: Plan.PREMIUM,
  PREMIUM: null,
};

function nextPlanPrice(plan: PaidPlan, pricing?: PricingResult) {
  const info = pricing?.[plan].monthly;
  if (info) return `${info.price}${info.interval}`;
  return `$${PLANS[plan].prices.monthly}/month`;
}

export function AccountCard({ plan, renewsAt, cancelAtPeriodEnd, totalSnippets }: AccountCardProps) {
  const { openPortal, isLoading } = useBilling();
  const setPlansOpen = useSetAtom(plansDialogOpenAtom);
  const { data: pricing } = usePricing();

  const isFree = plan === Plan.FREE;
  const planMeta = PLANS[plan];
  const nextPlan = NEXT_PLAN[plan];

  return (
    <Card className="flex h-fit flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Account</h2>
        <Badge variant={isFree ? "outline" : "secondary"} className="gap-1">
          <Icon icon="solar:crown-bold" className="size-3" />
          {planMeta.name}
        </Badge>
      </div>

      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Plan</dt>
          <dd className="font-medium text-foreground">{planMeta.name}</dd>
        </div>
        {nextPlan && (
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">{PLANS[nextPlan].name}</dt>
            <dd className="font-medium text-foreground tabular-nums">{nextPlanPrice(nextPlan, pricing)}</dd>
          </div>
        )}
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Snippets</dt>
          <dd className="font-medium text-foreground tabular-nums">{totalSnippets}</dd>
        </div>
        {isFree ? (
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Daily publishes</dt>
            <dd className="font-medium text-foreground">{FREE_DAILY_PUBLISH_LIMIT}/day</dd>
          </div>
        ) : (
          renewsAt && (
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">{cancelAtPeriodEnd ? "Ends" : "Renews"}</dt>
              <dd className="font-medium text-foreground">{formatDate(renewsAt)}</dd>
            </div>
          )
        )}
      </dl>

      {nextPlan && (
        <Button size="lg" className="w-full" onClick={() => setPlansOpen(true)}>
          <Icon icon="solar:crown-linear" className="size-4" />
          {`Upgrade to ${PLANS[nextPlan].name}`}
        </Button>
      )}
      {!isFree && (
        <Button variant="outline" size="lg" className="w-full" disabled={isLoading} onClick={openPortal}>
          <Icon icon="solar:card-linear" className="size-4" />
          Manage billing
        </Button>
      )}
    </Card>
  );
}
