import { Card } from "@cutecode/ui/components/card";
import { Plan } from "@/db/schema";
import { PlanBadge } from "./plan-badge";
import { statStyles } from "./style";

type Totals = {
  views: number | null;
  published: number;
  upvotes: number | null;
  followers: number;
};

type StatCardsProps = {
  totals: Totals;
};

const styles = statStyles();

function formatCount(n: number): string {
  const isMillions = n >= 1_000_000;
  const isThousands = n >= 1_000;
  if (isMillions) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (isThousands) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

function StatValue({ value }: { value: number | null }) {
  const isLocked = value === null;
  if (isLocked) return <PlanBadge plan={Plan.PREMIUM} />;
  return <span className={styles.number()}>{formatCount(value)}</span>;
}

export function StatCards({ totals }: StatCardsProps) {
  const stats = [
    { label: "Total views", value: totals.views },
    { label: "Published", value: totals.published },
    { label: "Upvotes", value: totals.upvotes },
    { label: "Followers", value: totals.followers },
  ];

  return (
    <Card className={styles.root()}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.cell()}>
          <span className={styles.label()}>{stat.label}</span>
          <div className={styles.value()}>
            <StatValue value={stat.value} />
          </div>
        </div>
      ))}
    </Card>
  );
}
