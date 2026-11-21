import { describe, expect, it } from "vitest";
import { Weekday } from "../types";
import {
  isDateDisabled,
  RangeValidity,
  selectDate,
  SelectionMode,
  validateRange,
  type DateRules,
  type DateSelection,
} from "./selection";

const noRules: DateRules = {};
const emptySingle: DateSelection = { mode: SelectionMode.Single, date: null };
const emptyRange: DateSelection = { mode: SelectionMode.Range, start: null, end: null };

describe("isDateDisabled", () => {
  it("answers from a new rules object, not a stale cached one", () => {
    expect(isDateDisabled("2026-11-26", { disabledDates: ["2026-11-26"] })).toBe(true);
    expect(isDateDisabled("2026-11-26", { disabledDates: ["2026-11-27"] })).toBe(false);
  });

  it("checks a year long range against many blocked dates", () => {
    const blocked = Array.from({ length: 200 }, (_, index) => `2028-01-${String((index % 28) + 1).padStart(2, "0")}`);
    const rules: DateRules = { disabledDates: blocked, disabledWeekdays: [Weekday.Saturday] };
    const yearRange: DateSelection = { mode: SelectionMode.Range, start: "2027-01-04", end: "2027-12-31" };
    expect(validateRange(yearRange, rules)).toBe(RangeValidity.ContainsDisabled);
    const weekdays: DateSelection = { mode: SelectionMode.Range, start: "2027-01-04", end: "2027-01-09" };
    expect(validateRange(weekdays, rules)).toBe(RangeValidity.Valid);
  });

  it("allows every date without rules", () => {
    expect(isDateDisabled("2026-11-18", noRules)).toBe(false);
  });

  it("treats min and max as inclusive bounds", () => {
    const rules: DateRules = { min: "2026-11-10", max: "2026-11-20" };
    expect(isDateDisabled("2026-11-09", rules)).toBe(true);
    expect(isDateDisabled("2026-11-10", rules)).toBe(false);
    expect(isDateDisabled("2026-11-20", rules)).toBe(false);
    expect(isDateDisabled("2026-11-21", rules)).toBe(true);
  });

  it("compares min and max across months and years", () => {
    const rules: DateRules = { min: "2026-12-31", max: "2027-01-02" };
    expect(isDateDisabled("2026-12-30", rules)).toBe(true);
    expect(isDateDisabled("2027-01-01", rules)).toBe(false);
    expect(isDateDisabled("2027-01-03", rules)).toBe(true);
  });

  it("disables listed dates", () => {
    const rules: DateRules = { disabledDates: ["2026-11-26"] };
    expect(isDateDisabled("2026-11-26", rules)).toBe(true);
    expect(isDateDisabled("2026-11-27", rules)).toBe(false);
  });

  it("disables weekdays", () => {
    const rules: DateRules = { disabledWeekdays: [Weekday.Saturday, Weekday.Sunday] };
    expect(isDateDisabled("2026-11-21", rules)).toBe(true);
    expect(isDateDisabled("2026-11-22", rules)).toBe(true);
    expect(isDateDisabled("2026-11-23", rules)).toBe(false);
  });

  it("handles a leap day", () => {
    expect(isDateDisabled("2028-02-29", { disabledWeekdays: [Weekday.Tuesday] })).toBe(true);
  });
});

describe("selectDate single", () => {
  it("selects the tapped date", () => {
    expect(selectDate(emptySingle, "2026-11-18", noRules)).toEqual({ mode: SelectionMode.Single, date: "2026-11-18" });
  });

  it("replaces an earlier selection", () => {
    const selected = selectDate(emptySingle, "2026-11-18", noRules);
    expect(selectDate(selected, "2026-11-02", noRules)).toEqual({ mode: SelectionMode.Single, date: "2026-11-02" });
  });

  it("ignores a tap on a disabled date", () => {
    const selected: DateSelection = { mode: SelectionMode.Single, date: "2026-11-18" };
    expect(selectDate(selected, "2026-11-26", { disabledDates: ["2026-11-26"] })).toBe(selected);
  });

  it("ignores a tap outside min and max", () => {
    expect(selectDate(emptySingle, "2026-12-01", { max: "2026-11-30" })).toBe(emptySingle);
  });
});

