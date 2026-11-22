import { formatPlainDate } from "../../locale";
import { RangeValidity, validateRange, type DateRules, type SingleSelection } from "../../picker";
import type { ViewSettings } from "../../types";

export type SingleSummary = {
  text: string;
  isInvalid: boolean;
  canConfirm: boolean;
};

export const datePickerCopy = {
  label: "Date",
  pickDate: "Pick a date.",
  unavailable: "That date is unavailable. Pick another.",
};

const summaryDate: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };

export function singleSummary(selection: SingleSelection, rules: DateRules, settings: ViewSettings): SingleSummary {
  const validity = validateRange(selection, rules);
  if (selection.date === null) {
    return { text: datePickerCopy.pickDate, isInvalid: false, canConfirm: false };
  }
  if (validity === RangeValidity.ContainsDisabled) {
    return { text: datePickerCopy.unavailable, isInvalid: true, canConfirm: false };
  }
  return { text: formatPlainDate(selection.date, settings, summaryDate), isInvalid: false, canConfirm: true };
}
