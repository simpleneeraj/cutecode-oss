import { Skeleton } from "@cutecode/ui/components/skeleton";

import type { ViewKind } from "../../types";
import { skeletonShapes } from "./shapes";
import { calendarSkeletonStyles } from "./style";

type CalendarSkeletonProps = {
  view: ViewKind;
};

function CalendarSkeleton({ view }: CalendarSkeletonProps) {
  const shape = skeletonShapes[view];
  const styles = calendarSkeletonStyles({ layout: shape.layout });

  return (
    <div aria-hidden="true" className={styles.root()} data-slot="calendar-skeleton">
      {shape.ids.map((id) => (
        <div key={id} className={styles.item()}>
          <Skeleton className={styles.header()} />
          <Skeleton className={styles.body()} />
        </div>
      ))}
    </div>
  );
}

export { CalendarSkeleton };
