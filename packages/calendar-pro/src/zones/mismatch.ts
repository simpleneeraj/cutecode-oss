import {
  isTimeZone,
  milliseconds,
  offsetMinutesAt,
  toInstant,
  toWallClock,
  zoneTransitions,
} from "@cutecode/calendar/time";
import type { Instant, WallClock } from "@cutecode/calendar/types";

export enum ZoneMismatchKind {
  None = "none",
  Offset = "offset",
}

export type ZoneMismatch = {
  kind: ZoneMismatchKind;
  deviceOffsetMinutes: number;
  calendarOffsetMinutes: number;
};

function checkedOffsetMinutes(timeZone: string, at: Instant): number {
  if (!isTimeZone(timeZone)) {
    throw new RangeError(`Invalid time zone: ${timeZone}`);
  }
  return offsetMinutesAt(at, timeZone);
}

const yearAhead = 366 * milliseconds.day;

function transitionKeys(timeZone: string, at: Instant): string {
  const transitions = zoneTransitions({ start: at, end: at + yearAhead }, timeZone);
  return transitions.map((transition) => `${transition.instant}:${transition.offsetMinutes}`).join(",");
}

export function zoneMismatch(deviceZone: string, calendarZone: string, at: Instant): ZoneMismatch {
  const deviceOffsetMinutes = checkedOffsetMinutes(deviceZone, at);
  const calendarOffsetMinutes = checkedOffsetMinutes(calendarZone, at);
  const isSameNow = deviceOffsetMinutes === calendarOffsetMinutes;
  const isSameAhead = transitionKeys(deviceZone, at) === transitionKeys(calendarZone, at);
  const kind = isSameNow && isSameAhead ? ZoneMismatchKind.None : ZoneMismatchKind.Offset;
  return { kind, deviceOffsetMinutes, calendarOffsetMinutes };
}

export function zoneLabel(timeZone: string, at: Instant, locale: string): string {
  const format = new Intl.DateTimeFormat(locale, { timeZone, timeZoneName: "shortOffset" });
  const zonePart = format.formatToParts(at).find((part) => part.type === "timeZoneName");
  return zonePart?.value ?? timeZone;
}

export function convertWallClock(wallClock: WallClock, fromZone: string, toZone: string): WallClock {
  return toWallClock(toInstant(wallClock, fromZone), toZone);
}
