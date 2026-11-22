"use client";

import { CardTitle } from "@cutecode/ui/components/card";
import { Skeleton } from "@cutecode/ui/components/skeleton";
import { useDashboardViews } from "@/hooks/use-dashboard";
import { ViewsArea } from "./views-area";
import { ViewsCard } from "./views-card";
import { viewsStyles } from "./style";

const styles = viewsStyles();

export function ViewsChart() {
  const { data } = useDashboardViews();
  const total = data?.reduce((sum, point) => sum + point.views, 0) ?? 0;

  return (
    <ViewsCard summary={<CardTitle className={styles.summary()}>{total.toLocaleString("en-US")}</CardTitle>}>
      {data ? <ViewsArea points={data} isLocked={false} /> : <Skeleton className={styles.loading()} />}
    </ViewsCard>
  );
}
