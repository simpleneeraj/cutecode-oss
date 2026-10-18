import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";

const INHERITED_PREFIX = "Everything in";

type PlanFeaturesProps = {
  features: string[];
};

function groupFeatures(features: string[]) {
  const [first, ...rest] = features;
  if (first?.startsWith(INHERITED_PREFIX)) return { heading: `${first}, plus`, items: rest };
  return { heading: null, items: features };
}

export default function PlanFeatures({ features }: PlanFeaturesProps) {
  const { heading, items } = groupFeatures(features);

  return (
    <div className="mt-6 flex flex-col gap-3 border-t p-6">
      {heading && <p className="text-xs font-medium text-foreground">{heading}</p>}
      <ul className="flex flex-col gap-2">
        {items.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
            <HugeiconsIcon icon={Tick02Icon} className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
