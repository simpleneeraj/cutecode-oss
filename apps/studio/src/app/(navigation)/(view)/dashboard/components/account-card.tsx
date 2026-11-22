"use client";

import type { ReactNode } from "react";
import { useSetAtom } from "jotai";
import type { Icon } from "@solar-icons/react/lib/types";
import { Button } from "@cutecode/ui/components/button";
import {
  ListGroup,
  ListGroupHeader,
  ListGroupRow,
  ListGroupRows,
  ListGroupTitle,
  ListGroupValue,
} from "@cutecode/ui/tactile/list-group";
import { Tone } from "@cutecode/ui/tactile/tone";
import { CalendarIcon } from "@solar-icons/react/linear/calendar";
import { CardIcon } from "@solar-icons/react/linear/card";
import { CodeSquareIcon } from "@solar-icons/react/linear/code-square";
import { CrownIcon } from "@solar-icons/react/linear/crown";
import { TagPriceIcon } from "@solar-icons/react/linear/tag-price";
import { UploadMinimalisticIcon } from "@solar-icons/react/linear/upload-minimalistic";
import { PLANS } from "@/lib/billing/plans";
import useBilling from "@/hooks/use-billing";
import { usePricing, type PricingResult } from "@/hooks/use-pricing";
import { Plan } from "@/db/schema";
import type { PaidPlan } from "@/lib/billing/products";
import { plansDialogOpenAtom } from "@/store/editor/plans";
import type { PublishQuota } from "@/lib/billing/publish-quota";
import { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue } from "@cutecode/ui/components/meter";
import { PlanBadge } from "./plan-badge";
import { accountStyles, dashboardStyles } from "./style";

type AccountCardProps = {
  plan: keyof typeof PLANS;
  renewsAt: string | null;
  cancelAtPeriodEnd: boolean;
  totalSnippets: number;
  quota: PublishQuota;
};

const styles = accountStyles();
const layout = dashboardStyles();

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));
}

const nextPlans: Record<Plan, PaidPlan | null> = {
  FREE: Plan.PRO,
  PRO: Plan.PREMIUM,
  PREMIUM: null,
};

function nextPlanPrice(plan: PaidPlan, pricing?: PricingResult) {
  const info = pricing?.[plan].monthly;
  if (info) return `${info.price}${info.interval}`;
  return `$${PLANS[plan].prices.monthly}/month`;
}

function PublishMeterRow({ used, limit }: { used: number; limit: number }) {
  return (
    <ListGroupRow icon={UploadMinimalisticIcon} tone={Tone.Gray}>
      <Meter value={used} max={limit} className={styles.meter()}>
        <div className={styles.meterHeader()}>
          <MeterLabel className={styles.meterLabel()}>Daily publishes</MeterLabel>
          <MeterValue>{() => `${used}/${limit}`}</MeterValue>
        </div>
        <MeterTrack className={styles.meterTrack()}>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </ListGroupRow>
  );
}

type AccountRowProps = {
  icon: Icon;
  label: string;
  value: ReactNode;
};

function AccountRow({ icon, label, value }: AccountRowProps) {
  return (
    <ListGroupRow icon={icon} tone={Tone.Gray}>
      <ListGroupTitle>{label}</ListGroupTitle>
      <ListGroupValue>{value}</ListGroupValue>
    </ListGroupRow>
  );
}

export function AccountCard({ plan, renewsAt, cancelAtPeriodEnd, totalSnippets, quota }: AccountCardProps) {
  const { openPortal, isLoading } = useBilling();
  const setPlansOpen = useSetAtom(plansDialogOpenAtom);
  const { data: pricing } = usePricing();

  const isFree = plan === Plan.FREE;
  const nextPlan = nextPlans[plan];
  const showRenewal = !isFree && renewsAt;
  const dailyLimit = isFree ? quota.dailyLimit : null;

  return (
    <div className={styles.root()}>
      <ListGroup>
        <ListGroupHeader>Account</ListGroupHeader>
        <ListGroupRows>
          <AccountRow icon={CrownIcon} label="Plan" value={<PlanBadge plan={plan} />} />
          {nextPlan && (
            <AccountRow
              icon={TagPriceIcon}
              label={PLANS[nextPlan].name}
              value={<span className={styles.number()}>{nextPlanPrice(nextPlan, pricing)}</span>}
            />
          )}
          <AccountRow
            icon={CodeSquareIcon}
            label="Snippets"
            value={<span className={styles.number()}>{totalSnippets}</span>}
          />
          {showRenewal && (
            <AccountRow icon={CalendarIcon} label={cancelAtPeriodEnd ? "Ends" : "Renews"} value={formatDate(renewsAt)} />
          )}
          {dailyLimit !== null && <PublishMeterRow used={quota.dailyUsed} limit={dailyLimit} />}
        </ListGroupRows>
      </ListGroup>

      {nextPlan && (
        <Button className={styles.button()} onClick={() => setPlansOpen(true)}>
          <CrownIcon className={layout.icon()} aria-hidden="true" />
          {`Upgrade to ${PLANS[nextPlan].name}`}
        </Button>
      )}
      {!isFree && (
        <Button variant="outline" className={styles.button()} disabled={isLoading} onClick={openPortal}>
          <CardIcon className={layout.icon()} aria-hidden="true" />
          Manage billing
        </Button>
      )}
    </div>
  );
}
