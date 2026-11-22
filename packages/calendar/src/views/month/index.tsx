"use client";

import { MonthGridView } from "../../parts/month-grid/view";
import type { CalendarViewProps } from "../../parts/time-grid/props";

function MonthView(props: CalendarViewProps) {
  return <MonthGridView calendar={props} />;
}

export { MonthView };
export type { CalendarData, CalendarNavigation, CalendarViewProps } from "../../parts/time-grid/props";
export { CalendarStatusKind, type CalendarStatus } from "../../parts/state/status";
