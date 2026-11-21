import { milliseconds, minutes, offsetMinutesAt, parseClockTime, toInstant } from "../time";
import type { ClockRange, DaySpan, HourMark, Instant, TimedOccurrence } from "../types";

export type MinuteRange = {
  startMinute: number;
  endMinute: number;
};

export type HourFold = {
  earlierCount: number;
  earliestMinute: number | null;
  laterCount: number;
  latestMinute: number | null;
};

type ZonedInstant = {
  instant: Instant;
  offsetMinutes: number;
};

function elapsedMinutes(day: DaySpan, instant: Instant): number {
  return (instant - day.start) / milliseconds.minute;
}

function clampToDay(day: DaySpan, minute: number): number {
  return Math.min(day.minutes, Math.max(0, minute));
}

function zonedAt(instant: Instant, timeZone: string): ZonedInstant {
  return { instant, offsetMinutes: offsetMinutesAt(instant, timeZone) };
}

function wallMinuteOf(zoned: ZonedInstant): number {
  const localMinutes = zoned.instant / milliseconds.minute + zoned.offsetMinutes;
  return ((localMinutes % minutes.day) + minutes.day) % minutes.day;
}

function nextWholeHour(previous: ZonedInstant, timeZone: string): ZonedInstant {
  const next = zonedAt(previous.instant + milliseconds.hour, timeZone);
  const pastHour = wallMinuteOf(next) % minutes.hour;
  const isWholeHour = pastHour === 0;
  if (isWholeHour) {
    return next;
  }
  const back = zonedAt(next.instant - pastHour * milliseconds.minute, timeZone);
  const isBackOnHour = back.offsetMinutes === next.offsetMinutes;
  if (isBackOnHour) {
    return back;
  }
  return { instant: back.instant + milliseconds.hour, offsetMinutes: next.offsetMinutes };
}

function isRepeated(zoned: ZonedInstant, previousOffset: number, timeZone: string): boolean {
  const dropMinutes = previousOffset - zoned.offsetMinutes;
  const hasDropped = dropMinutes > 0;
  if (!hasDropped) {
    return false;
  }
  return offsetMinutesAt(zoned.instant - dropMinutes * milliseconds.minute, timeZone) === previousOffset;
}

function hourMarkAt(zoned: ZonedInstant, previousOffset: number, day: DaySpan, timeZone: string): HourMark {
  return {
    instant: zoned.instant,
    minute: elapsedMinutes(day, zoned.instant),
    wallMinute: wallMinuteOf(zoned),
    offsetMinutes: zoned.offsetMinutes,
    repeated: isRepeated(zoned, previousOffset, timeZone),
    afterGap: zoned.offsetMinutes > previousOffset,
  };
}

export function hourMarks(day: DaySpan, timeZone: string): HourMark[] {
  const marks: HourMark[] = [];
  let previousOffset = offsetMinutesAt(day.start - milliseconds.hour, timeZone);
  for (let zoned = zonedAt(day.start, timeZone); zoned.instant < day.end; zoned = nextWholeHour(zoned, timeZone)) {
    marks.push(hourMarkAt(zoned, previousOffset, day, timeZone));
    previousOffset = zoned.offsetMinutes;
  }
  return marks;
}

function minuteOfClock(day: DaySpan, minuteOfDay: number, timeZone: string): number {
  const instant = toInstant({ date: day.date, minute: minuteOfDay }, timeZone);
  return clampToDay(day, elapsedMinutes(day, instant));
}

export function workingMinutes(day: DaySpan, hours: ClockRange, timeZone: string): MinuteRange {
  const start = parseClockTime(hours.start);
  const end = parseClockTime(hours.end);
  const isForward = end > start;
  if (!isForward) {
    throw new RangeError(`Clock range must end after it starts: ${hours.start} to ${hours.end}`);
  }
  return {
    startMinute: minuteOfClock(day, start, timeZone),
    endMinute: minuteOfClock(day, end, timeZone),
  };
}

function occurrenceMinutes(day: DaySpan, occurrence: TimedOccurrence): MinuteRange {
  return {
    startMinute: clampToDay(day, elapsedMinutes(day, occurrence.start)),
    endMinute: clampToDay(day, elapsedMinutes(day, occurrence.end)),
  };
}

function isInDay(day: DaySpan, occurrence: TimedOccurrence): boolean {
  const isMarker = occurrence.end === occurrence.start;
  const reachesDay = isMarker ? occurrence.start >= day.start : occurrence.end > day.start;
  return occurrence.start < day.end && reachesDay;
}

export function foldHours(day: DaySpan, shown: ClockRange, occurrences: TimedOccurrence[], timeZone: string): HourFold {
  const visible = workingMinutes(day, shown, timeZone);
  const spans = occurrences
    .filter((occurrence) => isInDay(day, occurrence))
    .map((occurrence) => occurrenceMinutes(day, occurrence));
  const earlier = spans.filter((span) => span.startMinute < visible.startMinute);
  const later = spans.filter((span) => span.endMinute > visible.endMinute);
  const hasEarlier = earlier.length > 0;
  const hasLater = later.length > 0;
  return {
    earlierCount: earlier.length,
    earliestMinute: hasEarlier ? Math.min(...earlier.map((span) => span.startMinute)) : null,
    laterCount: later.length,
    latestMinute: hasLater ? Math.max(...later.map((span) => span.endMinute)) : null,
  };
}
