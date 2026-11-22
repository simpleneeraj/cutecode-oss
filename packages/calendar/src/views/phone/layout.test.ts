import { describe, expect, it } from "vitest";
import { instantAt, makeSettings } from "../../testing";
import { HourZoom } from "../../parts/time-grid/props";
import { TextDirection, ViewKind, Weekday } from "../../types";
import {
  newEventRange,
  phoneStripDays,
  phoneTabOf,
  phoneTabsOf,
  pinchedZoom,
  swipeStep,
  workWeekStart,
} from "./layout";

const settings = makeSettings();

describe("phoneStripDays", () => {
  it("marks today, the past and the selected day", () => {
    const days = phoneStripDays("2026-11-19", settings, instantAt("2026-11-18", "10:00"));
    expect(days).toHaveLength(7);
    expect(days.find((day) => day.today)?.date).toBe("2026-11-18");
    expect(days.find((day) => day.selected)?.date).toBe("2026-11-19");
    expect(days.filter((day) => day.past).map((day) => day.date)).toEqual(["2026-11-15", "2026-11-16", "2026-11-17"]);
  });

  it("marks no today before the clock is known", () => {
    const days = phoneStripDays("2026-11-19", settings, null);
    expect(days.some((day) => day.today || day.past)).toBe(false);
  });
});

describe("workWeekStart", () => {
  it("skips the weekend at the start of the week", () => {
    expect(workWeekStart("2026-11-19", settings)).toBe("2026-11-16");
    expect(workWeekStart("2026-11-19", makeSettings({ weekStartsOn: Weekday.Monday }))).toBe("2026-11-16");
  });

  it("follows a Friday and Saturday weekend", () => {
    expect(workWeekStart("2026-11-19", makeSettings({ locale: "ar-EG" }))).toBe("2026-11-15");
  });
});

describe("phoneTabsOf", () => {
  it("keeps only the phone tabs the app offers", () => {
    expect(phoneTabsOf([ViewKind.Week, ViewKind.Day, ViewKind.Agenda])).toEqual([ViewKind.Day, ViewKind.Agenda]);
  });
});

describe("newEventRange", () => {
  it("starts at the next half hour today and lasts an hour", () => {
    const range = newEventRange("2026-11-18", settings, instantAt("2026-11-18", "10:10"));
    expect(range).toEqual({ start: instantAt("2026-11-18", "10:30"), end: instantAt("2026-11-18", "11:30") });
  });

  it("starts at the working day start on another day", () => {
    const working = makeSettings({ workingHours: { start: "08:30", end: "17:00" } });
    expect(newEventRange("2026-11-20", working, instantAt("2026-11-18", "10:10")).start).toBe(
      instantAt("2026-11-20", "08:30"),
    );
    expect(newEventRange("2026-11-20", settings, null).start).toBe(instantAt("2026-11-20", "09:00"));
  });
});

describe("phoneTabOf", () => {
  it("keeps list views and shows the day timeline for the rest", () => {
    expect(phoneTabOf(ViewKind.Month)).toBe(ViewKind.Month);
    expect(phoneTabOf(ViewKind.Agenda)).toBe(ViewKind.Agenda);
    expect(phoneTabOf(ViewKind.Week)).toBe(ViewKind.Day);
    expect(phoneTabOf(ViewKind.Day)).toBe(ViewKind.Day);
  });
});

describe("swipeStep", () => {
  it("goes to the next day on a swipe toward the start edge", () => {
    expect(swipeStep(-80, 0, TextDirection.LeftToRight)).toBe(1);
    expect(swipeStep(80, 0, TextDirection.LeftToRight)).toBe(-1);
  });

  it("counts a fast flick and ignores a small drag", () => {
    expect(swipeStep(-20, -900, TextDirection.LeftToRight)).toBe(1);
    expect(swipeStep(-20, -100, TextDirection.LeftToRight)).toBe(0);
  });

  it("flips for right to left text", () => {
    expect(swipeStep(-80, 0, TextDirection.RightToLeft)).toBe(-1);
  });
});

describe("pinchedZoom", () => {
  it("steps the hour height up on a spread and down on a pinch", () => {
    expect(pinchedZoom(HourZoom.Regular, 1.4)).toBe(HourZoom.Spacious);
    expect(pinchedZoom(HourZoom.Regular, 0.7)).toBe(HourZoom.Compact);
  });

  it("ignores small pinches and stops at the ends", () => {
    expect(pinchedZoom(HourZoom.Regular, 1.1)).toBe(HourZoom.Regular);
    expect(pinchedZoom(HourZoom.Spacious, 2)).toBe(HourZoom.Spacious);
    expect(pinchedZoom(HourZoom.Compact, 0.5)).toBe(HourZoom.Compact);
  });
});