describe("selectDate range", () => {
  it("makes the first tap the start only", () => {
    expect(selectDate(emptyRange, "2026-11-18", noRules)).toEqual({
      mode: SelectionMode.Range,
      start: "2026-11-18",
      end: null,
    });
  });

  it("ends the range after the second tap, end exclusive", () => {
    const started = selectDate(emptyRange, "2026-11-18", noRules);
    expect(selectDate(started, "2026-11-21", noRules)).toEqual({
      mode: SelectionMode.Range,
      start: "2026-11-18",
      end: "2026-11-22",
    });
  });

  it("makes a one day range when the start is tapped again", () => {
    const started = selectDate(emptyRange, "2026-11-18", noRules);
    expect(selectDate(started, "2026-11-18", noRules)).toEqual({
      mode: SelectionMode.Range,
      start: "2026-11-18",
      end: "2026-11-19",
    });
  });

  it("restarts when the second tap is before the start", () => {
    const started = selectDate(emptyRange, "2026-11-18", noRules);
    expect(selectDate(started, "2026-11-10", noRules)).toEqual({
      mode: SelectionMode.Range,
      start: "2026-11-10",
      end: null,
    });
  });

  it("restarts after a complete range", () => {
    const complete: DateSelection = { mode: SelectionMode.Range, start: "2026-11-18", end: "2026-11-22" };
    expect(selectDate(complete, "2026-11-25", noRules)).toEqual({
      mode: SelectionMode.Range,
      start: "2026-11-25",
      end: null,
    });
  });

  it("ends a range across a month and year boundary", () => {
    const started = selectDate(emptyRange, "2026-12-30", noRules);
    expect(selectDate(started, "2026-12-31", noRules)).toEqual({
      mode: SelectionMode.Range,
      start: "2026-12-30",
      end: "2027-01-01",
    });
  });

  it("ignores a tap on a disabled date for both start and end", () => {
    const rules: DateRules = { disabledWeekdays: [Weekday.Sunday] };
    expect(selectDate(emptyRange, "2026-11-22", rules)).toBe(emptyRange);
    const started = selectDate(emptyRange, "2026-11-18", rules);
    expect(selectDate(started, "2026-11-22", rules)).toBe(started);
  });
});

describe("validateRange", () => {
  it("is incomplete with nothing selected", () => {
    expect(validateRange(emptySingle, noRules)).toBe(RangeValidity.Incomplete);
    expect(validateRange(emptyRange, noRules)).toBe(RangeValidity.Incomplete);
  });

  it("is incomplete with only a start", () => {
    const started: DateSelection = { mode: SelectionMode.Range, start: "2026-11-18", end: null };
    expect(validateRange(started, noRules)).toBe(RangeValidity.Incomplete);
  });

  it("is incomplete when the end is not after the start", () => {
    const inverted: DateSelection = { mode: SelectionMode.Range, start: "2026-11-18", end: "2026-11-18" };
    expect(validateRange(inverted, noRules)).toBe(RangeValidity.Incomplete);
  });

  it("is valid for a clean range", () => {
    const range: DateSelection = { mode: SelectionMode.Range, start: "2026-11-18", end: "2026-11-22" };
    expect(validateRange(range, { disabledDates: ["2026-11-22"] })).toBe(RangeValidity.Valid);
  });

  it("contains disabled when a date inside is disabled", () => {
    const range: DateSelection = { mode: SelectionMode.Range, start: "2026-11-18", end: "2026-11-25" };
    expect(validateRange(range, { disabledDates: ["2026-11-20"] })).toBe(RangeValidity.ContainsDisabled);
    expect(validateRange(range, { disabledWeekdays: [Weekday.Saturday] })).toBe(RangeValidity.ContainsDisabled);
  });

  it("contains disabled when the range runs past max", () => {
    const range: DateSelection = { mode: SelectionMode.Range, start: "2026-11-28", end: "2026-12-03" };
    expect(validateRange(range, { max: "2026-11-30" })).toBe(RangeValidity.ContainsDisabled);
  });

  it("checks a single date against the rules", () => {
    const selected: DateSelection = { mode: SelectionMode.Single, date: "2026-11-26" };
    expect(validateRange(selected, noRules)).toBe(RangeValidity.Valid);
    expect(validateRange(selected, { disabledDates: ["2026-11-26"] })).toBe(RangeValidity.ContainsDisabled);
  });
});
