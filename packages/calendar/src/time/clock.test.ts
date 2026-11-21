import { describe, expect, it } from "vitest";
import { instantAt, testZones } from "../testing";
import { formatClockTime, isWithinClockRange, parseClockTime } from "./clock";

describe("clock times", () => {
  it("parses and formats", () => {
    expect(parseClockTime("09:00")).toBe(540);
    expect(parseClockTime("24:00")).toBe(1440);
    expect(formatClockTime(1125)).toBe("18:45");
  });

  it("rejects bad input", () => {
    expect(() => parseClockTime("9:00")).toThrow(RangeError);
    expect(() => parseClockTime("10:60")).toThrow(RangeError);
    expect(() => parseClockTime("24:30")).toThrow(RangeError);
  });
});

describe("isWithinClockRange", () => {
  const office = { start: "09:00", end: "17:00" };
  const night = { start: "22:00", end: "06:00" };

  function range(startClock: string, endClock: string, endDate = "2026-11-18") {
    return { start: instantAt("2026-11-18", startClock), end: instantAt(endDate, endClock) };
  }

  it("checks a daytime range, edges included", () => {
    expect(isWithinClockRange(range("09:00", "17:00"), office, testZones.losAngeles)).toBe(true);
    expect(isWithinClockRange(range("08:45", "10:00"), office, testZones.losAngeles)).toBe(false);
    expect(isWithinClockRange(range("16:00", "17:15"), office, testZones.losAngeles)).toBe(false);
  });

  it("checks an overnight range", () => {
    expect(isWithinClockRange(range("23:00", "01:00", "2026-11-19"), night, testZones.losAngeles)).toBe(true);
    expect(isWithinClockRange(range("02:00", "05:00"), night, testZones.losAngeles)).toBe(true);
    expect(isWithinClockRange(range("12:00", "13:00"), night, testZones.losAngeles)).toBe(false);
    expect(isWithinClockRange(range("23:00", "07:00", "2026-11-19"), night, testZones.losAngeles)).toBe(false);
  });

  it("reads the wall clock in the zone it is given", () => {
    expect(isWithinClockRange(range("17:00", "18:00"), office, testZones.tokyo)).toBe(true);
    expect(isWithinClockRange(range("17:00", "18:00"), office, testZones.losAngeles)).toBe(false);
  });
});
