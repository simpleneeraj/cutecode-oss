import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, CheckmarkCircle02Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Link } from "@/components/link";
import { Plan } from "@/db/enums";
import { PLANS } from "@/lib/billing/plans";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

type PlanActiveProps = {
  plan: Plan;
};

export default function PlanActive({ plan }: PlanActiveProps) {
  const { name, features } = PLANS[plan];
  const highlights = features.slice(1, 4);

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="text-success">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>You&apos;re on {name}</EmptyTitle>
        <EmptyDescription>Your {name} features are unlocked and ready to use.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="gap-8">
        <ul className="flex flex-col gap-2 text-muted-foreground">
          {highlights.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <HugeiconsIcon icon={Tick02Icon} className="size-4 shrink-0 text-success" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button render={<Link href="/" />}>
            Start creating
            <HugeiconsIcon icon={ArrowRight01Icon} aria-hidden="true" />
          </Button>
          <Button variant="outline" render={<Link href="/dashboard" />}>
            Go to dashboard
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
