import { describe, expect, it } from "vitest";
import { instantAt, makeEvent, testZones } from "../testing";
import { daySpan } from "../time";
import { OccurrenceKind, type Instant, type TimedOccurrence } from "../types";
import { foldHours } from "./hours";

function timed(start: Instant, end: Instant): TimedOccurrence {
  return { kind: OccurrenceKind.Timed, key: `slot-${start}`, event: makeEvent(), originalStart: "", start, end };
}

const officeHours = { start: "09:00", end: "17:00" };

describe("foldHours", () => {
  const date = "2026-11-18";
  const day = daySpan(date, testZones.losAngeles);

  it("counts nothing when every event is inside the shown hours", () => {
    const occurrences = [timed(instantAt(date, "10:00"), instantAt(date, "11:00"))];
    expect(foldHours(day, officeHours, occurrences, testZones.losAngeles)).toEqual({
      earlierCount: 0,
      earliestMinute: null,
      laterCount: 0,
      latestMinute: null,
    });
  });

  it("counts events before and after the shown hours", () => {
    const occurrences = [
      timed(instantAt(date, "06:30"), instantAt(date, "07:00")),
      timed(instantAt(date, "08:00"), instantAt(date, "08:30")),
      timed(instantAt(date, "10:00"), instantAt(date, "11:00")),
      timed(instantAt(date, "18:00"), instantAt(date, "21:00")),
    ];
    expect(foldHours(day, officeHours, occurrences, testZones.losAngeles)).toEqual({
      earlierCount: 2,
      earliestMinute: 390,
      laterCount: 1,
      latestMinute: 1260,
    });
  });

  it("counts an event that spans the whole shown range on both sides", () => {
    const occurrences = [timed(instantAt(date, "08:00"), instantAt(date, "18:00"))];
    expect(foldHours(day, officeHours, occurrences, testZones.losAngeles)).toMatchObject({
      earlierCount: 1,
      laterCount: 1,
    });
  });

  it("clamps events from other days to the day edges", () => {
    const occurrences = [
      timed(instantAt("2026-11-17", "22:00"), instantAt(date, "01:00")),
      timed(instantAt(date, "23:00"), instantAt("2026-11-19", "02:00")),
      timed(instantAt("2026-11-19", "06:00"), instantAt("2026-11-19", "07:00")),
    ];
    expect(foldHours(day, officeHours, occurrences, testZones.losAngeles)).toEqual({
      earlierCount: 1,
      earliestMinute: 0,
      laterCount: 1,
      latestMinute: 1440,
    });
  });

  it("counts an event that ends exactly at the shown start as earlier", () => {
    const occurrences = [timed(instantAt(date, "08:00"), instantAt(date, "09:00"))];
    expect(foldHours(day, officeHours, occurrences, testZones.losAngeles)).toMatchObject({
      earlierCount: 1,
      earliestMinute: 480,
      laterCount: 0,
    });
  });

  it("counts an event that starts exactly at the shown end as later", () => {
    const occurrences = [timed(instantAt(date, "17:00"), instantAt(date, "18:00"))];
    expect(foldHours(day, officeHours, occurrences, testZones.losAngeles)).toMatchObject({
      earlierCount: 0,
      laterCount: 1,
      latestMinute: 1080,
    });
  });

  it("counts nothing for an event that fills the shown hours exactly", () => {
    const occurrences = [timed(instantAt(date, "09:00"), instantAt(date, "17:00"))];
    expect(foldHours(day, officeHours, occurrences, testZones.losAngeles)).toMatchObject({
      earlierCount: 0,
      laterCount: 0,
    });
  });

  it("counts a zero minute marker at midnight as earlier on its own day only", () => {
    const midnight = instantAt(date, "00:00");
    const occurrences = [timed(midnight, midnight)];
    expect(foldHours(day, officeHours, occurrences, testZones.losAngeles)).toMatchObject({
      earlierCount: 1,
      earliestMinute: 0,
    });
    const previousDay = daySpan("2026-11-17", testZones.losAngeles);
    expect(foldHours(previousDay, officeHours, occurrences, testZones.losAngeles)).toMatchObject({
      earlierCount: 0,
      laterCount: 0,
    });
  });

  it("leaves zero minute markers on the shown edges visible", () => {
    const occurrences = [
      timed(instantAt(date, "09:00"), instantAt(date, "09:00")),
      timed(instantAt(date, "17:00"), instantAt(date, "17:00")),
    ];
    expect(foldHours(day, officeHours, occurrences, testZones.losAngeles)).toMatchObject({
      earlierCount: 0,
      laterCount: 0,
    });
  });

  it("measures elapsed minutes on the spring day", () => {
    const springDate = "2026-03-08";
    const springDay = daySpan(springDate, testZones.losAngeles);
    const occurrences = [
      timed(instantAt(springDate, "07:00"), instantAt(springDate, "08:00")),
      timed(instantAt(springDate, "17:30"), instantAt(springDate, "18:00")),
    ];
    expect(foldHours(springDay, officeHours, occurrences, testZones.losAngeles)).toEqual({
      earlierCount: 1,
      earliestMinute: 360,
      laterCount: 1,
      latestMinute: 1020,
    });
  });

  it("rejects inverted shown hours", () => {
    expect(() => foldHours(day, { start: "22:00", end: "06:00" }, [], testZones.losAngeles)).toThrow(RangeError);
  });

  it("measures elapsed minutes on the fall day", () => {
    const fallDate = "2026-11-01";
    const fallDay = daySpan(fallDate, testZones.losAngeles);
    const occurrences = [timed(instantAt(fallDate, "06:30"), instantAt(fallDate, "07:00"))];
    expect(foldHours(fallDay, officeHours, occurrences, testZones.losAngeles)).toMatchObject({
      earlierCount: 1,
      earliestMinute: 450,
    });
  });
});
