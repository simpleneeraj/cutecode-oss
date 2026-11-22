import type { AgendaRow } from "../../agenda";
import { formatPlainDate, formatTime } from "../../locale";
import { OccurrenceKind, type PlainDate, type ViewSettings } from "../../types";

export type RowTimes = {
  primary: string;
  secondary: string;
};

export type DayHeading = {
  title: string;
  subtitle: string;
};

export const agendaCopy = {
  allDay: "All day",
  until: "Until",
  continuesFrom: "Continues from",
  today: "Today",
  empty: "Nothing planned",
  emptyDescription: "Events you add show up here, grouped by day.",
  label: "Agenda",
  from: "From",
};

const allDayTimes: RowTimes = { primary: agendaCopy.allDay, secondary: "" };

export function rowTimes(row: AgendaRow, settings: ViewSettings): RowTimes {
  const { occurrence } = row;
  if (occurrence.kind === OccurrenceKind.AllDay) {
    return allDayTimes;
  }
  const isContinued = row.continuesFrom !== null;
  if (isContinued && row.continuesAfter) {
    return allDayTimes;
  }
  if (isContinued) {
    return { primary: agendaCopy.until, secondary: formatTime(occurrence.end, settings) };
  }
  return { primary: formatTime(occurrence.start, settings), secondary: formatTime(occurrence.end, settings) };
}

export function rowMeta(row: AgendaRow, settings: ViewSettings): string {
  const from = row.continuesFrom;
  const continues = from === null ? undefined : `${agendaCopy.continuesFrom} ${formatPlainDate(from, settings, { weekday: "short" })}`;
  return [continues, row.occurrence.event.location].filter((part) => part !== undefined && part !== "").join(", ");
}

export function dayHeading(date: PlainDate, settings: ViewSettings): DayHeading {
  return {
    title: formatPlainDate(date, settings, { weekday: "long" }),
    subtitle: formatPlainDate(date, settings, { month: "long", day: "numeric" }),
  };
}

export function agendaHeading(anchor: PlainDate, settings: ViewSettings): DayHeading {
  return {
    title: formatPlainDate(anchor, settings, { month: "long", year: "numeric" }),
    subtitle: `${agendaCopy.from} ${formatPlainDate(anchor, settings, { month: "short", day: "numeric" })}`,
  };
}
