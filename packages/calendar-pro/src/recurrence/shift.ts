import {
  addDays,
  daysBetween,
  daysInMonth,
  isPlainDate,
  minutes,
  startOfMonth,
  toUtcDate,
  weekdayOf,
  weekdayOrder,
} from "@cutecode/calendar/time";
import type { CalendarEvent, EventChange, PlainDate, Recurrence, WallClock, Weekday } from "@cutecode/calendar/types";
import { formatSlot, seriesSlotOf, wallClockOfValue } from "./rule";

type WallClockShift = {
  days: number;
  minutes: number;
};

export type RecurrenceMove = {
  shift: WallClockShift;
  from: PlainDate;
  to: PlainDate;
  allDay: boolean;
};

type WeekdayRule = Pick<Recurrence, "byWeekday" | "bySetPosition">;

type MonthDayOfDate = {
  day: number;
  length: number;
};

const monthDayLimit = 31;

function shiftBetween(from: WallClock, to: WallClock): WallClockShift {
  return { days: daysBetween(from.date, to.date), minutes: to.minute - from.minute };
}

function shiftWallClock(wallClock: WallClock, shift: WallClockShift): WallClock {
  const total = wallClock.minute + shift.minutes;
  const carryDays = Math.floor(total / minutes.day);
  return { date: addDays(wallClock.date, shift.days + carryDays), minute: total - carryDays * minutes.day };
}

export function shiftValue(value: string, series: CalendarEvent, shift: WallClockShift, allDay: boolean): string {
  return formatSlot(shiftWallClock(wallClockOfValue(value, series.timeZone), shift), allDay, series.timeZone);
}

function shiftWeekday(weekday: Weekday, days: number): Weekday {
  const index = weekdayOrder.indexOf(weekday) + days;
  const length = weekdayOrder.length;
  return weekdayOrder[((index % length) + length) % length] ?? weekday;
}

function shiftBoundary(value: string, series: CalendarEvent, move: RecurrenceMove): string {
  if (isPlainDate(value)) {
    return addDays(value, move.shift.days);
  }
  return shiftValue(value, series, move.shift, move.allDay);
}

function monthDayOfDate(date: PlainDate): MonthDayOfDate {
  const utc = toUtcDate(date);
  return { day: utc.getUTCDate(), length: daysInMonth(utc.getUTCFullYear(), utc.getUTCMonth() + 1) };
}

function crossesMonth(move: RecurrenceMove): boolean {
  return startOfMonth(move.from) !== startOfMonth(move.to);
}

function targetMonthDay(original: number, move: RecurrenceMove): number {
  const target = monthDayOfDate(move.to);
  const isLastDay = target.day === target.length;
  const crossed = crossesMonth(move);
  if (crossed && isLastDay) {
    return -1;
  }
  if (crossed || original > 0) {
    return target.day;
  }
  return target.day - target.length - 1;
}

function isMonthDay(value: number, countsFromStart: boolean): boolean {
  if (countsFromStart) {
    return value >= 1 && value <= monthDayLimit;
  }
  return value <= -1 && value >= -monthDayLimit;
}

function shiftMonthDays(days: number[], move: RecurrenceMove): number[] | undefined {
  const [only] = days;
  if (move.shift.days === 0) {
    return days;
  }
  if (days.length === 1 && only !== undefined) {
    return [targetMonthDay(only, move)];
  }
  const fitsMonth = days.every((day) => isMonthDay(day + move.shift.days, day > 0));
  if (crossesMonth(move) || !fitsMonth) {
    return undefined;
  }
  return days.map((day) => day + move.shift.days);
}

function setPositionOf(date: PlainDate, original: number): number {
  const target = monthDayOfDate(date);
  const nth = Math.floor((target.day - 1) / 7) + 1;
  const isLastOfMonth = target.day + 7 > target.length;
  const prefersLast = original < 0 || nth === 5;
  if (isLastOfMonth && prefersLast) {
    return -1;
  }
  return nth;
}

function shiftWeekdays(recurrence: Recurrence, move: RecurrenceMove): WeekdayRule | undefined {
  const { byWeekday, bySetPosition } = recurrence;
  if (byWeekday === undefined || move.shift.days === 0) {
    return { byWeekday, bySetPosition };
  }
  if (bySetPosition === undefined) {
    return { byWeekday: byWeekday.map((weekday) => shiftWeekday(weekday, move.shift.days)), bySetPosition };
  }
  if (byWeekday.length > 1) {
    return undefined;
  }
  return { byWeekday: [weekdayOf(move.to)], bySetPosition: setPositionOf(move.to, bySetPosition) };
}

export function shiftRecurrence(
  recurrence: Recurrence,
  series: CalendarEvent,
  move: RecurrenceMove,
): Recurrence | undefined {
  const weekdays = shiftWeekdays(recurrence, move);
  const byMonthDay = recurrence.byMonthDay === undefined ? undefined : shiftMonthDays(recurrence.byMonthDay, move);
  const lostMonthDays = recurrence.byMonthDay !== undefined && byMonthDay === undefined;
  if (weekdays === undefined || lostMonthDays) {
    return undefined;
  }
  return {
    ...recurrence,
    ...weekdays,
    byMonthDay,
    until: recurrence.until === undefined ? undefined : shiftBoundary(recurrence.until, series, move),
    exceptionDates: recurrence.exceptionDates?.map((value) => shiftBoundary(value, series, move)),
  };
}

export function moveOf(series: CalendarEvent, change: EventChange): RecurrenceMove {
  const from = seriesSlotOf(change.originalStart, series);
  const to = wallClockOfValue(change.start, series.timeZone);
  return { shift: shiftBetween(from, to), from: from.date, to: to.date, allDay: change.allDay };
}
