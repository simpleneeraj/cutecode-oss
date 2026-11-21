import { Card } from "@/components/ui/card";
import { Plan } from "@/db/schema";
import PremiumBadge from "../../preview/components/premium-badge";

type Totals = {
  views: number | null;
  published: number;
  upvotes: number | null;
  followers: number;
};

type StatCardsProps = {
  totals: Totals;
};

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

export function StatCards({ totals }: StatCardsProps) {
  const stats = [
    { label: "Total views", value: totals.views },
    { label: "Published", value: totals.published },
    { label: "Upvotes", value: totals.upvotes },
    { label: "Followers", value: totals.followers },
  ];

  return (
    <Card className="grid grid-cols-2 gap-px overflow-hidden bg-border lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1 bg-card p-5">
          <span className="text-xs text-muted-foreground">{stat.label}</span>
          <div className="flex h-8 items-center">
            {stat.value === null ? (
              <PremiumBadge plan={Plan.PREMIUM} />
            ) : (
              <span className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                {formatCount(stat.value)}
              </span>
            )}
          </div>
        </div>
      ))}
    </Card>
  );
}
