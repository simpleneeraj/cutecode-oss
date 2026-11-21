import { daysInWeek } from "date-fns/constants";
import { addDays as addDaysTo, startOfYear } from "date-fns";
import {
  addDays,
  addYears,
  daysBetween,
  fromUtcDate,
  milliseconds,
  monthWeeks,
  startOfDay,
  startOfWeek,
  toUtcDate,
  weekdayOf,
} from "../time";
import {
  ViewKind,
  type DateRange,
  type DaySpan,
  type Instant,
  type PlainDate,
  type ViewRange,
  type ViewSettings,
  type Weekday,
} from "../types";

export const rangeDays = {
  day: 1,
  week: daysInWeek,
  agenda: 30,
};

function monthDates(anchor: PlainDate, weekStartsOn: Weekday): DateRange {
  const rows = monthWeeks(anchor, weekStartsOn);
  const start = rows[0]?.[0] ?? anchor;
  return { start, end: addDays(start, rows.length * daysInWeek) };
}

function yearDates(anchor: PlainDate): DateRange {
  const start = fromUtcDate(startOfYear(toUtcDate(anchor)));
  return { start, end: addYears(start, 1) };
}

function weekDateRange(anchor: PlainDate, weekStartsOn: Weekday): DateRange {
  const start = startOfWeek(anchor, weekStartsOn);
  return { start, end: addDays(start, rangeDays.week) };
}

function datesFor(kind: ViewKind, anchor: PlainDate, weekStartsOn: Weekday): DateRange {
  switch (kind) {
    case ViewKind.Day:
      return { start: anchor, end: addDays(anchor, rangeDays.day) };
    case ViewKind.Week:
      return weekDateRange(anchor, weekStartsOn);
    case ViewKind.Month:
      return monthDates(anchor, weekStartsOn);
    case ViewKind.Year:
      return yearDates(anchor);
    case ViewKind.Agenda:
      return { start: anchor, end: addDays(anchor, rangeDays.agenda) };
  }
}

export function viewRange(kind: ViewKind, anchor: PlainDate, settings: ViewSettings): ViewRange {
  const dates = datesFor(kind, anchor, settings.weekStartsOn);
  return {
    kind,
    anchor,
    dates,
    instants: { start: startOfDay(dates.start, settings.timeZone), end: startOfDay(dates.end, settings.timeZone) },
    timeZone: settings.timeZone,
    weekStartsOn: settings.weekStartsOn,
  };
}

type Midnight = {
  date: PlainDate;
  start: Instant;
};

function datesThroughEnd(dates: DateRange): PlainDate[] {
  const length = Math.max(0, daysBetween(dates.start, dates.end));
  const firstDay = toUtcDate(dates.start);
  return Array.from({ length: length + 1 }, (_, index) => fromUtcDate(addDaysTo(firstDay, index)));
}

function spanBetween(midnight: Midnight, next: Midnight): DaySpan {
  return {
    date: midnight.date,
    start: midnight.start,
    end: next.start,
    minutes: (next.start - midnight.start) / milliseconds.minute,
  };
}

export function daySpans(range: ViewRange): DaySpan[] {
  const midnights = datesThroughEnd(range.dates).map((date) => ({ date, start: startOfDay(date, range.timeZone) }));
  return midnights.slice(0, -1).map((midnight, index) => spanBetween(midnight, midnights[index + 1] ?? midnight));
}

export function isWeekend(date: PlainDate, weekend: Weekday[]): boolean {
  return weekend.includes(weekdayOf(date));
}
