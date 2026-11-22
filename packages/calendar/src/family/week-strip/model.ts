import { weekInfo } from "../../locale";
import { daysBetween, plainDateOf, startOfWeek, toUtcDate, weekdayOf } from "../../time";
import { Weekday, type PlainDate, type ViewSettings } from "../../types";
import type { WeekStripDay } from "../../widgets";

export enum WeekStripLook {
  Soft = "soft",
  Island = "island",
}

export type StripDay = WeekStripDay & {
  locked: boolean;
  weekend: boolean;
};

export const weekStripCopy = {
  week: (count: number) => `Week ${count}`,
};

const weekLength = 7;
const isoMinimalDays = 4;
const firstWeekMinimalDays = 1;

function yearOf(date: PlainDate): number {
  return toUtcDate(date).getUTCFullYear();
}

function firstWeekStart(year: number, weekStartsOn: Weekday): PlainDate {
  const minimalDays = weekStartsOn === Weekday.Monday ? isoMinimalDays : firstWeekMinimalDays;
  return startOfWeek(plainDateOf(year, 1, minimalDays), weekStartsOn);
}

export function weekNumber(date: PlainDate, weekStartsOn: Weekday): number {
  const start = startOfWeek(date, weekStartsOn);
  const year = yearOf(date);
  const years = [year + 1, year, year - 1];
  const first = years
    .map((candidate) => firstWeekStart(candidate, weekStartsOn))
    .find((candidate) => daysBetween(candidate, start) >= 0);
  return Math.floor(daysBetween(first ?? start, start) / weekLength) + 1;
}

export function stripDays(
  days: WeekStripDay[],
  value: PlainDate,
  settings: ViewSettings,
  isPastLocked: boolean,
): StripDay[] {
  const weekend = weekInfo(settings.locale).weekend;
  return days.map((day) => ({
    ...day,
    selected: day.date === value,
    locked: isPastLocked && day.past,
    weekend: weekend.includes(weekdayOf(day.date)),
  }));
}
