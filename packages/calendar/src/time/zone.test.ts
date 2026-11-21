import { describe, expect, it } from "vitest";
import { dstTransitions2026, testZones } from "../testing";
import { daySpan, isTimeZone, offsetMinutesAt, startOfDay, toInstant, toWallClock, zoneTransitions } from "./zone";

describe("zones", () => {
  it("reads offsets including half and quarter hours", () => {
    const instant = Date.UTC(2026, 10, 18, 12);
    expect(offsetMinutesAt(instant, testZones.losAngeles)).toBe(-480);
    expect(offsetMinutesAt(instant, testZones.kolkata)).toBe(330);
    expect(offsetMinutesAt(instant, testZones.kathmandu)).toBe(345);
    expect(offsetMinutesAt(instant, testZones.chatham)).toBe(825);
    expect(offsetMinutesAt(instant, testZones.utc)).toBe(0);
  });

  it("rejects unknown zones", () => {
    expect(isTimeZone("Mars/Olympus")).toBe(false);
    expect(isTimeZone(testZones.berlin)).toBe(true);
  });

  it("round trips wall clocks", () => {
    const wallClock = { date: "2026-11-18", minute: 600 };
    for (const timeZone of Object.values(testZones)) {
      expect(toWallClock(toInstant(wallClock, timeZone), timeZone)).toEqual(wallClock);
    }
  });

  it("gives DST days their real length", () => {
    for (const transition of dstTransitions2026) {
      expect(daySpan(transition.date, transition.timeZone).minutes).toBe(transition.dayMinutes);
    }
    expect(daySpan("2026-11-18", testZones.losAngeles).minutes).toBe(1440);
  });

  it("pushes a spring gap time forward", () => {
    const instant = toInstant({ date: "2026-03-08", minute: 150 }, testZones.losAngeles);
    expect(toWallClock(instant, testZones.losAngeles)).toEqual({ date: "2026-03-08", minute: 210 });
  });

  it("picks the first 1 AM on the fall day", () => {
    const instant = toInstant({ date: "2026-11-01", minute: 90 }, testZones.losAngeles);
    expect(instant).toBe(Date.UTC(2026, 10, 1, 8, 30));
  });

  it("starts a day after a midnight gap at the first real minute", () => {
    const start = startOfDay("2026-09-06", testZones.santiago);
    expect(toWallClock(start, testZones.santiago)).toEqual({ date: "2026-09-06", minute: 60 });
  });

  it("starts the day after a midnight fall back at its only real midnight", () => {
    const start = startOfDay("2026-04-05", testZones.santiago);
    expect(start).toBe(Date.UTC(2026, 3, 5, 4));
    expect(toWallClock(start, testZones.santiago)).toEqual({ date: "2026-04-05", minute: 0 });
  });

  it("lists the transitions in a range", () => {
    const year = { start: Date.UTC(2026, 0, 1), end: Date.UTC(2027, 0, 1) };
    expect(zoneTransitions(year, testZones.losAngeles)).toEqual([
      { instant: Date.UTC(2026, 2, 8, 10), changeMinutes: 60, offsetMinutes: -420 },
      { instant: Date.UTC(2026, 10, 1, 9), changeMinutes: -60, offsetMinutes: -480 },
    ]);
    expect(zoneTransitions(year, testZones.tokyo)).toEqual([]);
  });

  it("finds each transition to the exact minute wherever the scan starts", () => {
    const year = { start: Date.UTC(2026, 0, 1), end: Date.UTC(2027, 0, 1) };
    expect(zoneTransitions(year, testZones.chatham).map((transition) => transition.instant)).toEqual([
      Date.UTC(2026, 3, 4, 14),
      Date.UTC(2026, 8, 26, 14),
    ]);
    const shifted = { start: Date.UTC(2026, 9, 31, 23, 59), end: Date.UTC(2026, 10, 2) };
    expect(zoneTransitions(shifted, testZones.losAngeles)).toEqual([
      { instant: Date.UTC(2026, 10, 1, 9), changeMinutes: -60, offsetMinutes: -480 },
    ]);
  });

  it("takes the first pass of a repeated half hour on Lord Howe", () => {
    const repeated = { date: "2026-04-05", minute: 105 };
    expect(toInstant(repeated, "Australia/Lord_Howe")).toBe(Date.UTC(2026, 3, 4, 14, 45));
  });

  it("keeps a transition that sits exactly at the range start", () => {
    const day = daySpan("2026-09-06", "America/Santiago");
    expect(zoneTransitions(day, "America/Santiago").map((transition) => transition.instant)).toEqual([day.start]);
  });
});
