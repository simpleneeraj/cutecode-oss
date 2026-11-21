import { CheckCircleIcon } from "@solar-icons/react/bold-duotone/check-circle";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { CheckIcon } from "@solar-icons/react/linear/check";
import { Link } from "@/components/link";
import { Plan } from "@/db/enums";
import { PLANS } from "@/lib/billing/plans";
import { Button } from "@cutecode/ui/components/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@cutecode/ui/components/empty";

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
          <CheckCircleIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle render={<h1 />}>You&apos;re on {name}</EmptyTitle>
        <EmptyDescription>Your {name} features are unlocked and ready to use.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="gap-8">
        <ul className="flex flex-col gap-2 text-muted-foreground">
          {highlights.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <CheckIcon className="size-4 shrink-0 text-success" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button render={<Link href="/" />}>
            Start creating
            <AltArrowRightIcon aria-hidden="true" />
          </Button>
          <Button variant="outline" render={<Link href="/dashboard" />}>
            Go to dashboard
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
