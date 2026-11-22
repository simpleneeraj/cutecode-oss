import { formatPlainDate } from "@cutecode/calendar/locale";
import { dateOf, isPlainDate, parseDateTime, toUtcDate, weekdayOf } from "@cutecode/calendar/time";
import { Frequency, Weekday, type PlainDate, type Recurrence, type ViewSettings } from "@cutecode/calendar/types";

export enum RepeatPreset {
  Never = "never",
  Daily = "daily",
  Weekdays = "weekdays",
  Weekly = "weekly",
  Monthly = "monthly",
  Yearly = "yearly",
  Custom = "custom",
}

export const choosablePresets = [
  RepeatPreset.Never,
  RepeatPreset.Daily,
  RepeatPreset.Weekdays,
  RepeatPreset.Weekly,
  RepeatPreset.Monthly,
  RepeatPreset.Yearly,
];

const workWeek = [Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday, Weekday.Thursday, Weekday.Friday];

export const repeatCopy = {
  label: "Repeat",
  never: "Does not repeat",
  daily: "Every day",
  weekdays: "Every weekday",
  weekly: (weekday: string) => `Every week on ${weekday}`,
  monthly: (day: number) => `Every month on day ${day}`,
  yearly: (date: string) => `Every year on ${date}`,
  custom: "Custom repeat",
  series: "Repeats with its series",
};

export function startDateOf(start: string, timeZone: string): PlainDate {
  return isPlainDate(start) ? start : dateOf(parseDateTime(start, timeZone), timeZone);
}

function dayOfMonth(date: PlainDate): number {
  return toUtcDate(date).getUTCDate();
}

export function presetRecurrence(preset: RepeatPreset, date: PlainDate, weekStartsOn: Weekday): Recurrence | null {
  const base = { interval: 1, weekStartsOn };
  const recurrences: Record<RepeatPreset, Recurrence | null> = {
    [RepeatPreset.Never]: null,
    [RepeatPreset.Custom]: null,
    [RepeatPreset.Daily]: { ...base, frequency: Frequency.Daily },
    [RepeatPreset.Weekdays]: { ...base, frequency: Frequency.Weekly, byWeekday: workWeek },
    [RepeatPreset.Weekly]: { ...base, frequency: Frequency.Weekly, byWeekday: [weekdayOf(date)] },
    [RepeatPreset.Monthly]: { ...base, frequency: Frequency.Monthly, byMonthDay: [dayOfMonth(date)] },
    [RepeatPreset.Yearly]: { ...base, frequency: Frequency.Yearly },
  };
  return recurrences[preset];
}

export function mergedRecurrence(preset: Recurrence | null, current: Recurrence | null): Recurrence | null {
  if (preset === null || current === null) {
    return preset;
  }
  const { exceptionDates, until, count } = current;
  const isSameFrequency = preset.frequency === current.frequency;
  return { ...preset, exceptionDates, until, count: isSameFrequency ? count : undefined };
}

function isSameList<Item>(given: Item[] | undefined, expected: Item[]): boolean {
  const list = given ?? expected;
  return list.length === expected.length && list.every((item) => expected.includes(item));
}

function weeklyPreset(recurrence: Recurrence, date: PlainDate): RepeatPreset {
  const weekdays = recurrence.byWeekday;
  if (weekdays !== undefined && isSameList(weekdays, workWeek)) {
    return RepeatPreset.Weekdays;
  }
  return isSameList(weekdays, [weekdayOf(date)]) ? RepeatPreset.Weekly : RepeatPreset.Custom;
}

function isPlain(recurrence: Recurrence): boolean {
  const hasLimit = recurrence.count !== undefined || recurrence.until !== undefined;
  return recurrence.interval === 1 && !hasLimit && recurrence.bySetPosition === undefined;
}

export function presetOf(recurrence: Recurrence | null, date: PlainDate): RepeatPreset {
  if (recurrence === null) {
    return RepeatPreset.Never;
  }
  if (!isPlain(recurrence)) {
    return RepeatPreset.Custom;
  }
  const isMonthDay = isSameList(recurrence.byMonthDay, [dayOfMonth(date)]);
  const presets: Record<Frequency, RepeatPreset> = {
    [Frequency.Daily]: RepeatPreset.Daily,
    [Frequency.Weekly]: weeklyPreset(recurrence, date),
    [Frequency.Monthly]: isMonthDay ? RepeatPreset.Monthly : RepeatPreset.Custom,
    [Frequency.Yearly]: RepeatPreset.Yearly,
  };
  return presets[recurrence.frequency];
}

export function presetLabels(date: PlainDate, settings: ViewSettings): Record<RepeatPreset, string> {
  const weekday = formatPlainDate(date, settings, { weekday: "long" });
  const yearDay = formatPlainDate(date, settings, { month: "long", day: "numeric" });
  return {
    [RepeatPreset.Never]: repeatCopy.never,
    [RepeatPreset.Daily]: repeatCopy.daily,
    [RepeatPreset.Weekdays]: repeatCopy.weekdays,
    [RepeatPreset.Weekly]: repeatCopy.weekly(weekday),
    [RepeatPreset.Monthly]: repeatCopy.monthly(dayOfMonth(date)),
    [RepeatPreset.Yearly]: repeatCopy.yearly(yearDay),
    [RepeatPreset.Custom]: repeatCopy.custom,
  };
}
