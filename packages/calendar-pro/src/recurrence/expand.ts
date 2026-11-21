import { occurrenceInterval, occurrenceKey, occurrenceOf, overlapsRange } from "@cutecode/calendar/event";
import {
  addDays,
  daysBetween,
  isPlainDate,
  milliseconds,
  parseDateTime,
  toInstant,
  toWallClock,
} from "@cutecode/calendar/time";
import {
  OccurrenceKind,
  type CalendarEvent,
  type EventOccurrence,
  type ExpansionContext,
  type OccurrenceExpander,
  type PlainDate,
  type WallClock,
} from "@cutecode/calendar/types";
import { canonicalStart, floatingDate, formatSlot, ruleOf, wallClockOfFloating } from "./rule";

type RemovedSlots = {
  starts: Set<string>;
  dates: Set<PlainDate>;
};

type FloatingWindow = {
  after: Date;
  before: Date;
};

function isSeries(event: CalendarEvent): boolean {
  return event.recurrence !== undefined;
}

function timedWindow(series: CalendarEvent, context: ExpansionContext): FloatingWindow {
  const duration = parseDateTime(series.end, series.timeZone) - parseDateTime(series.start, series.timeZone);
  const earliest = toWallClock(context.range.start - duration, series.timeZone);
  const latest = toWallClock(context.range.end, series.timeZone);
  return {
    after: new Date(floatingDate(earliest).getTime() - milliseconds.day),
    before: new Date(floatingDate(latest).getTime() + milliseconds.day),
  };
}

function allDayWindow(series: CalendarEvent, context: ExpansionContext): FloatingWindow {
  const lengthDays = daysBetween(series.start, series.end);
  return {
    after: floatingDate({ date: addDays(context.dates.start, -lengthDays - 1), minute: 0 }),
    before: floatingDate({ date: addDays(context.dates.end, 1), minute: 0 }),
  };
}

function occurrenceAt(series: CalendarEvent, wallClock: WallClock): EventOccurrence {
  const originalStart = formatSlot(wallClock, series.allDay, series.timeZone);
  const key = occurrenceKey(series.id, originalStart);
  if (series.allDay) {
    const endDate = addDays(wallClock.date, daysBetween(series.start, series.end));
    return { kind: OccurrenceKind.AllDay, key, event: series, originalStart, startDate: wallClock.date, endDate };
  }
  const duration = parseDateTime(series.end, series.timeZone) - parseDateTime(series.start, series.timeZone);
  const start = toInstant(wallClock, series.timeZone);
  return { kind: OccurrenceKind.Timed, key, event: series, originalStart, start, end: start + duration };
}

function removedSlotsOf(series: CalendarEvent, exceptions: CalendarEvent[]): RemovedSlots {
  const exceptionDates = series.recurrence?.exceptionDates ?? [];
  const replaced = exceptions.flatMap((exception) => exception.originalStart ?? []);
  return {
    starts: new Set([...exceptionDates, ...replaced].map((value) => canonicalStart(value, series))),
    dates: new Set(exceptionDates.filter(isPlainDate)),
  };
}

function expandSeries(
  series: CalendarEvent,
  exceptions: CalendarEvent[],
  context: ExpansionContext,
): EventOccurrence[] {
  const window = series.allDay ? allDayWindow(series, context) : timedWindow(series, context);
  const removed = removedSlotsOf(series, exceptions);
  return ruleOf(series)
    .between(window.after, window.before, true)
    .map(wallClockOfFloating)
    .filter((wallClock) => !removed.dates.has(wallClock.date))
    .map((wallClock) => occurrenceAt(series, wallClock))
    .filter((occurrence) => !removed.starts.has(occurrence.originalStart))
    .filter((occurrence) => overlapsRange(occurrenceInterval(occurrence, context.timeZone), context.range));
}

function exceptionOccurrence(exception: CalendarEvent, series: CalendarEvent | undefined): EventOccurrence {
  const occurrence = occurrenceOf(exception);
  if (series === undefined || exception.originalStart === undefined) {
    return occurrence;
  }
  const originalStart = canonicalStart(exception.originalStart, series);
  return { ...occurrence, originalStart, key: occurrenceKey(series.id, originalStart) };
}

export const expandRecurrences: OccurrenceExpander = (events, context) => {
  const seriesById = new Map(events.filter(isSeries).map((series) => [series.id, series]));
  const exceptionsBySeries = Map.groupBy(events, (event) => event.seriesId);
  return events.flatMap((event) => {
    if (isSeries(event)) {
      return expandSeries(event, exceptionsBySeries.get(event.id) ?? [], context);
    }
    const series = event.seriesId === undefined ? undefined : seriesById.get(event.seriesId);
    return [exceptionOccurrence(event, series)];
  });
};
