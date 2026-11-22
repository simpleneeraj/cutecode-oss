import { eachDate } from "@cutecode/calendar/time";
import { makeSettings } from "@cutecode/calendar/testing";
import { Weekday } from "@cutecode/calendar/types";
import { describe, expect, it } from "vitest";

import { HeatLevel } from "../../heat/aggregate";
import { buildYearModel, eventCountLabel, monthIndexOf } from "./model";

const year = { start: "2026-01-01", end: "2027-01-01" };

function countsWith(busy: Record<string, number>) {
  return eachDate(year).map((date) => ({ date, count: busy[date] ?? 0 }));
}

const settings = makeSettings();

const model = buildYearModel({
  firstDay: year.start,
  counts: countsWith({ "2026-03-02": 8, "2026-03-03": 2, "2026-11-18": 4 }),
  settings,
  today: "2026-11-18",
});

describe("buildYearModel", () => {
  it("builds twelve months with their names", () => {
    expect(model.months).toHaveLength(12);
    expect(model.months[0]?.title).toBe("January");
    expect(model.months[11]?.title).toBe("December");
    expect(model.year).toBe("2026");
  });

  it("blanks days outside each month", () => {
    const [firstWeek] = model.months[10]?.weeks ?? [];
    expect(firstWeek?.map((cell) => cell.day?.date ?? null)).toEqual([
      "2026-11-01",
      "2026-11-02",
      "2026-11-03",
      "2026-11-04",
      "2026-11-05",
      "2026-11-06",
      "2026-11-07",
    ]);
    const [januaryFirstWeek] = model.months[0]?.weeks ?? [];
    expect(januaryFirstWeek?.filter((cell) => cell.day === null)).toHaveLength(4);
  });

  it("scales heat to the busiest day", () => {
    expect(model.days.get("2026-03-02")?.level).toBe(HeatLevel.Peak);
    expect(model.days.get("2026-11-18")?.level).toBe(HeatLevel.Medium);
    expect(model.days.get("2026-03-03")?.level).toBe(HeatLevel.Low);
    expect(model.days.get("2026-03-04")?.level).toBe(HeatLevel.None);
  });

  it("marks today and the current month", () => {
    expect(model.days.get("2026-11-18")?.isToday).toBe(true);
    expect(model.months[10]?.isCurrent).toBe(true);
    expect(model.months[2]?.isCurrent).toBe(false);
  });

  it("names each day with its count", () => {
    expect(model.days.get("2026-11-18")?.label).toBe("Wednesday, November 18, 4 events");
    expect(model.days.get("2026-03-04")?.label).toBe("Wednesday, March 4, No events");
  });

  it("sums the year and finds the busiest month", () => {
    expect(model.total).toBe(14);
    expect(model.busiestMonth).toBe("March");
    expect(model.months[2]?.total).toBe(10);
  });

  it("has no busiest month in a quiet year", () => {
    const quiet = buildYearModel({ firstDay: year.start, counts: countsWith({}), settings, today: null });
    expect(quiet.busiestMonth).toBeNull();
    expect(quiet.months.some((month) => month.isCurrent)).toBe(false);
  });

  it("follows the week start", () => {
    const monday = buildYearModel({
      firstDay: year.start,
      counts: countsWith({}),
      settings: makeSettings({ weekStartsOn: Weekday.Monday }),
      today: null,
    });
    expect(monday.weekdays[0]?.long).toBe("Monday");
    expect(monday.months[10]?.weeks).toHaveLength(6);
  });
});

describe("monthIndexOf", () => {
  it("finds the month of a day", () => {
    expect(monthIndexOf("2026-11-18", model)).toBe(10);
    expect(monthIndexOf("2027-01-01", model)).toBe(-1);
  });
});

describe("eventCountLabel", () => {
  it.each([
    [0, "No events"],
    [1, "1 event"],
    [5, "5 events"],
  ])("labels %i as %s", (count, label) => {
    expect(eventCountLabel(count)).toBe(label);
  });
});
