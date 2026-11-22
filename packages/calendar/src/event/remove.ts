import { ChangeScope, type CalendarEvent, type EventOccurrence, type Instant } from "../types";
import { endedBefore, isAtOrAfter, isFirstOccurrence, seriesOf, withoutOccurrence } from "./series";

function isInSeries(event: CalendarEvent, series: CalendarEvent): boolean {
  return event.id === series.id || event.seriesId === series.id;
}

function removeThis(events: CalendarEvent[], target: CalendarEvent, series: CalendarEvent, originalStart: string, now: Instant) {
  return events
    .filter((event) => event.id === series.id || event.id !== target.id)
    .map((event) => (event.id === series.id ? withoutOccurrence(series, originalStart, now) : event));
}

function removeFollowing(events: CalendarEvent[], series: CalendarEvent, originalStart: string, now: Instant) {
  return events
    .filter((event) => event.seriesId !== series.id || !isAtOrAfter(event, originalStart))
    .map((event) => (event.id === series.id ? endedBefore(series, originalStart, now) : event));
}

export function removeOccurrence(
  events: CalendarEvent[],
  occurrence: EventOccurrence,
  scope: ChangeScope,
  now: Instant,
): CalendarEvent[] {
  const target = occurrence.event;
  const series = seriesOf(events, target);
  const { originalStart } = occurrence;
  if (series === undefined) {
    return events.filter((event) => event.id !== target.id);
  }
  if (scope === ChangeScope.This) {
    return removeThis(events, target, series, originalStart, now);
  }
  if (scope === ChangeScope.Following && !isFirstOccurrence(series, originalStart)) {
    return removeFollowing(events, series, originalStart, now);
  }
  return events.filter((event) => !isInSeries(event, series));
}
