import { UTCDate } from "@date-fns/utc/date";
import {
  addDays as addDaysTo,
  addMonths as addMonthsTo,
  addYears as addYearsTo,
  differenceInCalendarDays,
  formatISO,
  getDay,
  getDaysInMonth,
  startOfMonth as startOfMonthOf,
  startOfWeek as startOfWeekOf,
  type Day,
} from "date-fns";
import { Weekday, type DateRange, type PlainDate } from "../types";

const plainDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

export const weekdayNumbers: Record<Weekday, Day> = {
  [Weekday.Sunday]: 0,
  [Weekday.Monday]: 1,
  [Weekday.Tuesday]: 2,
  [Weekday.Wednesday]: 3,
  [Weekday.Thursday]: 4,
  [Weekday.Friday]: 5,
  [Weekday.Saturday]: 6,
};

export const weekdayOrder: readonly Weekday[] = [
  Weekday.Sunday,
  Weekday.Monday,
  Weekday.Tuesday,
  Weekday.Wednesday,
  Weekday.Thursday,
  Weekday.Friday,
  Weekday.Saturday,
];

function parsePlainDate(value: string): UTCDate | null {
  const parts = plainDatePattern.exec(value);
  if (parts === null) {
    return null;
  }
  const [, year, month, day] = parts.map(Number);
  const date = new UTCDate(Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 1));
  const isSameDay = date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month && date.getUTCDate() === day;
  return isSameDay ? date : null;
}

export function isPlainDate(value: string): boolean {
  return parsePlainDate(value) !== null;
}

export function toUtcDate(date: PlainDate): Date {
  const parsed = parsePlainDate(date);
  if (parsed === null) {
    throw new RangeError(`Invalid plain date: ${date}`);
  }
  return parsed;
}

export function fromUtcDate(date: Date): PlainDate {
  return formatISO(date, { representation: "date" });
}

export function plainDateOf(year: number, month: number, day: number): PlainDate {
  return fromUtcDate(new UTCDate(year, month - 1, day));
}

export function addDays(date: PlainDate, days: number): PlainDate {
  return fromUtcDate(addDaysTo(toUtcDate(date), days));
}

export function addMonths(date: PlainDate, months: number): PlainDate {
  return fromUtcDate(addMonthsTo(toUtcDate(date), months));
}

export function addYears(date: PlainDate, years: number): PlainDate {
  return fromUtcDate(addYearsTo(toUtcDate(date), years));
}

export function daysBetween(start: PlainDate, end: PlainDate): number {
  return differenceInCalendarDays(toUtcDate(end), toUtcDate(start));
}

export function compareDates(first: PlainDate, second: PlainDate): number {
  return Math.sign(daysBetween(second, first));
}

export function weekdayOf(date: PlainDate): Weekday {
  return weekdayOrder[getDay(toUtcDate(date))] ?? Weekday.Sunday;
}

export function startOfWeek(date: PlainDate, weekStartsOn: Weekday): PlainDate {
  return fromUtcDate(startOfWeekOf(toUtcDate(date), { weekStartsOn: weekdayNumbers[weekStartsOn] }));
}

export function startOfMonth(date: PlainDate): PlainDate {
  return fromUtcDate(startOfMonthOf(toUtcDate(date)));
}

export function daysInMonth(year: number, month: number): number {
  return getDaysInMonth(new UTCDate(year, month - 1, 1));
}

export function eachDate(range: DateRange): PlainDate[] {
  const length = Math.max(0, daysBetween(range.start, range.end));
  return Array.from({ length }, (_, index) => addDays(range.start, index));
}
