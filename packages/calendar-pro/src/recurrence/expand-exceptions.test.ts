import { describe, expect, it } from "vitest";
import { occurrenceKey } from "@cutecode/calendar/event";
import { formatDateTime, startOfDay, toWallClock } from "@cutecode/calendar/time";
import { instantAt, makeAllDayEvent, makeEvent, testZones } from "@cutecode/calendar/testing";
import {
  Frequency,
  OccurrenceKind,
  Weekday,
  type CalendarEvent,
  type EventOccurrence,
  type ExpansionContext,
  type PlainDate,
  type Recurrence,
} from "@cutecode/calendar/types";
import { expandRecurrences } from "./expand";

function contextFor(start: PlainDate, end: PlainDate, timeZone: string = testZones.losAngeles): ExpansionContext {
  return {
    range: { start: startOfDay(start, timeZone), end: startOfDay(end, timeZone) },
    dates: { start, end },
    timeZone,
  };
}

function at(date: PlainDate, clock: string, timeZone: string = testZones.losAngeles): string {
  return formatDateTime(instantAt(date, clock, timeZone), timeZone);
}

function series(recurrence: Recurrence, overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return makeEvent({ id: "standup", title: "Standup", recurrence, ...overrides });
}

function timedStarts(occurrences: EventOccurrence[], timeZone: string = testZones.losAngeles): string[] {
  return occurrences.flatMap((occurrence) =>
    occurrence.kind === OccurrenceKind.Timed ? [formatDateTime(occurrence.start, timeZone)] : [],
  );
}

function startDates(occurrences: EventOccurrence[], timeZone: string = testZones.losAngeles): string[] {
  return occurrences.map((occurrence) =>
    occurrence.kind === OccurrenceKind.Timed ? toWallClock(occurrence.start, timeZone).date : occurrence.startDate,
  );
}

const weekly: Recurrence = { frequency: Frequency.Weekly, interval: 1, byWeekday: [Weekday.Monday] };
const daily: Recurrence = { frequency: Frequency.Daily, interval: 1 };

describe("expandRecurrences exceptions and ranges", () => {
  it("removes exception dates in any offset spelling", () => {
    const standup = series(
      { ...weekly, exceptionDates: [at("2026-11-23", "09:00"), "2026-11-30T17:00:00Z"] },
      { start: at("2026-11-02", "09:00"), end: at("2026-11-02", "09:30") },
    );
    const dates = startDates(expandRecurrences([standup], contextFor("2026-11-01", "2026-12-15")));
    expect(dates).toEqual(["2026-11-02", "2026-11-09", "2026-11-16", "2026-12-07", "2026-12-14"]);
  });

  it("removes a timed occurrence by a plain-date exception on its wall-clock date", () => {
    const standup = series(
      { ...daily, exceptionDates: ["2026-11-03"] },
      { start: at("2026-11-02", "09:00"), end: at("2026-11-02", "09:30") },
    );
    const dates = startDates(expandRecurrences([standup], contextFor("2026-11-02", "2026-11-05")));
    expect(dates).toEqual(["2026-11-02", "2026-11-04"]);
  });

  it("removes all-day exception dates", () => {
    const trash = makeAllDayEvent("2026-11-02", "2026-11-03", {
      recurrence: { ...weekly, exceptionDates: ["2026-11-09"] },
    });
    const occurrences = expandRecurrences([trash], contextFor("2026-11-01", "2026-11-20"));
    expect(occurrences.map((occurrence) => occurrence.originalStart)).toEqual(["2026-11-02", "2026-11-16"]);
  });

  it("replaces an occurrence with its exception and keeps the key", () => {
    const standup = series(weekly, { start: at("2026-11-02", "09:00"), end: at("2026-11-02", "09:30") });
    const original = at("2026-11-16", "09:00");
    const exception = makeEvent({
      id: "standup-moved",
      title: "Standup, late",
      seriesId: standup.id,
      originalStart: "2026-11-16T17:00:00Z",
      start: at("2026-11-16", "11:00"),
      end: at("2026-11-16", "11:30"),
    });
    const occurrences = expandRecurrences([standup, exception], contextFor("2026-11-15", "2026-11-22"));
    expect(occurrences).toHaveLength(1);
    expect(occurrences[0]?.key).toBe(occurrenceKey(standup.id, original));
    expect(occurrences[0]?.originalStart).toBe(original);
    expect(occurrences[0]?.event.title).toBe("Standup, late");
    expect(timedStarts(occurrences)).toEqual([at("2026-11-16", "11:00")]);
  });

  it("clips the series to the range", () => {
    const standup = series(
      { ...daily, count: 5 },
      { start: at("2026-11-16", "09:00"), end: at("2026-11-16", "09:30") },
    );
    const dates = startDates(expandRecurrences([standup], contextFor("2026-11-18", "2026-11-19")));
    expect(dates).toEqual(["2026-11-18"]);
  });

  it("keeps the occurrence that started before the range and still overlaps", () => {
    const night = series(daily, { start: at("2026-11-16", "22:00"), end: at("2026-11-17", "02:00") });
    const dates = startDates(expandRecurrences([night], contextFor("2026-11-18", "2026-11-19")));
    expect(dates).toEqual(["2026-11-17", "2026-11-18"]);
  });

  it("keeps an all-day occurrence that started before the range", () => {
    const trip = makeAllDayEvent("2026-11-06", "2026-11-09", {
      recurrence: { ...weekly, byWeekday: [Weekday.Friday] },
    });
    const occurrences = expandRecurrences([trip], contextFor("2026-11-15", "2026-11-16"));
    expect(occurrences.map((occurrence) => occurrence.originalStart)).toEqual(["2026-11-13"]);
  });

  it("expands in a view zone other than the event zone", () => {
    const standup = series(weekly, { start: at("2026-11-02", "09:00"), end: at("2026-11-02", "09:30") });
    const occurrences = expandRecurrences([standup], contextFor("2026-11-17", "2026-11-18", testZones.tokyo));
    expect(timedStarts(occurrences, testZones.tokyo)).toEqual(["2026-11-17T02:00:00+09:00"]);
  });
});
