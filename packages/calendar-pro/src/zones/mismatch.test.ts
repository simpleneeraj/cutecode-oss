import { describe, expect, it } from "vitest";
import { instantAt, testZones } from "@cutecode/calendar/testing";
import { convertWallClock, zoneLabel, zoneMismatch, ZoneMismatchKind } from "./mismatch";

const midNovember = instantAt("2026-11-18", "09:00");
const midJuly = instantAt("2026-07-15", "09:00");

describe("zoneMismatch", () => {
  it("reports an offset mismatch with both offsets", () => {
    expect(zoneMismatch(testZones.london, testZones.losAngeles, midNovember)).toEqual({
      kind: ZoneMismatchKind.Offset,
      deviceOffsetMinutes: 0,
      calendarOffsetMinutes: -480,
    });
  });

  it("treats alias zones as the same zone", () => {
    expect(zoneMismatch("Asia/Calcutta", testZones.kolkata, midNovember).kind).toBe(ZoneMismatchKind.None);
    expect(zoneMismatch("US/Pacific", testZones.losAngeles, midJuly).kind).toBe(ZoneMismatchKind.None);
  });

  it("matches identical zones", () => {
    expect(zoneMismatch(testZones.tokyo, testZones.tokyo, midNovember)).toEqual({
      kind: ZoneMismatchKind.None,
      deviceOffsetMinutes: 540,
      calendarOffsetMinutes: 540,
    });
  });

  it("reports a mismatch in both seasons when only one zone keeps daylight time", () => {
    expect(zoneMismatch("America/Phoenix", testZones.losAngeles, midJuly)).toEqual({
      kind: ZoneMismatchKind.Offset,
      deviceOffsetMinutes: -420,
      calendarOffsetMinutes: -420,
    });
    expect(zoneMismatch("America/Phoenix", testZones.losAngeles, midNovember).kind).toBe(ZoneMismatchKind.Offset);
  });

  it("reports a mismatch when same-offset zones change clocks on different dates", () => {
    const lateFebruary = instantAt("2026-02-20", "09:00");
    expect(zoneMismatch("America/Havana", "America/New_York", lateFebruary).kind).toBe(ZoneMismatchKind.Offset);
    expect(zoneMismatch(testZones.london, "Europe/Lisbon", midJuly).kind).toBe(ZoneMismatchKind.None);
  });

  it("refuses an unknown zone", () => {
    expect(() => zoneMismatch("Mars/Olympus", testZones.utc, midNovember)).toThrow(RangeError);
  });
});

describe("zoneLabel", () => {
  it.each([
    [testZones.losAngeles, midNovember, "GMT-8"],
    [testZones.losAngeles, midJuly, "GMT-7"],
    [testZones.kolkata, midNovember, "GMT+5:30"],
    [testZones.kathmandu, midNovember, "GMT+5:45"],
    [testZones.chatham, midNovember, "GMT+13:45"],
  ])("labels %s", (timeZone, at, label) => {
    expect(zoneLabel(timeZone, at, "en-US")).toBe(label);
  });

  it("labels UTC with a zero offset as the runtime writes it", () => {
    expect(zoneLabel(testZones.utc, midNovember, "en-US")).toMatch(/^GMT(\+0)?$/);
  });

  it("follows the locale", () => {
    expect(zoneLabel(testZones.kolkata, midNovember, "de-DE")).toBe("GMT+5:30");
  });
});

describe("convertWallClock", () => {
  it("moves a wall clock into another zone", () => {
    const wallClock = { date: "2026-11-18", minute: 9 * 60 };
    expect(convertWallClock(wallClock, testZones.losAngeles, testZones.london)).toEqual({
      date: "2026-11-18",
      minute: 17 * 60,
    });
    expect(convertWallClock(wallClock, testZones.losAngeles, testZones.tokyo)).toEqual({
      date: "2026-11-19",
      minute: 2 * 60,
    });
  });

  it("crosses midnight backward", () => {
    expect(convertWallClock({ date: "2026-11-18", minute: 60 }, testZones.tokyo, testZones.kolkata)).toEqual({
      date: "2026-11-17",
      minute: 21 * 60 + 30,
    });
  });

  it("moves a time in the spring gap forward", () => {
    expect(convertWallClock({ date: "2026-03-08", minute: 150 }, testZones.losAngeles, testZones.utc)).toEqual({
      date: "2026-03-08",
      minute: 10 * 60 + 30,
    });
  });

  it("picks the first of a repeated fall hour", () => {
    expect(convertWallClock({ date: "2026-11-01", minute: 90 }, testZones.losAngeles, testZones.utc)).toEqual({
      date: "2026-11-01",
      minute: 8 * 60 + 30,
    });
  });
});
