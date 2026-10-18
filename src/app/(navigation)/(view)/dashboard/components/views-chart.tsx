"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardViews } from "@/hooks/use-dashboard";
import { ViewsArea } from "./views-area";

export function ViewsChart() {
  const { data } = useDashboardViews();
  const total = data?.reduce((sum, point) => sum + point.views, 0) ?? 0;

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">Views</span>
        <span className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
          {total.toLocaleString("en-US")}
        </span>
        <span className="text-xs text-muted-foreground">Last 30 days</span>
      </div>
      <div className="h-56 w-full">
        {data ? <ViewsArea points={data} isLocked={false} /> : <Skeleton className="size-full rounded-xl" />}
      </div>
    </Card>
  );
}
