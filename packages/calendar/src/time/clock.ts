import type { ClockRange, ClockTime, InstantRange } from "../types";
import { daysBetween } from "./plain-date";
import { minutes } from "./units";
import { toWallClock } from "./zone";

const clockTimePattern = /^(\d{2}):(\d{2})$/;

export function parseClockTime(value: ClockTime): number {
  const match = clockTimePattern.exec(value);
  const hour = Number(match?.[1]);
  const minute = Number(match?.[2]);
  const total = hour * minutes.hour + minute;
  const isValid = match !== null && minute < minutes.hour && total <= minutes.day;
  if (!isValid) {
    throw new RangeError(`Invalid clock time: ${value}`);
  }
  return total;
}

export function formatClockTime(minuteOfDay: number): ClockTime {
  const hour = Math.floor(minuteOfDay / minutes.hour);
  const minute = minuteOfDay % minutes.hour;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function isWithinClockRange(range: InstantRange, hours: ClockRange, timeZone: string): boolean {
  const start = toWallClock(range.start, timeZone);
  const end = toWallClock(range.end, timeZone);
  const endMinute = daysBetween(start.date, end.date) * minutes.day + end.minute;
  const open = parseClockTime(hours.start);
  const close = parseClockTime(hours.end);
  const isOvernight = close < open;
  if (!isOvernight) {
    return start.minute >= open && endMinute <= close;
  }
  const fitsEvening = start.minute >= open && endMinute <= close + minutes.day;
  const fitsMorning = endMinute <= close;
  return fitsEvening || fitsMorning;
}
