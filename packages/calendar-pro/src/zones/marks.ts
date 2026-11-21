import { daysBetween, milliseconds, minutes, offsetMinutesAt, toWallClock } from "@cutecode/calendar/time";
import type { DaySpan, Instant, SecondaryZoneProvider, ZoneMark } from "@cutecode/calendar/types";

function zoneMarkAt(instant: Instant, day: DaySpan, timeZone: string): ZoneMark {
  const wallClock = toWallClock(instant, timeZone);
  return {
    minute: (instant - day.start) / milliseconds.minute,
    date: wallClock.date,
    wallMinute: wallClock.minute,
    offsetMinutes: offsetMinutesAt(instant, timeZone),
    dayShift: daysBetween(day.date, wallClock.date),
  };
}

export const secondaryZoneMarks: SecondaryZoneProvider = (day, timeZone) => {
  const count = Math.ceil(day.minutes / minutes.hour);
  return Array.from({ length: count }, (_, index) => zoneMarkAt(day.start + index * milliseconds.hour, day, timeZone));
};
