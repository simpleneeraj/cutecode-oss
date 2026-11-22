import { addDays, daysBetween, formatDateTime, parseDateTime } from "../time";
import { ChangeScope, type CalendarEvent, type EventChange, type Instant } from "../types";
import { occurrenceKey } from "./index";
import { endedBefore, isFirstOccurrence, seriesOf, stamped } from "./series";

type EventTimes = Pick<CalendarEvent, "start" | "end" | "allDay">;

function timesOf(change: EventChange): EventTimes {
  return { start: change.start, end: change.end, allDay: change.allDay };
}

function moved(event: CalendarEvent, times: EventTimes, change: EventChange, now: Instant): CalendarEvent {
  const resourceIds = change.resourceId === undefined ? event.resourceIds : [change.resourceId];
  return stamped({ ...event, ...times, resourceIds }, now);
}

function shiftedTimes(series: CalendarEvent, change: EventChange): EventTimes {
  if (series.allDay !== change.allDay) {
    return timesOf(change);
  }
  if (change.allDay) {
    const start = addDays(series.start, daysBetween(change.originalStart, change.start));
    return { start, end: addDays(start, daysBetween(change.start, change.end)), allDay: true };
  }
  const { timeZone } = series;
  const shift = parseDateTime(change.start, timeZone) - parseDateTime(change.originalStart, timeZone);
  const length = parseDateTime(change.end, timeZone) - parseDateTime(change.start, timeZone);
  const start = parseDateTime(series.start, timeZone) + shift;
  return { start: formatDateTime(start, timeZone), end: formatDateTime(start + length, timeZone), allDay: false };
}

function exceptionOf(series: CalendarEvent, change: EventChange, now: Instant): CalendarEvent {
  const { originalStart } = change;
  const id = occurrenceKey(series.id, originalStart);
  const exception = { ...series, id, recurrence: undefined, seriesId: series.id, originalStart, version: 0 };
  return moved(exception, timesOf(change), change, now);
}

function followingOf(series: CalendarEvent, change: EventChange, now: Instant): CalendarEvent {
  const next = { ...series, id: `${series.id}-from-${change.originalStart}`, version: 0 };
  return moved(next, timesOf(change), change, now);
}

function changeThis(events: CalendarEvent[], target: CalendarEvent, change: EventChange, now: Instant) {
  if (target.recurrence === undefined) {
    return events.map((event) => (event.id === target.id ? moved(event, timesOf(change), change, now) : event));
  }
  return [...events, exceptionOf(target, change, now)];
}

function changeSeries(events: CalendarEvent[], series: CalendarEvent, change: EventChange, now: Instant) {
  const isSplit = change.scope === ChangeScope.Following && !isFirstOccurrence(series, change.originalStart);
  if (isSplit) {
    const ended = events.map((event) => (event.id === series.id ? endedBefore(series, change.originalStart, now) : event));
    return [...ended, followingOf(series, change, now)];
  }
  return events.map((event) => (event.id === series.id ? moved(event, shiftedTimes(series, change), change, now) : event));
}

export function applyEventChange(events: CalendarEvent[], change: EventChange, now: Instant): CalendarEvent[] {
  const target = events.find((event) => event.id === change.eventId);
  const series = target === undefined ? undefined : seriesOf(events, target);
  if (target === undefined) {
    return events;
  }
  if (series === undefined || change.scope === ChangeScope.This) {
    return changeThis(events, target, change, now);
  }
  return changeSeries(events, series, change, now);
}
