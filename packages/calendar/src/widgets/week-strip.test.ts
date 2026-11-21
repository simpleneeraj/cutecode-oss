import { describe, expect, it } from "vitest";
import { makeSettings } from "../testing";
import { Weekday } from "../types";
import { weekStrip } from "./week-strip";

describe("weekStrip", () => {
  it("lists the Sunday start week around the anchor", () => {
    const days = weekStrip("2026-11-18", makeSettings(), "2026-11-18");
    expect(days.map((day) => day.date)).toEqual([
      "2026-11-15",
      "2026-11-16",
      "2026-11-17",
      "2026-11-18",
      "2026-11-19",
      "2026-11-20",
      "2026-11-21",
    ]);
  });

  it("lists the Monday start week around the anchor", () => {
    const days = weekStrip("2026-11-22", makeSettings({ weekStartsOn: Weekday.Monday }), "2026-11-18");
    expect(days[0]?.date).toBe("2026-11-16");
    expect(days[6]?.date).toBe("2026-11-22");
  });

  it("flags past days, today and the selected anchor", () => {
    const days = weekStrip("2026-11-20", makeSettings(), "2026-11-18");
    expect(days.filter((day) => day.past).map((day) => day.date)).toEqual(["2026-11-15", "2026-11-16", "2026-11-17"]);
    expect(days.filter((day) => day.today).map((day) => day.date)).toEqual(["2026-11-18"]);
    expect(days.filter((day) => day.selected).map((day) => day.date)).toEqual(["2026-11-20"]);
  });

  it("marks a whole earlier week as past", () => {
    const days = weekStrip("2026-11-04", makeSettings(), "2026-11-18");
    expect(days.every((day) => day.past && !day.today)).toBe(true);
  });

  it("crosses a year boundary", () => {
    const days = weekStrip("2027-01-01", makeSettings({ weekStartsOn: Weekday.Monday }), "2026-12-31");
    expect(days[0]?.date).toBe("2026-12-28");
    expect(days[6]?.date).toBe("2027-01-03");
    expect(days.find((day) => day.today)?.date).toBe("2026-12-31");
  });

  it("keeps seven days across a DST change", () => {
    const days = weekStrip("2026-11-01", makeSettings(), "2026-11-01");
    expect(days).toHaveLength(7);
    expect(days[6]?.date).toBe("2026-11-07");
  });
});
