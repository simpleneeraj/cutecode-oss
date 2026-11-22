import { coveredDates } from "../../event";
import { formatPlainDate, formatTimeRange } from "../../locale";
import { addDays, dateOf, daysBetween, milliseconds, minutes } from "../../time";
import {
  OccurrenceKind,
  type DateRange,
  type EventOccurrence,
  type InstantRange,
  type PlainDate,
  type ViewSettings,
} from "../../types";

export type EventWhen = {
  day: string;
  time: string;
  duration: string;
};

const whenCopy = {
  allDay: "All day",
  hours: (count: number) => `${count} hr`,
  minutes: (count: number) => `${count} min`,
  days: (count: number) => (count === 1 ? "1 day" : `${count} days`),
  through: (first: string, last: string) => `${first} to ${last}`,
};

const shortDay: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };

export function durationText(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / minutes.hour);
  const rest = totalMinutes % minutes.hour;
  if (hours === 0) {
    return whenCopy.minutes(rest);
  }
  const hourText = whenCopy.hours(hours);
  return rest === 0 ? hourText : `${hourText} ${whenCopy.minutes(rest)}`;
}

function dayText(date: PlainDate, settings: ViewSettings): string {
  return formatPlainDate(date, settings, shortDay);
}

export function timedWhen(range: InstantRange, settings: ViewSettings): EventWhen {
  const elapsed = Math.round((range.end - range.start) / milliseconds.minute);
  return {
    day: dayText(dateOf(range.start, settings.timeZone), settings),
    time: formatTimeRange(range.start, range.end, settings),
    duration: durationText(elapsed),
  };
}

export function datesWhen(dates: DateRange, settings: ViewSettings): EventWhen {
  const { start, end } = dates;
  const count = Math.max(1, daysBetween(start, end));
  const first = dayText(start, settings);
  const day = count === 1 ? first : whenCopy.through(first, dayText(addDays(start, count - 1), settings));
  return { day, time: whenCopy.allDay, duration: whenCopy.days(count) };
}

export function occurrenceWhen(occurrence: EventOccurrence, settings: ViewSettings): EventWhen {
  if (occurrence.kind === OccurrenceKind.AllDay) {
    return datesWhen(coveredDates(occurrence, settings.timeZone), settings);
  }
  return timedWhen(occurrence, settings);
}
