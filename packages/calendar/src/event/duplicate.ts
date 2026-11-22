import { formatDateTime } from "../time";
import { OccurrenceKind, type CalendarEvent, type EventOccurrence, type Instant } from "../types";

function timesOf(occurrence: EventOccurrence): { start: string; end: string } {
  if (occurrence.kind === OccurrenceKind.AllDay) {
    return { start: occurrence.startDate, end: occurrence.endDate };
  }
  const { timeZone } = occurrence.event;
  return { start: formatDateTime(occurrence.start, timeZone), end: formatDateTime(occurrence.end, timeZone) };
}

export function duplicateOccurrence(occurrence: EventOccurrence, id: string, now: Instant): CalendarEvent {
  const standalone = { recurrence: undefined, seriesId: undefined, originalStart: undefined };
  const updatedAt = new Date(now).toISOString();
  return { ...occurrence.event, ...timesOf(occurrence), ...standalone, id, version: 1, updatedAt };
}
