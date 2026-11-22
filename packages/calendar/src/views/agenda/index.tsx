"use client";

import { AgendaListView } from "../../parts/agenda-list/view";
import type { CalendarViewProps } from "../../parts/time-grid/props";

function AgendaView(props: CalendarViewProps) {
  return <AgendaListView calendar={props} />;
}

export { AgendaView };
export type { CalendarData, CalendarNavigation, CalendarViewProps } from "../../parts/time-grid/props";
export { CalendarStatusKind, type CalendarStatus } from "../../parts/state/status";
