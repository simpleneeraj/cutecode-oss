import type { ReactNode } from "react";
import { Badge } from "@cutecode/ui/components/badge";
import { Card, CardAction, CardDescription, CardHeader, CardPanel } from "@cutecode/ui/components/card";
import { viewsStyles } from "./style";

type ViewsCardProps = {
  summary: ReactNode;
  children: ReactNode;
};

const styles = viewsStyles();

export function ViewsCard({ summary, children }: ViewsCardProps) {
  return (
    <Card>
      <CardHeader className={styles.header()}>
        <CardDescription className={styles.label()}>Views</CardDescription>
        {summary}
        <CardAction>
          <Badge variant="secondary" size="sm">
            Last 30 days
          </Badge>
        </CardAction>
      </CardHeader>
      <CardPanel>
        <div className={styles.chart()}>{children}</div>
      </CardPanel>
    </Card>
  );
}
