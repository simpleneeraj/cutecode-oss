import { describe, expect, it } from "vitest";
import { makeSettings } from "../testing";
import { Weekday } from "../types";
import { pickerMonth, type PickerDay } from "./month";
import { SelectionMode, type DateSelection } from "./selection";

const sundayStart = makeSettings();
const mondayStart = makeSettings({ weekStartsOn: Weekday.Monday });
const today = "2026-11-21";
const emptySingle: DateSelection = { mode: SelectionMode.Single, date: null };

function dayOf(weeks: PickerDay[][], date: string): PickerDay | undefined {
  return weeks.flat().find((day) => day.date === date);
}

describe("pickerMonth grid", () => {
  it("starts a Sunday week grid on the Sunday before the first", () => {
    const weeks = pickerMonth("2026-11-18", sundayStart, emptySingle, {}, today);
    expect(weeks).toHaveLength(5);
    expect(weeks[0]?.[0]?.date).toBe("2026-11-01");
    expect(weeks[4]?.[6]?.date).toBe("2026-12-05");
  });

  it("starts a Monday week grid on the Monday before the first", () => {
    const weeks = pickerMonth("2026-11-18", mondayStart, emptySingle, {}, today);
    expect(weeks).toHaveLength(6);
    expect(weeks[0]?.[0]?.date).toBe("2026-10-26");
    expect(weeks[5]?.[6]?.date).toBe("2026-12-06");
  });

  it("keeps every row seven days long", () => {
    const weeks = pickerMonth("2027-02-10", mondayStart, emptySingle, {}, today);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks).toHaveLength(4);
  });

  it("flags days outside the month", () => {
    const weeks = pickerMonth("2026-11-18", mondayStart, emptySingle, {}, today);
    expect(dayOf(weeks, "2026-10-31")?.inMonth).toBe(false);
    expect(dayOf(weeks, "2026-11-01")?.inMonth).toBe(true);
    expect(dayOf(weeks, "2026-12-01")?.inMonth).toBe(false);
  });

  it("flags only today", () => {
    const weeks = pickerMonth("2026-11-18", sundayStart, emptySingle, {}, today);
    expect(
      weeks
        .flat()
        .filter((day) => day.today)
        .map((day) => day.date),
    ).toEqual([today]);
  });

  it("flags disabled days from every rule", () => {
    const rules = { min: "2026-11-03", disabledDates: ["2026-11-26"], disabledWeekdays: [Weekday.Saturday] };
    const weeks = pickerMonth("2026-11-18", sundayStart, emptySingle, rules, today);
    expect(dayOf(weeks, "2026-11-02")?.disabled).toBe(true);
    expect(dayOf(weeks, "2026-11-03")?.disabled).toBe(false);
    expect(dayOf(weeks, "2026-11-26")?.disabled).toBe(true);
    expect(dayOf(weeks, "2026-11-14")?.disabled).toBe(true);
  });
});

describe("pickerMonth selection", () => {
  it("marks a single selected date without range flags", () => {
    const selection: DateSelection = { mode: SelectionMode.Single, date: "2026-11-18" };
    const weeks = pickerMonth("2026-11-18", sundayStart, selection, {}, today);
    expect(dayOf(weeks, "2026-11-18")).toMatchObject({ selected: true, rangeStart: false, inRange: false });
    expect(weeks.flat().filter((day) => day.selected)).toHaveLength(1);
  });

  it("marks a range start only", () => {
    const selection: DateSelection = { mode: SelectionMode.Range, start: "2026-11-18", end: null };
    const weeks = pickerMonth("2026-11-18", sundayStart, selection, {}, today);
    expect(dayOf(weeks, "2026-11-18")).toMatchObject({
      selected: true,
      rangeStart: true,
      rangeEnd: false,
      inRange: false,
    });
    expect(dayOf(weeks, "2026-11-19")?.selected).toBe(false);
  });

  it("marks start, end and the days between with an exclusive end", () => {
    const selection: DateSelection = { mode: SelectionMode.Range, start: "2026-11-18", end: "2026-11-22" };
    const weeks = pickerMonth("2026-11-18", sundayStart, selection, {}, today);
    expect(dayOf(weeks, "2026-11-17")?.inRange).toBe(false);
    expect(dayOf(weeks, "2026-11-18")).toMatchObject({ rangeStart: true, rangeEnd: false, inRange: true });
    expect(dayOf(weeks, "2026-11-19")).toMatchObject({ rangeStart: false, rangeEnd: false, inRange: true });
    expect(dayOf(weeks, "2026-11-21")).toMatchObject({ rangeStart: false, rangeEnd: true, inRange: true });
    expect(dayOf(weeks, "2026-11-22")?.inRange).toBe(false);
  });

  it("marks a one day range as both start and end", () => {
    const selection: DateSelection = { mode: SelectionMode.Range, start: "2026-11-18", end: "2026-11-19" };
    const weeks = pickerMonth("2026-11-18", sundayStart, selection, {}, today);
    expect(dayOf(weeks, "2026-11-18")).toMatchObject({ rangeStart: true, rangeEnd: true, inRange: true });
  });

  it("fills a range that starts in the previous month", () => {
    const selection: DateSelection = { mode: SelectionMode.Range, start: "2026-10-20", end: "2026-11-04" };
    const weeks = pickerMonth("2026-11-18", mondayStart, selection, {}, today);
    expect(dayOf(weeks, "2026-10-26")?.inRange).toBe(true);
    expect(dayOf(weeks, "2026-11-03")?.rangeEnd).toBe(true);
    expect(weeks.flat().some((day) => day.rangeStart)).toBe(false);
  });
});
