import { Badge } from "@cutecode/ui/components/badge";
import { CrownIcon } from "@solar-icons/react/linear/crown";
import { PLANS } from "@/lib/billing/plans";
import { Plan } from "@/db/schema";

export function PlanBadge({ plan }: { plan: Plan }) {
  const name = PLANS[plan].name;
  const isFree = plan === Plan.FREE;
  if (isFree) return <Badge variant="outline" size="sm">{name}</Badge>;

  return (
    <Badge variant="info" size="sm">
      <CrownIcon aria-hidden="true" />
      {name}
    </Badge>
  );
}
