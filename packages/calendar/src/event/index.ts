import {
  OccurrenceKind,
  type Calendar,
  type CalendarEvent,
  type DateRange,
  type EventOccurrence,
  type ExpansionContext,
  type InstantRange,
  type OccurrenceExpander,
  type PlainDate,
} from "../types";
import { addDays, compareDates, dateOf, parseDateTime, startOfDay } from "../time";

export function occurrenceKey(eventId: string, originalStart: string): string {
  return `${eventId}@${originalStart}`;
}

export function occurrenceOf(event: CalendarEvent): EventOccurrence {
  const originalStart = event.originalStart ?? event.start;
  const key = occurrenceKey(event.seriesId ?? event.id, originalStart);
  if (event.allDay) {
    return { kind: OccurrenceKind.AllDay, key, event, originalStart, startDate: event.start, endDate: event.end };
  }
  const start = parseDateTime(event.start, event.timeZone);
  const end = parseDateTime(event.end, event.timeZone);
  return { kind: OccurrenceKind.Timed, key, event, originalStart, start, end };
}

export function occurrenceInterval(occurrence: EventOccurrence, timeZone: string): InstantRange {
  if (occurrence.kind === OccurrenceKind.Timed) {
    return { start: occurrence.start, end: occurrence.end };
  }
  const isEmpty = compareDates(occurrence.endDate, occurrence.startDate) <= 0;
  const endDate = isEmpty ? addDays(occurrence.startDate, 1) : occurrence.endDate;
  return { start: startOfDay(occurrence.startDate, timeZone), end: startOfDay(endDate, timeZone) };
}

function atLeastOneDay(start: PlainDate, end: PlainDate): DateRange {
  const isEmpty = compareDates(end, start) <= 0;
  return { start, end: isEmpty ? addDays(start, 1) : end };
}

export function coveredDates(occurrence: EventOccurrence, timeZone: string): DateRange {
  if (occurrence.kind === OccurrenceKind.AllDay) {
    return atLeastOneDay(occurrence.startDate, occurrence.endDate);
  }
  const lastInstant = Math.max(occurrence.start, occurrence.end - 1);
  return { start: dateOf(occurrence.start, timeZone), end: addDays(dateOf(lastInstant, timeZone), 1) };
}

export function overlapsRange(interval: InstantRange, range: InstantRange): boolean {
  const isMarker = interval.start === interval.end;
  if (isMarker) {
    return interval.start >= range.start && interval.start < range.end;
  }
  return interval.start < range.end && interval.end > range.start;
}

function isException(occurrence: EventOccurrence): boolean {
  return occurrence.event.seriesId !== undefined;
}

function isSkipped(occurrence: EventOccurrence): boolean {
  return occurrence.event.recurrence?.exceptionDates?.includes(occurrence.originalStart) ?? false;
}

export const expandEach: OccurrenceExpander = (events) => {
  const occurrences = events.map(occurrenceOf).filter((occurrence) => !isSkipped(occurrence));
  const replacedKeys = new Set(occurrences.filter(isException).map((occurrence) => occurrence.key));
  return occurrences.filter((occurrence) => isException(occurrence) || !replacedKeys.has(occurrence.key));
};

export function occurrencesInRange(
  events: CalendarEvent[],
  context: ExpansionContext,
  expand: OccurrenceExpander = expandEach,
): EventOccurrence[] {
  return expand(events, context).filter((occurrence) =>
    overlapsRange(occurrenceInterval(occurrence, context.timeZone), context.range),
  );
}

export function hiddenCalendarIdsOf(calendars: Calendar[]): string[] {
  return calendars.filter((calendar) => !calendar.visible).map((calendar) => calendar.id);
}

export function isOnHiddenCalendar(event: CalendarEvent, hiddenCalendarIds: string[]): boolean {
  return hiddenCalendarIds.includes(event.calendarId);
}

export function visibleEvents(events: CalendarEvent[], calendars: Calendar[]): CalendarEvent[] {
  const hiddenCalendarIds = hiddenCalendarIdsOf(calendars);
  return events.filter((event) => !isOnHiddenCalendar(event, hiddenCalendarIds));
}

export function calendarOf(event: CalendarEvent, calendars: Calendar[]): Calendar | undefined {
  return calendars.find((calendar) => calendar.id === event.calendarId);
}

export function isEventReadOnly(event: CalendarEvent, calendars: Calendar[]): boolean {
  return calendarOf(event, calendars)?.readOnly ?? true;
}

export function isRecurring(event: CalendarEvent): boolean {
  return event.recurrence !== undefined || event.seriesId !== undefined;
}
export { applyEventChange } from "./apply-change";
export { duplicateOccurrence } from "./duplicate";
export { removeOccurrence } from "./remove";
export { lastChange, recordChange, startHistory, undoChange, undoEntry, type EventHistory, type HistoryEntry } from "./history";
