import { formatDateTime, startOfDay } from "@cutecode/calendar/time";
import { instantAt, makeEvent, testZones } from "@cutecode/calendar/testing";
import {
  ChangeScope,
  ChangeSource,
  Frequency,
  OccurrenceKind,
  Weekday,
  type CalendarEvent,
  type EventChange,
  type PlainDate,
} from "@cutecode/calendar/types";
import { expandRecurrences } from "./expand";

export const now = Date.UTC(2026, 10, 21, 12);
export const stampedAt = "2026-11-21T12:00:00Z";

export function at(date: PlainDate, clock: string): string {
  return formatDateTime(instantAt(date, clock), testZones.losAngeles);
}

export function standupSeries(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return makeEvent({
    id: "standup",
    title: "Standup",
    start: at("2026-11-02", "09:00"),
    end: at("2026-11-02", "09:30"),
    recurrence: { frequency: Frequency.Weekly, interval: 1, byWeekday: [Weekday.Monday], count: 10 },
    ...overrides,
  });
}

export function changeOf(overrides: Partial<EventChange>): EventChange {
  return {
    eventId: "standup",
    originalStart: at("2026-11-16", "09:00"),
    start: at("2026-11-16", "10:00"),
    end: at("2026-11-16", "10:30"),
    allDay: false,
    scope: ChangeScope.This,
    source: ChangeSource.Drag,
    ...overrides,
  };
}

export function expandBetween(events: CalendarEvent[], start: PlainDate, end: PlainDate) {
  const timeZone = testZones.losAngeles;
  const range = { start: startOfDay(start, timeZone), end: startOfDay(end, timeZone) };
  return expandRecurrences(events, { range, dates: { start, end }, timeZone });
}

export function expandYear(events: CalendarEvent[]) {
  return expandBetween(events, "2026-10-01", "2027-03-01");
}

export function occurrenceStarts(events: CalendarEvent[]): string[] {
  return expandYear(events)
    .flatMap((occurrence) =>
      occurrence.kind === OccurrenceKind.Timed ? [formatDateTime(occurrence.start, testZones.losAngeles)] : [],
    )
    .toSorted();
}

export function allDayStarts(events: CalendarEvent[], start: PlainDate, end: PlainDate): PlainDate[] {
  return expandBetween(events, start, end)
    .flatMap((occurrence) => (occurrence.kind === OccurrenceKind.AllDay ? [occurrence.startDate] : []))
    .toSorted();
}

export function byId(events: CalendarEvent[], id: string): CalendarEvent | undefined {
  return events.find((event) => event.id === id);
}
