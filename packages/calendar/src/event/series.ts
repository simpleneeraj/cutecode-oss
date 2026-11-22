import { addDays, formatDateTime, isPlainDate, milliseconds, parseDateTime, startOfDay } from "../time";
import type { CalendarEvent, Instant } from "../types";

export function seriesOf(events: CalendarEvent[], event: CalendarEvent): CalendarEvent | undefined {
  if (event.recurrence !== undefined) {
    return event;
  }
  return event.seriesId === undefined ? undefined : events.find((candidate) => candidate.id === event.seriesId);
}

export function instantOf(value: string, timeZone: string): Instant {
  return isPlainDate(value) ? startOfDay(value, timeZone) : parseDateTime(value, timeZone);
}

export function isFirstOccurrence(series: CalendarEvent, originalStart: string): boolean {
  return instantOf(originalStart, series.timeZone) <= instantOf(series.start, series.timeZone);
}

export function isAtOrAfter(event: CalendarEvent, originalStart: string): boolean {
  const start = event.originalStart ?? event.start;
  return instantOf(start, event.timeZone) >= instantOf(originalStart, event.timeZone);
}

function untilBefore(series: CalendarEvent, originalStart: string): string {
  if (series.allDay) {
    return addDays(originalStart, -1);
  }
  const { timeZone } = series;
  return formatDateTime(parseDateTime(originalStart, timeZone) - milliseconds.second, timeZone);
}

export function stamped(event: CalendarEvent, now: Instant): CalendarEvent {
  return { ...event, version: event.version + 1, updatedAt: new Date(now).toISOString() };
}

export function endedBefore(series: CalendarEvent, originalStart: string, now: Instant): CalendarEvent {
  const recurrence = series.recurrence && { ...series.recurrence, count: undefined, until: untilBefore(series, originalStart) };
  return stamped({ ...series, recurrence }, now);
}

export function withoutOccurrence(series: CalendarEvent, originalStart: string, now: Instant): CalendarEvent {
  const exceptionDates = [...(series.recurrence?.exceptionDates ?? []), originalStart];
  const recurrence = series.recurrence && { ...series.recurrence, exceptionDates };
  return stamped({ ...series, recurrence }, now);
}
