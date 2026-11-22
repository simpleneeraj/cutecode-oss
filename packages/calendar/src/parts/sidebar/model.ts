import { sortOccurrences } from "../../agenda";
import { isOnHiddenCalendar, occurrenceInterval, occurrencesInRange } from "../../event";
import { formatPlainDate, formatTime } from "../../locale";
import { dateOf, milliseconds } from "../../time";
import {
  OccurrenceKind,
  type Calendar,
  type CalendarEvent,
  type EventOccurrence,
  type ExpansionContext,
  type Instant,
  type InstantRange,
  type OccurrenceExpander,
  type ViewSettings,
} from "../../types";

export type CalendarGroups = {
  mine: Calendar[];
  other: Calendar[];
};

export type UpNextSummary = {
  title: string;
  detail: string;
};

export const sidebarCopy = {
  search: "Search events",
  clearSearch: "Clear search",
  noResults: "No events match",
  results: "Results",
  calendars: "Calendars",
  mine: "My calendars",
  other: "Other",
  readOnly: "read only",
  upNext: "Up next",
  next: "Next:",
  nothingNext: "Nothing coming up.",
  now: "Now",
  allDay: "all day",
  previousMonth: "Previous month",
  nextMonth: "Next month",
};

export const sidebarLimits = {
  results: 20,
  soonMinutes: 60,
  upNextDays: 30,
  searchDays: 365,
};

function normalized(text: string, locale: string): string {
  return text.toLocaleLowerCase(locale).trim();
}

function matches(event: CalendarEvent, query: string, locale: string): boolean {
  const fields = [event.title, event.location ?? "", event.notes ?? ""];
  return fields.some((field) => normalized(field, locale).includes(query));
}

export type SearchInput = {
  events: CalendarEvent[];
  hiddenCalendarIds: string[];
  query: string;
  now: Instant | null;
  expand?: OccurrenceExpander;
};

function searchContext(now: Instant, timeZone: string): ExpansionContext {
  const reach = sidebarLimits.searchDays * milliseconds.day;
  const range = { start: now - reach, end: now + reach };
  return { range, dates: { start: dateOf(range.start, timeZone), end: dateOf(range.end, timeZone) }, timeZone };
}

export function upcomingFirst(occurrences: EventOccurrence[], now: Instant, timeZone: string): EventOccurrence[] {
  const sorted = sortOccurrences(occurrences, timeZone);
  const isUpcoming = (occurrence: EventOccurrence) => occurrenceInterval(occurrence, timeZone).end > now;
  return [...sorted.filter(isUpcoming), ...sorted.filter((occurrence) => !isUpcoming(occurrence)).reverse()];
}

export function searchEvents(input: SearchInput, settings: ViewSettings): EventOccurrence[] {
  const needle = normalized(input.query, settings.locale);
  if (needle === "" || input.now === null) {
    return [];
  }
  const { timeZone } = settings;
  const found = input.events
    .filter((event) => !isOnHiddenCalendar(event, input.hiddenCalendarIds))
    .filter((event) => matches(event, needle, settings.locale));
  const occurrences = occurrencesInRange(found, searchContext(input.now, timeZone), input.expand);
  return upcomingFirst(occurrences, input.now, timeZone).slice(0, sidebarLimits.results);
}

export function groupCalendars(calendars: Calendar[], otherCalendarIds: string[]): CalendarGroups {
  const isOther = (calendar: Calendar) => calendar.readOnly || otherCalendarIds.includes(calendar.id);
  return { mine: calendars.filter((calendar) => !isOther(calendar)), other: calendars.filter(isOther) };
}

function capitalized(text: string, locale: string): string {
  return `${text.charAt(0).toLocaleUpperCase(locale)}${text.slice(1)}`;
}

function laterWhen(start: Instant, settings: ViewSettings): string {
  const day = formatPlainDate(dateOf(start, settings.timeZone), settings, { weekday: "short" });
  return `${day}, ${formatTime(start, settings)}`;
}

export function occurrenceWhen(occurrence: EventOccurrence, now: Instant, settings: ViewSettings): string {
  if (occurrence.kind === OccurrenceKind.AllDay) {
    const day = formatPlainDate(occurrence.startDate, settings, { weekday: "short" });
    return `${day}, ${sidebarCopy.allDay}`;
  }
  const minutesAway = Math.ceil((occurrence.start - now) / milliseconds.minute);
  if (minutesAway <= 0) {
    return sidebarCopy.now;
  }
  if (minutesAway < sidebarLimits.soonMinutes) {
    const relative = new Intl.RelativeTimeFormat(settings.locale, { numeric: "auto" }).format(minutesAway, "minute");
    return capitalized(relative, settings.locale);
  }
  const isSameDay = dateOf(occurrence.start, settings.timeZone) === dateOf(now, settings.timeZone);
  return isSameDay ? formatTime(occurrence.start, settings) : laterWhen(occurrence.start, settings);
}

const resultDay: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };

export function resultWhen(occurrence: EventOccurrence, settings: ViewSettings): string {
  if (occurrence.kind === OccurrenceKind.AllDay) {
    return `${formatPlainDate(occurrence.startDate, settings, resultDay)}, ${sidebarCopy.allDay}`;
  }
  const day = formatPlainDate(dateOf(occurrence.start, settings.timeZone), settings, resultDay);
  return `${day}, ${formatTime(occurrence.start, settings)}`;
}

export function upNextSummary(occurrence: EventOccurrence, now: Instant, settings: ViewSettings): UpNextSummary {
  const parts = [occurrenceWhen(occurrence, now, settings), occurrence.event.location];
  return {
    title: `${sidebarCopy.next} ${occurrence.event.title}`,
    detail: parts.filter((part) => part !== undefined && part !== "").join(", "),
  };
}

export function upNextWindow(now: Instant): InstantRange {
  return { start: now, end: now + sidebarLimits.upNextDays * milliseconds.day };
}
