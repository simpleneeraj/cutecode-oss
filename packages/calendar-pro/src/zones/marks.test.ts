import { describe, expect, it } from "vitest";
import { daySpan } from "@cutecode/calendar/time";
import { testZones } from "@cutecode/calendar/testing";
import { secondaryZoneMarks } from "./marks";

function wallMinutes(date: string, primaryZone: string, secondZone: string): number[] {
  return secondaryZoneMarks(daySpan(date, primaryZone), secondZone).map((mark) => mark.wallMinute);
}

describe("secondaryZoneMarks", () => {
  it("gives one mark per elapsed primary hour", () => {
    const marks = secondaryZoneMarks(daySpan("2026-11-18", testZones.losAngeles), testZones.london);
    expect(marks).toHaveLength(24);
    expect(marks.map((mark) => mark.minute)).toEqual(Array.from({ length: 24 }, (_, hour) => hour * 60));
  });

  it("follows London alone in the week only London has switched", () => {
    expect(wallMinutes("2026-10-20", testZones.losAngeles, testZones.london)[0]).toBe(8 * 60);
    expect(wallMinutes("2026-10-26", testZones.losAngeles, testZones.london)[0]).toBe(7 * 60);
    const marks = secondaryZoneMarks(daySpan("2026-10-26", testZones.losAngeles), testZones.london);
    expect(marks[0]?.offsetMinutes).toBe(0);
    expect(marks[17]).toEqual({ minute: 1020, date: "2026-10-27", wallMinute: 0, offsetMinutes: 0, dayShift: 1 });
  });

  it("returns to an eight hour gap once Los Angeles falls back", () => {
    const marks = secondaryZoneMarks(daySpan("2026-11-01", testZones.losAngeles), testZones.london);
    expect(marks).toHaveLength(25);
    expect(marks.map((mark) => mark.wallMinute).slice(0, 4)).toEqual([420, 480, 540, 600]);
    expect(marks[24]).toEqual({ minute: 1440, date: "2026-11-02", wallMinute: 420, offsetMinutes: 0, dayShift: 1 });
  });

  it("gives 23 marks on the primary spring day", () => {
    expect(secondaryZoneMarks(daySpan("2026-03-08", testZones.losAngeles), testZones.utc)).toHaveLength(23);
  });

  it("keeps the fall back hour in the second zone when only it repeats", () => {
    const marks = secondaryZoneMarks(daySpan("2026-11-01", testZones.utc), testZones.losAngeles);
    expect(marks.slice(7, 11).map((mark) => [mark.wallMinute, mark.offsetMinutes])).toEqual([
      [0, -420],
      [60, -420],
      [60, -480],
      [120, -480],
    ]);
  });

  it.each([
    [testZones.kolkata, 330],
    [testZones.kathmandu, 345],
    [testZones.chatham, 825],
    [testZones.stJohns, -210],
  ])("shows the %s offset of %i minutes", (timeZone, offsetMinutes) => {
    const [first] = secondaryZoneMarks(daySpan("2026-11-18", testZones.utc), timeZone);
    expect(first?.offsetMinutes).toBe(offsetMinutes);
    expect(first?.wallMinute).toBe((offsetMinutes + 1440) % 1440);
  });

  it("shifts Tokyo a day ahead of Los Angeles", () => {
    const marks = secondaryZoneMarks(daySpan("2026-11-18", testZones.losAngeles), testZones.tokyo);
    expect(marks[6]).toEqual({ minute: 360, date: "2026-11-18", wallMinute: 1380, offsetMinutes: 540, dayShift: 0 });
    expect(marks[7]).toEqual({ minute: 420, date: "2026-11-19", wallMinute: 0, offsetMinutes: 540, dayShift: 1 });
  });

  it("shifts Los Angeles a day behind Tokyo", () => {
    const [first] = secondaryZoneMarks(daySpan("2026-11-18", testZones.tokyo), testZones.losAngeles);
    expect(first).toEqual({ minute: 0, date: "2026-11-17", wallMinute: 420, offsetMinutes: -480, dayShift: -1 });
  });

  it("matches the primary zone exactly when both zones are the same", () => {
    const marks = secondaryZoneMarks(daySpan("2026-11-18", testZones.berlin), testZones.berlin);
    expect(marks.every((mark) => mark.dayShift === 0 && mark.wallMinute === mark.minute)).toBe(true);
  });
});
