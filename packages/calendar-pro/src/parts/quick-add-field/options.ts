import { formatClock, formatPlainDate } from "@cutecode/calendar/locale";
import { addDays, formatClockTime, minutes } from "@cutecode/calendar/time";
import {
  QuickAddField,
  type EventDraft,
  type PlainDate,
  type QuickAddChip,
  type ViewSettings,
} from "@cutecode/calendar/types";

import { durationLabel } from "../../quick-add/chips";
import { RepeatPreset, choosablePresets, presetLabels, presetOf } from "../repeat-field/presets";
import { datePhrase, draftDateOf, durationPhrase, fixCopy, lengthMinutesOf, startMinuteOf, timePhrase } from "./fix";

export type FixOption = {
  key: string;
  label: string;
  phrase: string;
};

export type FixContext = {
  draft: EventDraft;
  chips: QuickAddChip[];
  settings: ViewSettings;
  today: PlainDate;
};

export const fixRanges = {
  days: 14,
  firstMinute: 6 * minutes.hour,
  lastMinute: 22 * minutes.hour,
  timeStep: 30,
  durations: [15, 30, 45, 60, 90, 120],
};

const repeatPhrases: Record<RepeatPreset, string> = {
  [RepeatPreset.Never]: "",
  [RepeatPreset.Daily]: "every day",
  [RepeatPreset.Weekdays]: "every weekday",
  [RepeatPreset.Weekly]: "every week",
  [RepeatPreset.Monthly]: "every month",
  [RepeatPreset.Yearly]: "every year",
  [RepeatPreset.Custom]: "",
};

function dayLabel(date: PlainDate, index: number, settings: ViewSettings): string {
  const names = [fixCopy.today, fixCopy.tomorrow];
  return names[index] ?? formatPlainDate(date, settings, { weekday: "short", month: "short", day: "numeric" });
}

function dayOptions({ draft, chips, settings, today }: FixContext): FixOption[] {
  const hasTimeChip = chips.some((chip) => chip.field === QuickAddField.Time);
  const minute = startMinuteOf(draft);
  const timeSuffix = hasTimeChip || minute === null ? "" : ` ${timePhrase(minute)}`;
  return Array.from({ length: fixRanges.days }, (_, index) => {
    const date = addDays(today, index);
    return { key: date, label: dayLabel(date, index, settings), phrase: `${datePhrase(date, today)}${timeSuffix}` };
  });
}

function timeOptions({ settings }: FixContext): FixOption[] {
  const count = (fixRanges.lastMinute - fixRanges.firstMinute) / fixRanges.timeStep + 1;
  return Array.from({ length: count }, (_, index) => {
    const minute = fixRanges.firstMinute + index * fixRanges.timeStep;
    return { key: String(minute), label: formatClock(formatClockTime(minute), settings), phrase: timePhrase(minute) };
  });
}

function durationOptions({ settings }: FixContext): FixOption[] {
  return fixRanges.durations.map((length) => ({
    key: String(length),
    label: durationLabel(length, settings.locale),
    phrase: durationPhrase(length),
  }));
}

function repeatOptions({ draft, settings }: FixContext): FixOption[] {
  const labels = presetLabels(draftDateOf(draft), settings);
  return choosablePresets.map((preset) => ({ key: preset, label: labels[preset], phrase: repeatPhrases[preset] }));
}

const optionBuilders: Partial<Record<QuickAddField, (context: FixContext) => FixOption[]>> = {
  [QuickAddField.Day]: dayOptions,
  [QuickAddField.Time]: timeOptions,
  [QuickAddField.Duration]: durationOptions,
  [QuickAddField.Repeat]: repeatOptions,
};

export function choiceOptions(field: QuickAddField, context: FixContext): FixOption[] {
  return optionBuilders[field]?.(context) ?? [];
}

function keyOf(value: number | null): string | null {
  return value === null ? null : String(value);
}

export function currentKeyOf(field: QuickAddField, draft: EventDraft): string | null {
  const keys: Partial<Record<QuickAddField, () => string | null>> = {
    [QuickAddField.Day]: () => draftDateOf(draft),
    [QuickAddField.Time]: () => keyOf(startMinuteOf(draft)),
    [QuickAddField.Duration]: () => keyOf(lengthMinutesOf(draft)),
    [QuickAddField.Repeat]: () => presetOf(draft.recurrence ?? null, draftDateOf(draft)),
  };
  return keys[field]?.() ?? null;
}
