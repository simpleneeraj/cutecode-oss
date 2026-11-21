import { describe, expect, it } from "vitest";
import { Weekday } from "../types";
import { monthWeeks, weekDates } from "./calendar-grid";

describe("calendar grids", () => {
  it("builds a week from either start day", () => {
    expect(weekDates("2026-11-18", Weekday.Sunday)[0]).toBe("2026-11-15");
    expect(weekDates("2026-11-18", Weekday.Monday)).toEqual([
      "2026-11-16",
      "2026-11-17",
      "2026-11-18",
      "2026-11-19",
      "2026-11-20",
      "2026-11-21",
      "2026-11-22",
    ]);
  });

  it("gives November 2026 five rows from Sunday and six from Monday", () => {
    const sunday = monthWeeks("2026-11-18", Weekday.Sunday);
    const monday = monthWeeks("2026-11-18", Weekday.Monday);
    expect(sunday).toHaveLength(5);
    expect(sunday[0]?.[0]).toBe("2026-11-01");
    expect(monday).toHaveLength(6);
    expect(monday[0]?.[0]).toBe("2026-10-26");
    expect(monday[5]?.[6]).toBe("2026-12-06");
  });

  it("gives a February that starts on the week start four rows", () => {
    expect(monthWeeks("2026-02-10", Weekday.Sunday)).toHaveLength(4);
  });
});
