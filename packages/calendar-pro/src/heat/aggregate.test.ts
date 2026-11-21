import { describe, expect, it } from "vitest";
import { occurrenceOf } from "@cutecode/calendar/event";
import { instantAt, makeAllDayEvent, makeEvent, makeOccurrence, testZones } from "@cutecode/calendar/testing";
import { formatDateTime } from "@cutecode/calendar/time";
import { aggregateDays, heatLevel, heatScale, HeatLevel } from "./aggregate";

const november = { start: "2026-11-01", end: "2026-12-01" };

function at(date: string, clock: string, timeZone: string = testZones.losAngeles): string {
  return formatDateTime(instantAt(date, clock, timeZone), timeZone);
}

function countOn(counts: { date: string; count: number }[], date: string): number | undefined {
  return counts.find((day) => day.date === date)?.count;
}

describe("aggregateDays", () => {
  it("counts an inverted all-day occurrence on its start day like the agenda and month bars", () => {
    const inverted = occurrenceOf(makeAllDayEvent("2026-11-20", "2026-11-18"));
    const counts = aggregateDays([inverted], november, testZones.losAngeles);
    expect(countOn(counts, "2026-11-20")).toBe(1);
    expect(counts.reduce((total, day) => total + day.count, 0)).toBe(1);
  });

  it("returns every day of the range with zero for a quiet month", () => {
    const counts = aggregateDays([], november, testZones.losAngeles);
    expect(counts).toHaveLength(30);
    expect(counts[0]).toEqual({ date: "2026-11-01", count: 0 });
    expect(counts.at(-1)).toEqual({ date: "2026-11-30", count: 0 });
    expect(
      counts.every((day) => heatLevel(day.count, Math.max(...counts.map((each) => each.count))) === HeatLevel.None),
    ).toBe(true);
  });

  it("counts timed occurrences on their day", () => {
    const occurrences = [
      makeOccurrence(),
      makeOccurrence({ id: "second" }),
      makeOccurrence({ id: "third", start: at("2026-11-19", "09:00"), end: at("2026-11-19", "10:00") }),
    ];
    const counts = aggregateDays(occurrences, november, testZones.losAngeles);
    expect(countOn(counts, "2026-11-18")).toBe(2);
    expect(countOn(counts, "2026-11-19")).toBe(1);
    expect(countOn(counts, "2026-11-20")).toBe(0);
  });

  it("counts each day of a multi-day all-day event", () => {
    const trip = occurrenceOf(makeAllDayEvent("2026-11-20", "2026-11-23"));
    const counts = aggregateDays([trip], november, testZones.losAngeles);
    expect(
      ["2026-11-19", "2026-11-20", "2026-11-21", "2026-11-22", "2026-11-23"].map((date) => countOn(counts, date)),
    ).toEqual([0, 1, 1, 1, 0]);
  });

  it("counts both days of a timed event crossing midnight", () => {
    const late = makeOccurrence({ start: at("2026-11-18", "23:00"), end: at("2026-11-19", "01:00") });
    const counts = aggregateDays([late], november, testZones.losAngeles);
    expect([countOn(counts, "2026-11-18"), countOn(counts, "2026-11-19"), countOn(counts, "2026-11-20")]).toEqual([
      1, 1, 0,
    ]);
  });

  it("does not count the day an event ends exactly at midnight", () => {
    const evening = makeOccurrence({ start: at("2026-11-18", "22:00"), end: at("2026-11-19", "00:00") });
    const counts = aggregateDays([evening], november, testZones.losAngeles);
    expect([countOn(counts, "2026-11-18"), countOn(counts, "2026-11-19")]).toEqual([1, 0]);
  });

  it("counts a zero-minute marker on its day", () => {
    const marker = makeOccurrence({ start: at("2026-11-18", "00:00"), end: at("2026-11-18", "00:00") });
    expect(countOn(aggregateDays([marker], november, testZones.losAngeles), "2026-11-18")).toBe(1);
  });

  it("counts by the view zone", () => {
    const counts = aggregateDays(
      [makeOccurrence({ start: at("2026-11-18", "18:00"), end: at("2026-11-18", "19:00") })],
      november,
      testZones.tokyo,
    );
    expect([countOn(counts, "2026-11-18"), countOn(counts, "2026-11-19")]).toEqual([0, 1]);
  });

  it("clips events that start before or end after the range", () => {
    const long = occurrenceOf(makeAllDayEvent("2026-10-01", "2027-02-01"));
    const counts = aggregateDays([long], november, testZones.losAngeles);
    expect(counts.every((day) => day.count === 1)).toBe(true);
    const outside = occurrenceOf(makeAllDayEvent("2026-12-05", "2026-12-06"));
    expect(aggregateDays([outside], november, testZones.losAngeles).every((day) => day.count === 0)).toBe(true);
  });

  it("counts a 25 hour fall back day once", () => {
    const allDay = makeOccurrence({ start: at("2026-11-01", "00:00"), end: at("2026-11-02", "00:00") });
    const counts = aggregateDays([allDay], november, testZones.losAngeles);
    expect([countOn(counts, "2026-11-01"), countOn(counts, "2026-11-02")]).toEqual([1, 0]);
  });

  it("returns nothing for an empty range", () => {
    expect(aggregateDays([makeOccurrence()], { start: "2026-11-18", end: "2026-11-18" }, testZones.losAngeles)).toEqual(
      [],
    );
  });

  it("ignores the event zone of all-day events", () => {
    const trip = occurrenceOf(
      makeEvent({ start: "2026-11-20", end: "2026-11-21", allDay: true, timeZone: testZones.tokyo }),
    );
    expect(countOn(aggregateDays([trip], november, testZones.losAngeles), "2026-11-20")).toBe(1);
  });
});

describe("heatLevel", () => {
  it.each([
    [0, 8, HeatLevel.None],
    [3, 0, HeatLevel.None],
    [1, 8, HeatLevel.Low],
    [2, 8, HeatLevel.Low],
    [3, 8, HeatLevel.Medium],
    [4, 8, HeatLevel.Medium],
    [5, 8, HeatLevel.High],
    [6, 8, HeatLevel.High],
    [7, 8, HeatLevel.Peak],
    [8, 8, HeatLevel.Peak],
    [12, 8, HeatLevel.Peak],
    [1, 1, HeatLevel.Peak],
  ])("maps %i of %i to %s", (count, maximum, level) => {
    expect(heatLevel(count, maximum)).toBe(level);
  });

  it("scales the busiest day to Peak", () => {
    const occurrences = [
      makeOccurrence(),
      makeOccurrence({ id: "b" }),
      makeOccurrence({ id: "c" }),
      makeOccurrence({ id: "d", start: at("2026-11-19", "09:00"), end: at("2026-11-19", "10:00") }),
    ];
    const counts = aggregateDays(occurrences, november, testZones.losAngeles);
    const maximum = Math.max(...counts.map((day) => day.count));
    expect(heatLevel(countOn(counts, "2026-11-18") ?? 0, maximum)).toBe(HeatLevel.Peak);
    expect(heatLevel(countOn(counts, "2026-11-19") ?? 0, maximum)).toBe(HeatLevel.Medium);
    expect(heatLevel(countOn(counts, "2026-11-20") ?? 0, maximum)).toBe(HeatLevel.None);
  });
});

describe("heatScale", () => {
  it("matches the five brand steps", () => {
    expect(heatScale).toEqual({ none: 0, low: 22, medium: 45, high: 70, peak: 100 });
  });
});
