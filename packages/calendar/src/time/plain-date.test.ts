import { describe, expect, it } from "vitest";
import { Weekday } from "../types";
import {
  addDays,
  addMonths,
  compareDates,
  daysBetween,
  daysInMonth,
  eachDate,
  isPlainDate,
  startOfMonth,
  startOfWeek,
  toUtcDate,
  weekdayOf,
} from "./plain-date";

describe("plain dates", () => {
  it("validates real calendar dates", () => {
    expect(isPlainDate("2026-11-18")).toBe(true);
    expect(isPlainDate("2028-02-29")).toBe(true);
    expect(isPlainDate("2026-02-29")).toBe(false);
    expect(isPlainDate("2026-13-01")).toBe(false);
    expect(isPlainDate("2026-1-01")).toBe(false);
    expect(() => toUtcDate("2026-02-30")).toThrow(RangeError);
  });

  it("adds days across month and year edges", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(addDays("2028-03-01", -1)).toBe("2028-02-29");
  });

  it("counts and compares days", () => {
    expect(daysBetween("2026-11-20", "2026-11-23")).toBe(3);
    expect(compareDates("2026-11-20", "2026-11-23")).toBe(-1);
    expect(compareDates("2026-11-23", "2026-11-23")).toBe(0);
    expect(eachDate({ start: "2026-11-20", end: "2026-11-23" })).toEqual(["2026-11-20", "2026-11-21", "2026-11-22"]);
    expect(eachDate({ start: "2026-11-23", end: "2026-11-20" })).toEqual([]);
  });

  it("knows weekdays and week starts", () => {
    expect(weekdayOf("2026-11-18")).toBe(Weekday.Wednesday);
    expect(weekdayOf("1970-01-01")).toBe(Weekday.Thursday);
    expect(weekdayOf("1969-12-28")).toBe(Weekday.Sunday);
    expect(startOfWeek("2026-11-18", Weekday.Sunday)).toBe("2026-11-15");
    expect(startOfWeek("2026-11-18", Weekday.Monday)).toBe("2026-11-16");
    expect(startOfWeek("2026-11-15", Weekday.Monday)).toBe("2026-11-09");
    expect(startOfWeek("2026-11-01", Weekday.Saturday)).toBe("2026-10-31");
  });

  it("moves by months and clamps the day", () => {
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
    expect(addMonths("2028-01-31", 1)).toBe("2028-02-29");
    expect(addMonths("2026-11-18", -11)).toBe("2025-12-18");
    expect(addMonths("2026-11-18", 14)).toBe("2028-01-18");
    expect(startOfMonth("2026-11-18")).toBe("2026-11-01");
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2026, 12)).toBe(31);
  });
});
