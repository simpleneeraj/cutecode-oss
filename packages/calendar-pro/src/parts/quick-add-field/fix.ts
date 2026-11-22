import { formatPlainDate } from "@cutecode/calendar/locale";
import { addDays, dateOf, milliseconds, minutes, parseDateTime, toUtcDate, toWallClock } from "@cutecode/calendar/time";
import {
  QuickAddField,
  type EventDraft,
  type PlainDate,
  type QuickAddResult,
  type TextSpan,
  type ViewSettings,
} from "@cutecode/calendar/types";

export enum FixKind {
  Choice = "choice",
  Text = "text",
}

export type EditedChip = {
  key: string;
  field: QuickAddField;
  label: string;
  span: TextSpan;
  isMissing: boolean;
};

export const fixCopy = {
  fields: {
    [QuickAddField.Title]: "Title",
    [QuickAddField.Day]: "Day",
    [QuickAddField.Time]: "Time",
    [QuickAddField.Duration]: "Length",
    [QuickAddField.Repeat]: "Repeat",
    [QuickAddField.With]: "With",
    [QuickAddField.Where]: "Where",
  },
  allDay: "All day",
  today: "Today",
  tomorrow: "Tomorrow",
};

const choiceFields = new Set([QuickAddField.Day, QuickAddField.Time, QuickAddField.Duration, QuickAddField.Repeat]);

const phraseFormats = {
  date: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
};

export function fixKindOf(field: QuickAddField): FixKind {
  return choiceFields.has(field) ? FixKind.Choice : FixKind.Text;
}

export function replaceSpan(text: string, span: TextSpan, phrase: string): string {
  const parts = [text.slice(0, span.start).trimEnd(), phrase.trim(), text.slice(span.end).trimStart()];
  return parts.filter((part) => part !== "").join(" ");
}

export function draftDateOf(draft: EventDraft): PlainDate {
  return draft.allDay ? draft.start : dateOf(parseDateTime(draft.start, draft.timeZone), draft.timeZone);
}

export function startMinuteOf(draft: EventDraft): number | null {
  if (draft.allDay) {
    return null;
  }
  return toWallClock(parseDateTime(draft.start, draft.timeZone), draft.timeZone).minute;
}

export function lengthMinutesOf(draft: EventDraft): number | null {
  if (draft.allDay) {
    return null;
  }
  const length = parseDateTime(draft.end, draft.timeZone) - parseDateTime(draft.start, draft.timeZone);
  return Math.round(length / milliseconds.minute);
}

export function datePhrase(date: PlainDate, today: PlainDate): string {
  if (date === today) {
    return "today";
  }
  if (date === addDays(today, 1)) {
    return "tomorrow";
  }
  return phraseFormats.date.format(toUtcDate(date));
}

export function timePhrase(minuteOfDay: number): string {
  const hour = Math.floor(minuteOfDay / minutes.hour);
  const minute = minuteOfDay % minutes.hour;
  const suffix = hour < 12 ? "am" : "pm";
  const clockHour = hour % 12 === 0 ? 12 : hour % 12;
  const clockMinute = minute === 0 ? "" : `:${String(minute).padStart(2, "0")}`;
  return `${clockHour}${clockMinute}${suffix}`;
}

export function durationPhrase(totalMinutes: number): string {
  const isWholeHours = totalMinutes % minutes.hour === 0;
  if (!isWholeHours) {
    return `for ${totalMinutes} min`;
  }
  const hours = totalMinutes / minutes.hour;
  return hours === 1 ? "for 1 hour" : `for ${hours} hours`;
}

function capitalizedWords(value: string): string[] {
  return value
    .trim()
    .split(/\s+/)
    .filter((word) => word !== "")
    .map((word) => word.charAt(0).toLocaleUpperCase("en-US") + word.slice(1));
}

function withPhrase(value: string): string {
  const names = value.split(/\s*(?:,|&|\band\b)\s*/i).map((name) => capitalizedWords(name).join(" "));
  const known = names.filter((name) => name !== "");
  return known.length === 0 ? "" : `with ${known.join(" and ")}`;
}

function wherePhrase(value: string): string {
  const words = capitalizedWords(value);
  return words.length === 0 ? "" : `at ${words.join(" ")}`;
}

export function textPhrase(field: QuickAddField, value: string): string {
  if (field === QuickAddField.With) {
    return withPhrase(value);
  }
  if (field === QuickAddField.Where) {
    return wherePhrase(value);
  }
  return value.trim().replace(/\s+/g, " ");
}

function missingChips(result: QuickAddResult, text: string, settings: ViewSettings): EditedChip[] {
  const { draft } = result;
  if (draft === null) {
    return [];
  }
  const end = { start: text.length, end: text.length };
  const dayLabel = formatPlainDate(draftDateOf(draft), settings, { weekday: "short", month: "short", day: "numeric" });
  const missing = [
    { field: QuickAddField.Day, label: dayLabel },
    { field: QuickAddField.Time, label: fixCopy.allDay },
  ];
  return missing
    .filter((chip) => result.missing.includes(chip.field))
    .map((chip) => ({ ...chip, key: `missing-${chip.field}`, span: end, isMissing: true }));
}

export function editedChipsOf(result: QuickAddResult, text: string, settings: ViewSettings): EditedChip[] {
  const found = result.chips.map((chip, index) => {
    const repeats = result.chips.slice(0, index).filter((other) => other.field === chip.field).length;
    return { ...chip, key: `${chip.field}-${repeats}`, isMissing: false };
  });
  return [...found, ...missingChips(result, text, settings)];
}
