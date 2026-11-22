import { ViewKind } from "../../types";

export type ViewOption = {
  view: ViewKind;
  label: string;
  letter: string;
};

export const viewOptions: ViewOption[] = [
  { view: ViewKind.Day, label: "Day", letter: "D" },
  { view: ViewKind.Week, label: "Week", letter: "W" },
  { view: ViewKind.Month, label: "Month", letter: "M" },
  { view: ViewKind.Year, label: "Year", letter: "Y" },
  { view: ViewKind.Agenda, label: "Agenda", letter: "A" },
];

export const allViews = viewOptions.map((option) => option.view);

export type StepLabels = {
  previous: string;
  next: string;
};

export const toolbarCopy = {
  today: "Today",
  viewGroup: "View",
};

export const stepLabels: Record<ViewKind, StepLabels> = {
  [ViewKind.Day]: { previous: "Previous day", next: "Next day" },
  [ViewKind.Week]: { previous: "Previous week", next: "Next week" },
  [ViewKind.Month]: { previous: "Previous month", next: "Next month" },
  [ViewKind.Year]: { previous: "Previous year", next: "Next year" },
  [ViewKind.Agenda]: { previous: "Earlier", next: "Later" },
};

export function isViewKind(value: unknown): value is ViewKind {
  return viewOptions.some((option) => option.view === value);
}
