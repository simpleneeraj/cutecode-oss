import {
  calendarOf,
  hiddenCalendarIdsOf,
  isOnHiddenCalendar,
  occurrenceInterval,
  occurrencesInRange,
  overlapsRange,
} from "../../../event";
import { formatPlainDate, formatTime, formatTimeRange } from "../../../locale";
import type { CalendarData } from "../../../parts/time-grid/props";
import { addDays, dateOf, daySpan, milliseconds, minutes, startOfDay } from "../../../time";
import {
  CalendarTone,
  EventStatus,
  OccurrenceKind,
  type DateRange,
  type EventOccurrence,
  type Instant,
  type PlainDate,
  type ViewSettings,
} from "../../../types";
import { dayStatus, DayStatus, upNext } from "../../../widgets";

export type WidgetLine = {
  key: string;
  title: string;
  detail: string;
  tone: CalendarTone;
};

export type WidgetDay = {
  today: PlainDate;
  status: DayStatus;
  plannedCount: number;
  upcoming: EventOccurrence[];
  tomorrow: EventOccurrence | undefined;
};

export const widgetCopy = {
  allDay: "All day",
  upcoming: "Upcoming",
  upNext: "Up next",
  now: "Now",
  tomorrow: "Tomorrow",
  dayDone: "No more events today",
  nothingPlanned: "Nothing planned today",
  loading: "Loading your calendar",
  events: (count: number) => (count === 1 ? "1 event" : `${count} events`),
  today: (count: number) => `${count} today`,
  more: (count: number) => `+${count} more today`,
  atPlace: (time: string, place: string) => `${time}, ${place}`,
};

export function shownOccurrences(data: CalendarData, dates: DateRange, timeZone: string): EventOccurrence[] {
  const range = { start: startOfDay(dates.start, timeZone), end: startOfDay(dates.end, timeZone) };
  const hidden = hiddenCalendarIdsOf(data.calendars);
  return occurrencesInRange(data.events, { range, dates, timeZone }, data.expand).filter(
    (occurrence) => !isOnHiddenCalendar(occurrence.event, hidden),
  );
}

function isOnDay(occurrence: EventOccurrence, date: PlainDate, timeZone: string): boolean {
  return overlapsRange(occurrenceInterval(occurrence, timeZone), daySpan(date, timeZone));
}

function isPlanned(occurrence: EventOccurrence): boolean {
  return occurrence.event.status !== EventStatus.Cancelled;
}

export function widgetDay(data: CalendarData, now: Instant, timeZone: string): WidgetDay {
  const today = dateOf(now, timeZone);
  const tomorrow = addDays(today, 1);
  const occurrences = shownOccurrences(data, { start: today, end: addDays(today, 2) }, timeZone).filter(isPlanned);
  const onToday = occurrences.filter((occurrence) => isOnDay(occurrence, today, timeZone));
  const onTomorrow = occurrences.filter((occurrence) => isOnDay(occurrence, tomorrow, timeZone));
  return {
    today,
    status: dayStatus(onToday, today, now, timeZone),
    plannedCount: onToday.length,
    upcoming: upNext(onToday, now, onToday.length, timeZone),
    tomorrow: upNext(onTomorrow, startOfDay(tomorrow, timeZone), 1, timeZone)[0],
  };
}

export function toneOf(occurrence: EventOccurrence, data: CalendarData): CalendarTone {
  return calendarOf(occurrence.event, data.calendars)?.tone ?? CalendarTone.Grey;
}

export function timeRangeOf(occurrence: EventOccurrence, settings: ViewSettings): string {
  if (occurrence.kind === OccurrenceKind.AllDay) {
    return widgetCopy.allDay;
  }
  return formatTimeRange(occurrence.start, occurrence.end, settings);
}

export function startTimeOf(occurrence: EventOccurrence, settings: ViewSettings): string {
  if (occurrence.kind === OccurrenceKind.AllDay) {
    return widgetCopy.allDay;
  }
  return formatTime(occurrence.start, settings);
}

export function startWithPlace(occurrence: EventOccurrence, settings: ViewSettings): string {
  const time = startTimeOf(occurrence, settings);
  const place = occurrence.event.location;
  return place === undefined ? time : widgetCopy.atPlace(time, place);
}

export function placeWithRange(occurrence: EventOccurrence, settings: ViewSettings): string {
  const range = timeRangeOf(occurrence, settings);
  const place = occurrence.event.location;
  return place === undefined ? range : widgetCopy.atPlace(place, range);
}

export function startsIn(occurrence: EventOccurrence, now: Instant, settings: ViewSettings): string {
  const interval = occurrenceInterval(occurrence, settings.timeZone);
  const minutesAway = Math.round((interval.start - now) / milliseconds.minute);
  if (minutesAway <= 0) {
    return widgetCopy.now;
  }
  const format = new Intl.RelativeTimeFormat(settings.locale, { numeric: "auto" });
  const isWithinHour = minutesAway < minutes.hour;
  const hoursAway = Math.round(minutesAway / minutes.hour);
  const text = isWithinHour ? format.format(minutesAway, "minute") : format.format(hoursAway, "hour");
  return text.charAt(0).toLocaleUpperCase(settings.locale) + text.slice(1);
}

export function weekdayOfDate(date: PlainDate, settings: ViewSettings): string {
  return formatPlainDate(date, settings, { weekday: "long" });
}

export function dayNumberOf(date: PlainDate, settings: ViewSettings): string {
  return formatPlainDate(date, settings, { day: "numeric" });
}

export function initialsOf(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toLocaleUpperCase())
    .join("");
}

export function lineOf(occurrence: EventOccurrence, data: CalendarData, detail: string): WidgetLine {
  return { key: occurrence.key, title: occurrence.event.title, detail, tone: toneOf(occurrence, data) };
}

export function tomorrowLine(occurrence: EventOccurrence, data: CalendarData, settings: ViewSettings): WidgetLine {
  const detail = widgetCopy.atPlace(occurrence.event.title, startTimeOf(occurrence, settings));
  return { ...lineOf(occurrence, data, detail), title: widgetCopy.tomorrow };
}

export function restingNote(day: WidgetDay): string {
  return day.status === DayStatus.Done ? widgetCopy.dayDone : widgetCopy.nothingPlanned;
}
