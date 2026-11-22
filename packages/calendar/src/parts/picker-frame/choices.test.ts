import { describe, expect, it } from "vitest";

import type { PickerDay } from "../../picker";
import { makeSettings } from "../../testing";
import { dayMarkOf, isMonthAllowed, monthChoices, RangeBand, yearChoices } from "./choices";

const settings = makeSettings();

const plainDay: PickerDay = {
  date: "2026-11-18",
  inMonth: true,
  today: false,
  selected: false,
  rangeStart: false,
  rangeEnd: false,
  inRange: false,
  disabled: false,
};

describe("monthChoices", () => {
  it("lists the twelve months of the shown year", () => {
    const choices = monthChoices("2026-11-18", {}, settings);
    expect(choices).toHaveLength(12);
    expect(choices[0]).toEqual({ value: "2026-01-01", label: "Jan" });
    expect(choices[10]).toEqual({ value: "2026-11-01", label: "Nov" });
  });

  it("drops months outside min and max", () => {
    const choices = monthChoices("2026-06-18", { min: "2026-03-18", max: "2026-09-02" }, settings);
    expect(choices.map((choice) => choice.value)).toEqual([
      "2026-03-01",
      "2026-04-01",
      "2026-05-01",
      "2026-06-01",
      "2026-07-01",
      "2026-08-01",
      "2026-09-01",
    ]);
  });
});

describe("isMonthAllowed", () => {
  it("allows the month that holds min and refuses the one before", () => {
    expect(isMonthAllowed("2026-11-01", { min: "2026-11-18" })).toBe(true);
    expect(isMonthAllowed("2026-10-01", { min: "2026-11-18" })).toBe(false);
    expect(isMonthAllowed("2026-12-01", { max: "2026-11-30" })).toBe(false);
  });
});

describe("yearChoices", () => {
  it("spans ten years either side on the same month", () => {
    const choices = yearChoices("2026-11-18", {}, settings);
    expect(choices).toHaveLength(21);
    expect(choices[0]?.value).toBe("2016-11-01");
    expect(choices.at(-1)).toEqual({ value: "2036-11-01", label: "2036" });
  });

  it("keeps only the years inside min and max", () => {
    const choices = yearChoices("2026-11-18", { min: "2025-06-01", max: "2027-02-10" }, settings);
    expect(choices.map((choice) => choice.label)).toEqual(["2025", "2026", "2027"]);
  });

  it("always keeps the shown year", () => {
    const choices = yearChoices("2026-11-18", { min: "2030-01-01" }, settings);
    expect(choices.map((choice) => choice.value)).toContain("2026-11-01");
  });
});

describe("dayMarkOf", () => {
  it("marks a single selected day as an endpoint without a band", () => {
    expect(dayMarkOf({ ...plainDay, selected: true })).toEqual({ band: RangeBand.None, isEndpoint: true });
  });

  it("marks a range start with only a start", () => {
    expect(dayMarkOf({ ...plainDay, selected: true, rangeStart: true })).toEqual({
      band: RangeBand.None,
      isEndpoint: true,
    });
  });

  it("bands the ends and the days between", () => {
    const inside = { ...plainDay, selected: true, inRange: true };
    expect(dayMarkOf({ ...inside, rangeStart: true }).band).toBe(RangeBand.Start);
    expect(dayMarkOf(inside)).toEqual({ band: RangeBand.Middle, isEndpoint: false });
    expect(dayMarkOf({ ...inside, rangeEnd: true }).band).toBe(RangeBand.End);
  });

  it("draws a one day range as a single endpoint", () => {
    const oneDay = { ...plainDay, selected: true, inRange: true, rangeStart: true, rangeEnd: true };
    expect(dayMarkOf(oneDay)).toEqual({ band: RangeBand.None, isEndpoint: true });
  });
});
