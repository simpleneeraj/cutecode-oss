import { calendarOf, occurrencesInRange, visibleEvents } from "../../event";
import { formatTimeRange } from "../../locale";
import type { PickerDay } from "../../picker";
import { addMonths, startOfDay, startOfMonth } from "../../time";
import {
  CalendarTone,
  OccurrenceKind,
  type Calendar,
  type CalendarEvent,
  type EventOccurrence,
  type PlainDate,
  type ViewSettings,
} from "../../types";
import { busyDayLines } from "../../widgets";

export enum CompactLayout {
  Grid = "grid",
  List = "list",
}

export enum TileKind {
  Outside = "outside",
  Free = "free",
  Busy = "busy",
  Selected = "selected",
}

export type FilterChip = {
  id: string;
  label: string;
  count: number;
};

export type TileLine = {
  key: string;
  isAccent: boolean;
};

export type TileDay = {
  day: PickerDay;
  kind: TileKind;
  lines: TileLine[];
  eventCount: number;
};

export type ListDay = {
  date: PlainDate;
  occurrences: EventOccurrence[];
};

export const allCalendars = "all";

export const compactMonthLimits = {
  lines: 3,
};

export const compactMonthCopy = {
  all: "All",
  allDay: "All day",
  layout: "Layout",
  grid: "Grid",
  list: "List",
  filters: "Filter calendars",
  emptyDescription: (month: string) => `${month} is open. Add an event or import a calendar.`,
};

export function monthOccurrences(
  events: CalendarEvent[],
  calendars: Calendar[],
  month: PlainDate,
  timeZone: string,
): EventOccurrence[] {
  const start = startOfMonth(month);
  const end = addMonths(start, 1);
  const range = { start: startOfDay(start, timeZone), end: startOfDay(end, timeZone) };
  return occurrencesInRange(visibleEvents(events, calendars), { range, dates: { start, end }, timeZone });
}

export function filterChips(occurrences: EventOccurrence[], calendars: Calendar[]): FilterChip[] {
  const all = { id: allCalendars, label: compactMonthCopy.all, count: occurrences.length };
  const perCalendar = calendars.map((calendar) => ({
    id: calendar.id,
    label: calendar.name,
    count: occurrences.filter((occurrence) => occurrence.event.calendarId === calendar.id).length,
  }));
  return [all, ...perCalendar.filter((chip) => chip.count > 0)];
}

export function filteredOccurrences(occurrences: EventOccurrence[], calendarId: string): EventOccurrence[] {
  if (calendarId === allCalendars) {
    return occurrences;
  }
  return occurrences.filter((occurrence) => occurrence.event.calendarId === calendarId);
}

function tileKind(day: PickerDay, eventCount: number): TileKind {
  if (!day.inMonth) {
    return TileKind.Outside;
  }
  if (day.selected) {
    return TileKind.Selected;
  }
  return eventCount > 0 ? TileKind.Busy : TileKind.Free;
}

function lineOf(occurrence: EventOccurrence, calendars: Calendar[]): TileLine {
  const tone = calendarOf(occurrence.event, calendars)?.tone;
  return { key: occurrence.key, isAccent: tone === CalendarTone.Accent };
}

export function tileDays(
  weeks: PickerDay[][],
  occurrences: EventOccurrence[],
  calendars: Calendar[],
  timeZone: string,
): TileDay[][] {
  const dates = weeks.map((week) => week.map((day) => day.date));
  const busy = busyDayLines(occurrences, dates, timeZone, compactMonthLimits.lines);
  return weeks.map((week) =>
    week.map((day) => {
      const entry = day.inMonth ? busy.get(day.date) : undefined;
      const eventCount = entry === undefined ? 0 : entry.lines.length + entry.hiddenCount;
      const lines = entry?.lines.map((occurrence) => lineOf(occurrence, calendars)) ?? [];
      return { day, kind: tileKind(day, eventCount), lines, eventCount };
    }),
  );
}

export function listDays(occurrences: EventOccurrence[], dates: PlainDate[], timeZone: string): ListDay[] {
  const busy = busyDayLines(occurrences, [dates], timeZone, occurrences.length);
  return dates.flatMap((date) => {
    const entry = busy.get(date);
    return entry === undefined ? [] : [{ date, occurrences: entry.lines }];
  });
}

export function lineWhen(occurrence: EventOccurrence, settings: ViewSettings): string {
  if (occurrence.kind === OccurrenceKind.AllDay) {
    return compactMonthCopy.allDay;
  }
  return formatTimeRange(occurrence.start, occurrence.end, settings);
}
