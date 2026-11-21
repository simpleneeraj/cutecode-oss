import { formatClock, formatDayLabel, formatPlainDate, formatTime } from "../locale";
import { addDays, compareDates, dateOf, startOfDay } from "../time";
import {
  AnnouncementKind,
  EventStatus,
  OccurrenceKind,
  RefusalReason,
  ViewKind,
  type Announcement,
  type Calendar,
  type ClockRange,
  type EventOccurrence,
  type Instant,
  type PlainDate,
  type ViewSettings,
} from "../types";

const viewNames: Record<ViewKind, string> = {
  [ViewKind.Day]: "Day",
  [ViewKind.Week]: "Week",
  [ViewKind.Month]: "Month",
  [ViewKind.Year]: "Year",
  [ViewKind.Agenda]: "Agenda",
};

const refusalReasons: Record<RefusalReason, string> = {
  [RefusalReason.ReadOnly]: "It's read only.",
  [RefusalReason.OutsideBookableHours]: "It's outside the bookable hours.",
  [RefusalReason.OutsideAllowedHours]: "It's outside the allowed hours.",
  [RefusalReason.TooShort]: "It would be too short.",
  [RefusalReason.Unchanged]: "Nothing changed.",
};

const statusNames: Partial<Record<EventStatus, string>> = {
  [EventStatus.Tentative]: "tentative",
  [EventStatus.Cancelled]: "cancelled",
};

const allDay = "all day";

function weekdayLabel(date: PlainDate, settings: ViewSettings): string {
  return formatPlainDate(date, settings, { weekday: "long" });
}

function navigationLabel(view: ViewKind, anchor: PlainDate, settings: ViewSettings): string {
  if (view === ViewKind.Week) {
    return `Week of ${formatPlainDate(anchor, settings, { month: "long", day: "numeric" })}`;
  }
  if (view === ViewKind.Month) {
    return formatPlainDate(anchor, settings, { month: "long", year: "numeric" });
  }
  if (view === ViewKind.Year) {
    return formatPlainDate(anchor, settings, { year: "numeric" });
  }
  if (view === ViewKind.Agenda) {
    return `Agenda from ${formatDayLabel(anchor, settings)}`;
  }
  return formatDayLabel(anchor, settings);
}

function countLabel(count: number): string {
  if (count === 0) {
    return "No events";
  }
  if (count === 1) {
    return "1 event";
  }
  return `${count} events`;
}

function timeOrAllDay(instant: Instant, isAllDay: boolean, settings: ViewSettings): string {
  return isAllDay ? allDay : formatTime(instant, settings);
}

function focusPhrase(instant: Instant, isAllDay: boolean, eventCount: number, settings: ViewSettings): string {
  const day = formatDayLabel(dateOf(instant, settings.timeZone), settings);
  return `${day}, ${timeOrAllDay(instant, isAllDay, settings)}. ${countLabel(eventCount)}.`;
}

function lastCoveredDate(end: Instant, timeZone: string): PlainDate {
  const endDate = dateOf(end, timeZone);
  const endsAtMidnight = startOfDay(endDate, timeZone) === end;
  return endsAtMidnight ? addDays(endDate, -1) : endDate;
}

type DayLabeler = (date: PlainDate, settings: ViewSettings) => string;

function timedSpan(start: Instant, end: Instant, settings: ViewSettings, dayLabel: DayLabeler): string {
  const startDate = dateOf(start, settings.timeZone);
  const startLabel = `${dayLabel(startDate, settings)}, ${formatTime(start, settings)}`;
  if (start === end) {
    return startLabel;
  }
  const isOneDay = compareDates(lastCoveredDate(end, settings.timeZone), startDate) <= 0;
  if (isOneDay) {
    return `${startLabel} to ${formatTime(end, settings)}`;
  }
  return `${startLabel} to ${dayLabel(dateOf(end, settings.timeZone), settings)}, ${formatTime(end, settings)}`;
}

function movePhrase(title: string, start: Instant, end: Instant, isAllDay: boolean, settings: ViewSettings): string {
  if (isAllDay) {
    return `Moved ${title} to ${weekdayLabel(dateOf(start, settings.timeZone), settings)}, ${allDay}.`;
  }
  return `Moved ${title} to ${timedSpan(start, end, settings, weekdayLabel)}.`;
}

function hoursSentence(hours: ClockRange, settings: ViewSettings): string {
  return `Hours are ${formatClock(hours.start, settings)} to ${formatClock(hours.end, settings)}.`;
}

function refusalPhrase(reason: RefusalReason, allowedHours: ClockRange | undefined, settings: ViewSettings): string {
  const why = allowedHours ? hoursSentence(allowedHours, settings) : refusalReasons[reason];
  return `Can't move there. ${why} It went back.`;
}

export function announce(announcement: Announcement, settings: ViewSettings): string {
  switch (announcement.kind) {
    case AnnouncementKind.ViewChanged:
      return `${viewNames[announcement.view]} view.`;
    case AnnouncementKind.Navigated:
      return `${navigationLabel(announcement.view, announcement.anchor, settings)}.`;
    case AnnouncementKind.FocusMoved:
      return focusPhrase(announcement.instant, announcement.allDay, announcement.eventCount, settings);
    case AnnouncementKind.Moved:
      return movePhrase(announcement.title, announcement.start, announcement.end, announcement.allDay, settings);
    case AnnouncementKind.Resized:
      return `${announcement.title} now ends at ${formatTime(announcement.end, settings)}.`;
    case AnnouncementKind.Refused:
      return refusalPhrase(announcement.reason, announcement.allowedHours, settings);
    case AnnouncementKind.ReadOnly:
      return `${announcement.title} is on ${announcement.calendarName}, which is read only.`;
    case AnnouncementKind.Deleted:
      return `Deleted ${announcement.title}. Press Command Z to undo.`;
    case AnnouncementKind.CalendarToggled:
      return `${announcement.calendarName} ${announcement.visible ? "shown" : "hidden"}.`;
  }
}

function allDayWhen(startDate: PlainDate, endDate: PlainDate, settings: ViewSettings): string {
  const lastDate = addDays(endDate, -1);
  const isSingleDay = compareDates(lastDate, startDate) <= 0;
  const first = formatDayLabel(startDate, settings);
  if (isSingleDay) {
    return `${first}, ${allDay}`;
  }
  return `${first} to ${formatDayLabel(lastDate, settings)}, ${allDay}`;
}

function occurrenceWhen(occurrence: EventOccurrence, settings: ViewSettings): string {
  if (occurrence.kind === OccurrenceKind.AllDay) {
    return allDayWhen(occurrence.startDate, occurrence.endDate, settings);
  }
  return timedSpan(occurrence.start, occurrence.end, settings, formatDayLabel);
}

export function eventAccessibleName(
  occurrence: EventOccurrence,
  calendar: Calendar | undefined,
  settings: ViewSettings,
): string {
  const { event } = occurrence;
  const isReadOnly = calendar?.readOnly ?? true;
  const parts = [
    event.title,
    occurrenceWhen(occurrence, settings),
    event.location,
    statusNames[event.status],
    isReadOnly ? "read only" : undefined,
  ];
  return parts.filter((part) => part !== undefined && part !== "").join(", ");
}
