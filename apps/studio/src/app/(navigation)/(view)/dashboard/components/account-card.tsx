"use client";

import { useSetAtom } from "jotai";
import { Card } from "@cutecode/ui/components/card";
import { Badge } from "@cutecode/ui/components/badge";
import { Button } from "@cutecode/ui/components/button";
import { CardIcon } from "@solar-icons/react/linear/card";
import { CrownIcon } from "@solar-icons/react/linear/crown";
import { PLANS } from "@/lib/billing/plans";
import useBilling from "@/hooks/use-billing";
import { usePricing, type PricingResult } from "@/hooks/use-pricing";
import { Plan } from "@/db/schema";
import type { PaidPlan } from "@/lib/billing/products";
import { plansDialogOpenAtom } from "@/store/editor/plans";
import type { PublishQuota } from "@/lib/billing/publish-quota";
import { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue } from "@cutecode/ui/components/meter";
import PremiumBadge from "../../preview/components/premium-badge";

type AccountCardProps = {
  plan: keyof typeof PLANS;
  renewsAt: string | null;
  cancelAtPeriodEnd: boolean;
  totalSnippets: number;
  quota: PublishQuota;
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

function PublishMeter({ used, limit }: { used: number; limit: number }) {
  return (
    <Meter value={used} max={limit}>
      <div className="flex items-center justify-between">
        <MeterLabel className="font-normal text-muted-foreground">Daily publishes</MeterLabel>
        <MeterValue className="font-medium">{() => `${used}/${limit}`}</MeterValue>
      </div>
      <MeterTrack className="h-1.5 rounded-full">
        <MeterIndicator className="rounded-full" />
      </MeterTrack>
    </Meter>
  );
}

export function AccountCard({ plan, renewsAt, cancelAtPeriodEnd, totalSnippets, quota }: AccountCardProps) {
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
        {isFree ? <Badge variant="outline">{planMeta.name}</Badge> : <PremiumBadge plan={plan} />}
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
        {!isFree && renewsAt && (
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">{cancelAtPeriodEnd ? "Ends" : "Renews"}</dt>
            <dd className="font-medium text-foreground">{formatDate(renewsAt)}</dd>
          </div>
        )}
      </dl>

      {isFree && quota.dailyLimit !== null && <PublishMeter used={quota.dailyUsed} limit={quota.dailyLimit} />}

      {nextPlan && (
        <Button size="lg" className="w-full" onClick={() => setPlansOpen(true)}>
          <CrownIcon className="size-4" aria-hidden="true" />
          {`Upgrade to ${PLANS[nextPlan].name}`}
        </Button>
      )}
      {!isFree && (
        <Button variant="outline" size="lg" className="w-full" disabled={isLoading} onClick={openPortal}>
          <CardIcon className="size-4" aria-hidden="true" />
          Manage billing
        </Button>
      )}
    </Card>
  );
}
