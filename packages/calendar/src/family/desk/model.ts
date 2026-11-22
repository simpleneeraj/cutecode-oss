import { sortOccurrences } from "../../agenda/order";
import { occurrencesInRange } from "../../event";
import { formatPlainDate } from "../../locale";
import { addDays, daySpan, daysBetween } from "../../time";
import type { CalendarEvent, PlainDate, ViewSettings } from "../../types";

export const deskCopy = {
  freeDay: "A free day",
  nextDay: "Next day",
  addToDay: "Add to this day",
};

function capitalized(text: string, locale: string): string {
  return `${text.charAt(0).toLocaleUpperCase(locale)}${text.slice(1)}`;
}

export function relativeDayLabel(date: PlainDate, today: PlainDate | null, settings: ViewSettings): string {
  if (today === null) {
    return formatPlainDate(date, settings, { weekday: "long" });
  }
  const offset = daysBetween(today, date);
  const relative = new Intl.RelativeTimeFormat(settings.locale, { numeric: "auto" }).format(offset, "day");
  return capitalized(relative, settings.locale);
}

export function deskTitle(events: CalendarEvent[], date: PlainDate, timeZone: string): string {
  const span = daySpan(date, timeZone);
  const context = {
    range: { start: span.start, end: span.end },
    dates: { start: date, end: addDays(date, 1) },
    timeZone,
  };
  const [first] = sortOccurrences(occurrencesInRange(events, context), timeZone);
  return first?.event.title ?? deskCopy.freeDay;
}
