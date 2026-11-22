import { describe, expect, it } from "vitest";

import { makeSettings } from "../../testing";
import { Weekday } from "../../types";
import { weekStrip } from "../../widgets";
import { stripDays, weekNumber } from "./model";

const settings = makeSettings();

describe("weekNumber", () => {
  it("numbers a Sunday week from the week holding January 1", () => {
    expect(weekNumber("2026-11-18", Weekday.Sunday)).toBe(47);
    expect(weekNumber("2026-12-31", Weekday.Sunday)).toBe(1);
  });

  it("numbers a Monday week the ISO way", () => {
    expect(weekNumber("2026-11-18", Weekday.Monday)).toBe(47);
    expect(weekNumber("2027-01-01", Weekday.Monday)).toBe(53);
    expect(weekNumber("2027-01-04", Weekday.Monday)).toBe(1);
  });
});

describe("stripDays", () => {
  const week = weekStrip("2026-11-18", settings, "2026-11-18");

  it("selects the value, not the shown anchor", () => {
    const days = stripDays(week, "2026-11-20", settings, false);
    expect(days.filter((day) => day.selected).map((day) => day.date)).toEqual(["2026-11-20"]);
  });

  it("locks only past days when asked", () => {
    expect(stripDays(week, "2026-11-18", settings, false).some((day) => day.locked)).toBe(false);
    const locked = stripDays(week, "2026-11-18", settings, true).filter((day) => day.locked);
    expect(locked.map((day) => day.date)).toEqual(["2026-11-15", "2026-11-16", "2026-11-17"]);
  });

  it("marks the locale weekend", () => {
    const weekend = stripDays(week, "2026-11-18", settings, false).filter((day) => day.weekend);
    expect(weekend.map((day) => day.date)).toEqual(["2026-11-15", "2026-11-21"]);
  });
});
