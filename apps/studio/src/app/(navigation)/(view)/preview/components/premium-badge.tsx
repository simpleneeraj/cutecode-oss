import React from "react";
import { Icon } from "@cutecode/ui/components/icon";
import { PLANS } from "@/lib/billing/plans";
import type { Plan } from "@/db/schema";

type PremiumBadgeProps = {
  plan: Plan;
};

const PremiumBadge: React.FC<PremiumBadgeProps> = ({ plan }) => {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-warning/30 bg-linear-to-b from-warning/20 to-warning/5 px-2 py-0.5 text-xs font-medium text-warning-foreground shadow-xs">
      <Icon icon="solar:crown-bold" className="size-3 text-warning" />
      {PLANS[plan].name}
    </span>
  );
};

export default PremiumBadge;
