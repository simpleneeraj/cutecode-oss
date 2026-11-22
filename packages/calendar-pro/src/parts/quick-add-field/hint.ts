import { formatPlainDate } from "@cutecode/calendar/locale";
import { QuickAddField, type QuickAddResult, type ViewSettings } from "@cutecode/calendar/types";

import { draftDateOf } from "./fix";

export enum HintKind {
  Example = "example",
  Loading = "loading",
  Failed = "failed",
  MissingTitle = "missing-title",
  MissingDayAndTime = "missing-day-and-time",
  MissingTime = "missing-time",
  MissingDay = "missing-day",
  Ready = "ready",
}

export type Hint = {
  kind: HintKind;
  text: string;
};

export const hintCopy = {
  placeholder: "Lunch with Ana Fri 1pm",
  [HintKind.Example]: "Type it the way you say it, like Lunch with Ana Fri 1pm.",
  [HintKind.Loading]: "Getting ready to read it.",
  [HintKind.Failed]: "Could not read that just now. Keep typing to try again.",
  [HintKind.MissingTitle]: "Add a title, like Lunch or Gym.",
  [HintKind.MissingDayAndTime]: "No day or time yet. It goes on today as an all-day event.",
  [HintKind.MissingTime]: "No time found. It will be an all-day event.",
  missingDay: (day: string) => `No day found. It goes on ${day}.`,
  [HintKind.Ready]: "Press Return to add. Tap a chip to fix it.",
};

export type HintInput = {
  text: string;
  result: QuickAddResult | null;
  hasFailed: boolean;
  settings: ViewSettings;
};

function missingHint(result: QuickAddResult, settings: ViewSettings): Hint {
  const missing = new Set(result.missing);
  if (missing.has(QuickAddField.Title)) {
    return { kind: HintKind.MissingTitle, text: hintCopy[HintKind.MissingTitle] };
  }
  const isDayMissing = missing.has(QuickAddField.Day);
  if (isDayMissing && missing.has(QuickAddField.Time)) {
    return { kind: HintKind.MissingDayAndTime, text: hintCopy[HintKind.MissingDayAndTime] };
  }
  if (missing.has(QuickAddField.Time)) {
    return { kind: HintKind.MissingTime, text: hintCopy[HintKind.MissingTime] };
  }
  if (isDayMissing && result.draft !== null) {
    const day = formatPlainDate(draftDateOf(result.draft), settings, { weekday: "short", month: "short", day: "numeric" });
    return { kind: HintKind.MissingDay, text: hintCopy.missingDay(day) };
  }
  return { kind: HintKind.Ready, text: hintCopy[HintKind.Ready] };
}

export function hintOf({ text, result, hasFailed, settings }: HintInput): Hint {
  if (text.trim() === "") {
    return { kind: HintKind.Example, text: hintCopy[HintKind.Example] };
  }
  if (hasFailed) {
    return { kind: HintKind.Failed, text: hintCopy[HintKind.Failed] };
  }
  if (result === null) {
    return { kind: HintKind.Loading, text: hintCopy[HintKind.Loading] };
  }
  return missingHint(result, settings);
}
