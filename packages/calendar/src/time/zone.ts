import { tzOffset } from "@date-fns/tz/tzOffset";
import { tzScan } from "@date-fns/tz/tzScan";
import { UTCDate } from "@date-fns/utc/date";
import type { DaySpan, Instant, InstantRange, PlainDate, WallClock } from "../types";
import { addDays, fromUtcDate, toUtcDate } from "./plain-date";
import { milliseconds, minutes } from "./units";

export type ZoneTransition = {
  instant: Instant;
  changeMinutes: number;
  offsetMinutes: number;
};

export function isTimeZone(value: string): boolean {
  return Number.isFinite(tzOffset(value, new Date(0)));
}

export function offsetMinutesAt(instant: Instant, timeZone: string): number {
  return tzOffset(timeZone, new Date(instant));
}

export function toWallClock(instant: Instant, timeZone: string): WallClock {
  const shifted = new UTCDate(instant + offsetMinutesAt(instant, timeZone) * milliseconds.minute);
  return {
    date: fromUtcDate(shifted),
    minute: shifted.getUTCHours() * minutes.hour + shifted.getUTCMinutes(),
  };
}

function isOffsetAt(instant: Instant, offsetMinutes: number, timeZone: string): boolean {
  return offsetMinutesAt(instant, timeZone) === offsetMinutes;
}

export function toInstant(wallClock: WallClock, timeZone: string): Instant {
  const local = toUtcDate(wallClock.date).getTime() + wallClock.minute * milliseconds.minute;
  const offsetBefore = offsetMinutesAt(local - milliseconds.day, timeZone);
  const offsetAfter = offsetMinutesAt(local + milliseconds.day, timeZone);
  const withOffsetBefore = local - offsetBefore * milliseconds.minute;
  const withOffsetAfter = local - offsetAfter * milliseconds.minute;
  if (isOffsetAt(withOffsetBefore, offsetBefore, timeZone)) {
    return withOffsetBefore;
  }
  if (isOffsetAt(withOffsetAfter, offsetAfter, timeZone)) {
    return withOffsetAfter;
  }
  return withOffsetBefore;
}

export function startOfDay(date: PlainDate, timeZone: string): Instant {
  return toInstant({ date, minute: 0 }, timeZone);
}

export function daySpan(date: PlainDate, timeZone: string): DaySpan {
  const start = startOfDay(date, timeZone);
  const end = startOfDay(addDays(date, 1), timeZone);
  return { date, start, end, minutes: (end - start) / milliseconds.minute };
}

export function dateOf(instant: Instant, timeZone: string): PlainDate {
  return toWallClock(instant, timeZone).date;
}

function firstMinuteAt(offsetMinutes: number, before: Instant, after: Instant, timeZone: string): Instant {
  let low = before;
  let high = after;
  while (high - low > milliseconds.minute) {
    const middle = low + Math.floor((high - low) / 2 / milliseconds.minute) * milliseconds.minute;
    const isChanged = offsetMinutesAt(middle, timeZone) === offsetMinutes;
    if (isChanged) {
      high = middle;
    } else {
      low = middle;
    }
  }
  return high;
}

export function zoneTransitions(range: InstantRange, timeZone: string): ZoneTransition[] {
  const before = new Date(range.start - milliseconds.hour);
  const monthStart = Date.UTC(before.getUTCFullYear(), before.getUTCMonth(), 1);
  return tzScan(timeZone, { start: new Date(monthStart), end: new Date(range.end) })
    .map((change) => {
      const found = change.date.getTime();
      return {
        instant: firstMinuteAt(change.offset, found - milliseconds.hour, found, timeZone),
        changeMinutes: change.change,
        offsetMinutes: change.offset,
      };
    })
    .filter((transition) => transition.instant >= range.start && transition.instant < range.end);
}
