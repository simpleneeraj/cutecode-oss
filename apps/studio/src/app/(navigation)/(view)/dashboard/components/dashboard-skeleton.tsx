import { Skeleton } from "@cutecode/ui/components/skeleton";
import { dashboardStyles, skeletonStyles } from "./style";

const layout = dashboardStyles();
const styles = skeletonStyles();

export function DashboardSkeleton() {
  return (
    <div className={layout.root()} aria-busy="true">
      <div className={layout.header()}>
        <div className={layout.heading()}>
          <Skeleton className={styles.title()} />
          <Skeleton className={styles.subtitle()} />
        </div>
        <Skeleton className={styles.action()} />
      </div>
      <Skeleton className={styles.stats()} />
      <Skeleton className={styles.chart()} />
      <div className={layout.columns()}>
        <Skeleton className={styles.table()} />
        <Skeleton className={styles.account()} />
      </div>
    </div>
  );
}
