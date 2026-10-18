import React from "react";
import { Icon } from "@/components/ui/icon";
import { PLANS } from "@/lib/billing/plans";
import type { Plan } from "@/db/schema";

type PremiumBadgeProps = {
  plan: Plan;
};

const PremiumBadge: React.FC<PremiumBadgeProps> = ({ plan }) => {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-md border bg-muted px-1.5 py-0.5 text-xs font-semibold tracking-wide text-foreground">
      <Icon icon="solar:crown-bold" className="size-3" />
      {PLANS[plan].name}
    </span>
  );
};

export default PremiumBadge;
