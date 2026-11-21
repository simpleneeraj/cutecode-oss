import { dateOf, minutes, milliseconds, offsetMinutesAt, parseClockTime, toUtcDate } from "../time";
import { HourCycle, type ClockTime, type Instant, type PlainDate, type ViewSettings } from "../types";

const formatCache = new Map<string, Intl.DateTimeFormat>();

const timeFormatCache = new Map<string, Intl.DateTimeFormat>();

const fallbackRangeSeparator = " – ";

const narrowSpaces = /[\u202f\u2009]/g;

function withPlainSpaces(label: string): string {
  return label.replace(narrowSpaces, " ");
}

export function dateTimeFormat(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale}|${JSON.stringify(options)}`;
  const cached = formatCache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const created = new Intl.DateTimeFormat(locale, options);
  formatCache.set(key, created);
  return created;
}

function hasMinutes(instant: Instant, timeZone: string): boolean {
  const localMinute = Math.floor(instant / milliseconds.minute) + offsetMinutesAt(instant, timeZone);
  return localMinute % minutes.hour !== 0;
}

function createTimeFormat(settings: ViewSettings, timeZone: string, showMinutes: boolean): Intl.DateTimeFormat {
  const isTwentyFour = settings.hourCycle === HourCycle.TwentyFour;
  const hour = isTwentyFour ? "2-digit" : "numeric";
  const minute = showMinutes || isTwentyFour ? "2-digit" : undefined;
  return new Intl.DateTimeFormat(settings.locale, { hour, minute, hourCycle: settings.hourCycle, timeZone });
}

function timeFormat(settings: ViewSettings, timeZone: string, showMinutes: boolean): Intl.DateTimeFormat {
  const key = `${settings.locale}|${timeZone}|${settings.hourCycle}|${showMinutes}`;
  const cached = timeFormatCache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const created = createTimeFormat(settings, timeZone, showMinutes);
  timeFormatCache.set(key, created);
  return created;
}

function rangeSeparator(format: Intl.DateTimeFormat, start: Instant, end: Instant): string {
  const separator = format.formatRangeToParts(start, end).find((part) => part.source === "shared");
  return separator?.value ?? fallbackRangeSeparator;
}

export function formatTime(instant: Instant, settings: ViewSettings): string {
  return withPlainSpaces(
    timeFormat(settings, settings.timeZone, hasMinutes(instant, settings.timeZone)).format(instant),
  );
}

export function formatTimeRange(start: Instant, end: Instant, settings: ViewSettings): string {
  const showMinutes = hasMinutes(start, settings.timeZone) || hasMinutes(end, settings.timeZone);
  const format = timeFormat(settings, settings.timeZone, showMinutes);
  const isSameDate = dateOf(start, settings.timeZone) === dateOf(end, settings.timeZone);
  if (isSameDate) {
    return withPlainSpaces(format.formatRange(start, end));
  }
  const separator = rangeSeparator(format, start, end);
  return withPlainSpaces(`${format.format(start)}${separator}${format.format(end)}`);
}

export function formatClock(clock: ClockTime, settings: ViewSettings): string {
  const minuteOfDay = parseClockTime(clock);
  const instant = minuteOfDay * milliseconds.minute;
  return withPlainSpaces(timeFormat(settings, "UTC", minuteOfDay % minutes.hour !== 0).format(instant));
}

export function formatPlainDate(date: PlainDate, settings: ViewSettings, options: Intl.DateTimeFormatOptions): string {
  return dateTimeFormat(settings.locale, { ...options, timeZone: "UTC" }).format(toUtcDate(date));
}

export function formatDayLabel(date: PlainDate, settings: ViewSettings): string {
  return formatPlainDate(date, settings, { weekday: "long", month: "long", day: "numeric" });
}

export function formatZoneName(instant: Instant, settings: ViewSettings): string {
  const format = dateTimeFormat(settings.locale, { timeZoneName: "short", timeZone: settings.timeZone });
  const zonePart = format.formatToParts(instant).find((part) => part.type === "timeZoneName");
  return zonePart?.value ?? settings.timeZone;
}
