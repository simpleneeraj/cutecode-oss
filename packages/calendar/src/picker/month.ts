import { addDays, compareDates, monthWeeks, startOfMonth } from "../time";
import type { PlainDate, ViewSettings } from "../types";
import { isDateDisabled, SelectionMode, type DateRules, type DateSelection } from "./selection";

export type PickerDay = {
  date: PlainDate;
  inMonth: boolean;
  today: boolean;
  selected: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  inRange: boolean;
  disabled: boolean;
};

type RangeMarks = Pick<PickerDay, "selected" | "rangeStart" | "rangeEnd" | "inRange">;

const unmarked: RangeMarks = { selected: false, rangeStart: false, rangeEnd: false, inRange: false };

function isWithin(date: PlainDate, start: PlainDate, end: PlainDate): boolean {
  return compareDates(date, start) >= 0 && compareDates(date, end) < 0;
}

function rangeMarks(date: PlainDate, selection: DateSelection): RangeMarks {
  if (selection.mode === SelectionMode.Single) {
    return { ...unmarked, selected: date === selection.date };
  }
  if (selection.start === null) {
    return unmarked;
  }
  const rangeStart = date === selection.start;
  const end = selection.end ?? selection.start;
  const isOpen = compareDates(end, selection.start) <= 0;
  if (isOpen) {
    return { ...unmarked, selected: rangeStart, rangeStart };
  }
  const inRange = isWithin(date, selection.start, end);
  const rangeEnd = date === addDays(end, -1);
  return { selected: inRange, rangeStart, rangeEnd, inRange };
}

export function pickerMonth(
  month: PlainDate,
  settings: ViewSettings,
  selection: DateSelection,
  rules: DateRules,
  today: PlainDate,
): PickerDay[][] {
  const first = startOfMonth(month);
  return monthWeeks(month, settings.weekStartsOn).map((week) =>
    week.map((date) => ({
      date,
      inMonth: startOfMonth(date) === first,
      today: date === today,
      disabled: isDateDisabled(date, rules),
      ...rangeMarks(date, selection),
    })),
  );
}
