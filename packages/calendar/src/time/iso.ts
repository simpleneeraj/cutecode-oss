import { TZDate } from "@date-fns/tz/date";
import { utc } from "@date-fns/utc/utc";
import { formatISO, isValid, parseISO } from "date-fns";
import type { Instant, IsoDateTime } from "../types";
import { fromUtcDate } from "./plain-date";
import { milliseconds, minutes } from "./units";
import { toInstant } from "./zone";

const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

const offsetPattern = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i;

function floatingInstant(value: string, timeZone: string): Instant {
  const local = parseISO(value, { in: utc });
  const leftover = local.getTime() % milliseconds.minute;
  const minute = local.getUTCHours() * minutes.hour + local.getUTCMinutes();
  return toInstant({ date: fromUtcDate(local), minute }, timeZone) + leftover;
}

function parseIn(value: string, timeZone: string): Instant {
  const hasOffset = offsetPattern.test(value);
  if (hasOffset) {
    return parseISO(value).getTime();
  }
  return floatingInstant(value, timeZone);
}

export function isDateTime(value: string): boolean {
  return dateTimePattern.test(value) && isValid(parseISO(value));
}

export function parseDateTime(value: IsoDateTime, timeZone: string): Instant {
  const isReadable = isDateTime(value);
  if (!isReadable) {
    throw new RangeError(`Invalid date time: ${value}`);
  }
  return parseIn(value, timeZone);
}

export function formatDateTime(instant: Instant, timeZone: string): IsoDateTime {
  return formatISO(new TZDate(instant, timeZone));
}
