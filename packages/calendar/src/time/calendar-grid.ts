import { daysInWeek } from "date-fns/constants";
import type { PlainDate, Weekday } from "../types";
import { addDays, addMonths, daysBetween, startOfMonth, startOfWeek } from "./plain-date";

export function weekDates(date: PlainDate, weekStartsOn: Weekday): PlainDate[] {
  const first = startOfWeek(date, weekStartsOn);
  return Array.from({ length: daysInWeek }, (_, index) => addDays(first, index));
}

export function monthWeeks(date: PlainDate, weekStartsOn: Weekday): PlainDate[][] {
  const first = startOfWeek(startOfMonth(date), weekStartsOn);
  const nextMonth = addMonths(startOfMonth(date), 1);
  const rowCount = Math.ceil(daysBetween(first, nextMonth) / daysInWeek);
  return Array.from({ length: rowCount }, (_, row) => weekDates(addDays(first, row * daysInWeek), weekStartsOn));
}
