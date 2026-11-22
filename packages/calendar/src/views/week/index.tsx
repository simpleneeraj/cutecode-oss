"use client";

import { TimeGridView } from "../../parts/time-grid/view";
import type { CalendarViewProps } from "../../parts/time-grid/props";
import { ViewKind } from "../../types";

function WeekView(props: CalendarViewProps) {
  return <TimeGridView calendar={props} kind={ViewKind.Week} />;
}

export { WeekView };
export {
  HourZoom,
  type CalendarData,
  type CalendarNavigation,
  type CalendarViewProps,
  type TimeGridOptions,
} from "../../parts/time-grid/props";
export { CalendarStatusKind, type CalendarStatus } from "../../parts/state/status";
