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

const zoneTable = [
  testZones.losAngeles,
  testZones.newYork,
  testZones.stJohns,
  testZones.santiago,
  testZones.london,
  testZones.berlin,
  testZones.kolkata,
  testZones.kathmandu,
  testZones.tokyo,
  testZones.sydney,
  testZones.chatham,
  testZones.utc,
];

describe("expandRecurrences", () => {
  it("passes a non-repeating event through", () => {
    const event = makeEvent();
    const occurrences = expandRecurrences([event], contextFor("2026-11-15", "2026-11-22"));
    expect(occurrences).toHaveLength(1);
    expect(occurrences[0]?.key).toBe(occurrenceKey(event.id, event.start));
  });

  it.each(zoneTable)("keeps a weekly 9 AM standup at 9 AM wall time across DST in %s", (timeZone) => {
    const standup = series(weekly, {
      start: at("2026-01-05", "09:00", timeZone),
      end: at("2026-01-05", "09:30", timeZone),
      timeZone,
    });
    const occurrences = expandRecurrences([standup], contextFor("2026-01-01", "2027-01-01", timeZone));
    expect(occurrences).toHaveLength(52);
    for (const occurrence of occurrences) {
      if (occurrence.kind !== OccurrenceKind.Timed) {
        throw new Error("expected a timed occurrence");
      }
      expect(toWallClock(occurrence.start, timeZone).minute).toBe(9 * 60);
      expect(toWallClock(occurrence.end, timeZone).minute).toBe(9 * 60 + 30);
    }
  });

  it("moves the UTC hour of an LA standup across spring and fall DST", () => {
    const standup = series(weekly, { start: at("2026-03-02", "09:00"), end: at("2026-03-02", "09:30") });
    const occurrences = expandRecurrences([standup], contextFor("2026-03-01", "2026-11-03"));
    const utcHours = occurrences.flatMap((occurrence) =>
      occurrence.kind === OccurrenceKind.Timed ? [new Date(occurrence.start).getUTCHours()] : [],
    );
    expect(utcHours[0]).toBe(17);
    expect(utcHours[1]).toBe(16);
    expect(utcHours.at(-2)).toBe(16);
    expect(utcHours.at(-1)).toBe(17);
  });

  it("expands every two weeks", () => {
    const standup = series(
      { ...weekly, interval: 2 },
      { start: at("2026-01-05", "09:00"), end: at("2026-01-05", "09:30") },
    );
    const dates = startDates(expandRecurrences([standup], contextFor("2026-01-01", "2026-03-01")));
    expect(dates).toEqual(["2026-01-05", "2026-01-19", "2026-02-02", "2026-02-16"]);
  });

  it("skips short months for a monthly series on the 31st", () => {
    const monthly = series(
      { frequency: Frequency.Monthly, interval: 1, byMonthDay: [31] },
      { start: at("2026-01-31", "10:00"), end: at("2026-01-31", "11:00") },
    );
    const dates = startDates(expandRecurrences([monthly], contextFor("2026-01-01", "2027-01-01")));
    expect(dates).toEqual([
      "2026-01-31",
      "2026-03-31",
      "2026-05-31",
      "2026-07-31",
      "2026-08-31",
      "2026-10-31",
      "2026-12-31",
    ]);
  });

  it("finds the second Tuesday through bySetPosition", () => {
    const review = series(
      { frequency: Frequency.Monthly, interval: 1, byWeekday: [Weekday.Tuesday], bySetPosition: 2 },
      { start: at("2026-01-13", "15:00"), end: at("2026-01-13", "16:00") },
    );
    const dates = startDates(expandRecurrences([review], contextFor("2026-01-01", "2026-05-01")));
    expect(dates).toEqual(["2026-01-13", "2026-02-10", "2026-03-10", "2026-04-14"]);
  });

  it("stops after count occurrences", () => {
    const standup = series(
      { ...daily, count: 5 },
      { start: at("2026-11-16", "09:00"), end: at("2026-11-16", "09:30") },
    );
    const dates = startDates(expandRecurrences([standup], contextFor("2026-11-01", "2026-12-31")));
    expect(dates).toEqual(["2026-11-16", "2026-11-17", "2026-11-18", "2026-11-19", "2026-11-20"]);
  });

  it("includes the whole until day when until is a plain date", () => {
    const standup = series(
      { ...daily, until: "2026-11-18" },
      { start: at("2026-11-16", "21:00"), end: at("2026-11-16", "22:00") },
    );
    const dates = startDates(expandRecurrences([standup], contextFor("2026-11-01", "2026-12-31")));
    expect(dates).toEqual(["2026-11-16", "2026-11-17", "2026-11-18"]);
  });

  it("stops at an until date time", () => {
    const standup = series(
      { ...daily, until: at("2026-11-18", "08:59") },
      { start: at("2026-11-16", "09:00"), end: at("2026-11-16", "09:30") },
    );
    const dates = startDates(expandRecurrences([standup], contextFor("2026-11-01", "2026-12-31")));
    expect(dates).toEqual(["2026-11-16", "2026-11-17"]);
  });

  it("yields Feb 29 all-day occurrences only in leap years", () => {
    const leap = makeAllDayEvent("2028-02-29", "2028-03-01", {
      id: "leap",
      recurrence: { frequency: Frequency.Yearly, interval: 1 },
    });
    const occurrences = expandRecurrences([leap], contextFor("2028-01-01", "2037-01-01"));
    expect(occurrences.map((occurrence) => occurrence.kind)).toEqual([
      OccurrenceKind.AllDay,
      OccurrenceKind.AllDay,
      OccurrenceKind.AllDay,
    ]);
    expect(occurrences.map((occurrence) => occurrence.originalStart)).toEqual([
      "2028-02-29",
      "2032-02-29",
      "2036-02-29",
    ]);
    expect(occurrences[1]).toMatchObject({ startDate: "2032-02-29", endDate: "2032-03-01" });
  });

  it("keeps the length of a multi-day all-day series", () => {
    const trip = makeAllDayEvent("2026-11-06", "2026-11-09", {
      recurrence: { ...weekly, byWeekday: [Weekday.Friday] },
    });
    const occurrences = expandRecurrences([trip], contextFor("2026-11-15", "2026-11-22"));
    expect(occurrences).toHaveLength(2);
    expect(occurrences[0]).toMatchObject({ startDate: "2026-11-13", endDate: "2026-11-16" });
    expect(occurrences[1]).toMatchObject({ startDate: "2026-11-20", endDate: "2026-11-23" });
  });

  it("moves a series time inside the spring gap to the compatible time", () => {
    const early = series(daily, { start: at("2026-03-07", "02:30"), end: at("2026-03-07", "03:00") });
    const occurrences = expandRecurrences([early], contextFor("2026-03-07", "2026-03-10"));
    expect(timedStarts(occurrences)).toEqual([
      "2026-03-07T02:30:00-08:00",
      "2026-03-08T03:30:00-07:00",
      "2026-03-09T02:30:00-07:00",
    ]);
  });

  it("picks the first of a repeated fall hour", () => {
    const early = series(daily, { start: at("2026-10-31", "01:30"), end: at("2026-10-31", "02:00") });
    const occurrences = expandRecurrences([early], contextFor("2026-11-01", "2026-11-02"));
    expect(timedStarts(occurrences)).toEqual(["2026-11-01T01:30:00-07:00"]);
  });
});
