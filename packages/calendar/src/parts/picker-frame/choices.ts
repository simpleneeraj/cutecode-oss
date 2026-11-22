import { formatPlainDate } from "../../locale";
import type { DateRules, PickerDay } from "../../picker";
import { addYears, compareDates, plainDateOf, startOfMonth, toUtcDate } from "../../time";
import type { PlainDate, ViewSettings } from "../../types";

export enum FrameTone {
  Accent = "accent",
  Neutral = "neutral",
}

export enum RangeBand {
  None = "none",
  Start = "start",
  Middle = "middle",
  End = "end",
}

export type MonthChoice = {
  value: PlainDate;
  label: string;
};

export type DayMark = {
  band: RangeBand;
  isEndpoint: boolean;
};

export const pickerLimits = {
  yearSpan: 10,
  monthsInYear: 12,
};

function yearOf(date: PlainDate): number {
  return toUtcDate(date).getUTCFullYear();
}

function isYearAllowed(date: PlainDate, rules: DateRules): boolean {
  const year = yearOf(date);
  const isBeforeMin = rules.min !== undefined && year < yearOf(rules.min);
  const isAfterMax = rules.max !== undefined && year > yearOf(rules.max);
  return !isBeforeMin && !isAfterMax;
}

export function isMonthAllowed(month: PlainDate, rules: DateRules): boolean {
  const first = startOfMonth(month);
  const isBeforeMin = rules.min !== undefined && compareDates(first, startOfMonth(rules.min)) < 0;
  const isAfterMax = rules.max !== undefined && compareDates(first, startOfMonth(rules.max)) > 0;
  return !isBeforeMin && !isAfterMax;
}

export function monthChoices(month: PlainDate, rules: DateRules, settings: ViewSettings): MonthChoice[] {
  const first = startOfMonth(month);
  const year = yearOf(month);
  return Array.from({ length: pickerLimits.monthsInYear }, (_, index) => plainDateOf(year, index + 1, 1))
    .filter((value) => value === first || isMonthAllowed(value, rules))
    .map((value) => ({ value, label: formatPlainDate(value, settings, { month: "short" }) }));
}

export function yearChoices(month: PlainDate, rules: DateRules, settings: ViewSettings): MonthChoice[] {
  const first = startOfMonth(month);
  const offsets = Array.from({ length: pickerLimits.yearSpan * 2 + 1 }, (_, index) => index - pickerLimits.yearSpan);
  return offsets
    .map((offset) => addYears(first, offset))
    .filter((value) => value === first || isYearAllowed(value, rules))
    .map((value) => ({ value, label: formatPlainDate(value, settings, { year: "numeric" }) }));
}

function bandOf(day: PickerDay): RangeBand {
  const isOneDay = day.rangeStart && day.rangeEnd;
  if (!day.inRange || isOneDay) {
    return RangeBand.None;
  }
  if (day.rangeStart) {
    return RangeBand.Start;
  }
  if (day.rangeEnd) {
    return RangeBand.End;
  }
  return RangeBand.Middle;
}

export function dayMarkOf(day: PickerDay): DayMark {
  const isSingle = day.selected && !day.inRange;
  return { band: bandOf(day), isEndpoint: isSingle || day.rangeStart || day.rangeEnd };
}
