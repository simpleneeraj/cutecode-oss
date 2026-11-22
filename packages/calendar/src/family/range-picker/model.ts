import { formatPlainDate } from "../../locale";
import { RangeValidity, validateRange, type DateRules, type RangeSelection } from "../../picker";
import { addDays, compareDates, daysBetween } from "../../time";
import type { PlainDate, ViewSettings } from "../../types";

export type RangeSummary = {
  text: string;
  isInvalid: boolean;
  canConfirm: boolean;
};

export const rangePickerCopy = {
  label: "Dates",
  pickStart: "Pick a start date.",
  pickEnd: "Pick an end date.",
  endBeforeStart: "End is before start. Pick a later date.",
  unavailable: "Some dates are unavailable. Pick other dates.",
  oneDay: "one day",
  nights: (count: number) => (count === 1 ? "1 night" : `${count} nights`),
};

const shortDate: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

function prompt(text: string): RangeSummary {
  return { text, isInvalid: false, canConfirm: false };
}

function refusal(text: string): RangeSummary {
  return { text, isInvalid: true, canConfirm: false };
}

function rangeText(start: PlainDate, end: PlainDate, settings: ViewSettings): string {
  const startText = formatPlainDate(start, settings, shortDate);
  const lastDay = addDays(end, -1);
  const nights = daysBetween(start, lastDay);
  if (nights === 0) {
    return `${startText}, ${rangePickerCopy.oneDay}`;
  }
  return `${startText} to ${formatPlainDate(lastDay, settings, shortDate)}, ${rangePickerCopy.nights(nights)}`;
}

export function rangeSummary(selection: RangeSelection, rules: DateRules, settings: ViewSettings): RangeSummary {
  const { start, end } = selection;
  if (start === null) {
    return prompt(rangePickerCopy.pickStart);
  }
  if (end === null) {
    return prompt(`${formatPlainDate(start, settings, shortDate)}. ${rangePickerCopy.pickEnd}`);
  }
  const isEndBeforeStart = compareDates(end, start) <= 0;
  if (isEndBeforeStart) {
    return refusal(rangePickerCopy.endBeforeStart);
  }
  const hasDisabled = validateRange(selection, rules) === RangeValidity.ContainsDisabled;
  if (hasDisabled) {
    return refusal(rangePickerCopy.unavailable);
  }
  return { text: rangeText(start, end, settings), isInvalid: false, canConfirm: true };
}
