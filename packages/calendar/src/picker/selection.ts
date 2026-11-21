import { addDays, compareDates, eachDate, weekdayOf } from "../time";
import type { PlainDate, Weekday } from "../types";

export enum SelectionMode {
  Single = "single",
  Range = "range",
}

export enum RangeValidity {
  Valid = "valid",
  Incomplete = "incomplete",
  ContainsDisabled = "containsDisabled",
}

export type DateRules = {
  min?: PlainDate;
  max?: PlainDate;
  disabledDates?: PlainDate[];
  disabledWeekdays?: Weekday[];
};

export type SingleSelection = { mode: SelectionMode.Single; date: PlainDate | null };

export type RangeSelection = { mode: SelectionMode.Range; start: PlainDate | null; end: PlainDate | null };

export type DateSelection = SingleSelection | RangeSelection;

function isBeforeMin(date: PlainDate, min: PlainDate | undefined): boolean {
  return min !== undefined && compareDates(date, min) < 0;
}

function isAfterMax(date: PlainDate, max: PlainDate | undefined): boolean {
  return max !== undefined && compareDates(date, max) > 0;
}

type CompiledRules = {
  disabledDates: Set<PlainDate>;
  disabledWeekdays: Set<Weekday>;
};

const compiledRulesCache = new WeakMap<DateRules, CompiledRules>();

function compileRules(rules: DateRules): CompiledRules {
  const cached = compiledRulesCache.get(rules);
  if (cached) {
    return cached;
  }
  const compiled = { disabledDates: new Set(rules.disabledDates), disabledWeekdays: new Set(rules.disabledWeekdays) };
  compiledRulesCache.set(rules, compiled);
  return compiled;
}

export function isDateDisabled(date: PlainDate, rules: DateRules): boolean {
  if (isBeforeMin(date, rules.min)) {
    return true;
  }
  if (isAfterMax(date, rules.max)) {
    return true;
  }
  const compiled = compileRules(rules);
  if (compiled.disabledDates.has(date)) {
    return true;
  }
  return compiled.disabledWeekdays.has(weekdayOf(date));
}

function selectRangeDate(selection: RangeSelection, date: PlainDate): RangeSelection {
  const restart: RangeSelection = { mode: SelectionMode.Range, start: date, end: null };
  if (selection.start === null) {
    return restart;
  }
  if (selection.end !== null) {
    return restart;
  }
  const isBeforeStart = compareDates(date, selection.start) < 0;
  if (isBeforeStart) {
    return restart;
  }
  return { mode: SelectionMode.Range, start: selection.start, end: addDays(date, 1) };
}

export function selectDate(selection: DateSelection, date: PlainDate, rules: DateRules): DateSelection {
  if (isDateDisabled(date, rules)) {
    return selection;
  }
  if (selection.mode === SelectionMode.Single) {
    return { mode: SelectionMode.Single, date };
  }
  return selectRangeDate(selection, date);
}

function validateDates(dates: PlainDate[], rules: DateRules): RangeValidity {
  if (dates.length === 0) {
    return RangeValidity.Incomplete;
  }
  const hasDisabled = dates.some((date) => isDateDisabled(date, rules));
  if (hasDisabled) {
    return RangeValidity.ContainsDisabled;
  }
  return RangeValidity.Valid;
}

export function validateRange(selection: DateSelection, rules: DateRules): RangeValidity {
  if (selection.mode === SelectionMode.Single) {
    if (selection.date === null) {
      return RangeValidity.Incomplete;
    }
    return validateDates([selection.date], rules);
  }
  if (selection.start === null || selection.end === null) {
    return RangeValidity.Incomplete;
  }
  return validateDates(eachDate({ start: selection.start, end: selection.end }), rules);
}
