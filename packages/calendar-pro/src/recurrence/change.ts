import { occurrenceKey, rebookedResources } from "@cutecode/calendar/event";
import { formatDateTime } from "@cutecode/calendar/time";
import {
  ChangeScope,
  type CalendarEvent,
  type ChangeApplier,
  type EventChange,
  type Instant,
  type Recurrence,
} from "@cutecode/calendar/types";
import { canonicalStart, endAfter, slotOrder, untilBefore, usedCount } from "./rule";
import { moveOf, shiftRecurrence, shiftValue, type RecurrenceMove } from "./shift";

type RepeatingEvent = CalendarEvent & { recurrence: Recurrence };

export type EventFields = Partial<
  Pick<CalendarEvent, "calendarId" | "title" | "location" | "notes" | "attendees" | "resourceIds">
>;

export type SeriesEdit = EventChange & { fields?: EventFields; recurrence?: Recurrence | null };

type SeriesSplit = {
  editedSlot: string;
  used: number;
  move: RecurrenceMove;
  followingId: string;
  isEarlier: (value: string) => boolean;
  isLater: (value: string) => boolean;
};

function stamped(event: CalendarEvent, now: Instant): CalendarEvent {
  return { ...event, version: event.version + 1, updatedAt: formatDateTime(now, "UTC") };
}

function moved(event: CalendarEvent, change: SeriesEdit): CalendarEvent {
  const edited = { ...event, ...change.fields };
  const resourceIds = rebookedResources(edited.resourceIds, change);
  return { ...edited, start: change.start, end: change.end, allDay: change.allDay, resourceIds };
}

function ruleOfEdit(series: RepeatingEvent, change: SeriesEdit): Recurrence | null {
  return change.recurrence === undefined ? series.recurrence : change.recurrence;
}

function exceptionFor(series: CalendarEvent, change: SeriesEdit, originalStart: string, now: Instant): CalendarEvent {
  const exception = {
    ...moved(series, change),
    id: occurrenceKey(series.id, originalStart),
    recurrence: undefined,
    seriesId: series.id,
    originalStart,
    version: 0,
  };
  return stamped(exception, now);
}

function isRepeating(event: CalendarEvent): event is RepeatingEvent {
  return event.recurrence !== undefined;
}

function isExceptionOf(event: CalendarEvent, series: CalendarEvent): boolean {
  return event.seriesId === series.id && event.originalStart !== undefined;
}

export function seriesOf(target: CalendarEvent, events: CalendarEvent[]): RepeatingEvent | undefined {
  if (isRepeating(target)) {
    return target;
  }
  return events.filter(isRepeating).find((event) => event.id === target.seriesId);
}

function replaced(events: CalendarEvent[], replacement: CalendarEvent): CalendarEvent[] {
  return events.map((event) => (event.id === replacement.id ? replacement : event));
}

function applyThis(
  events: CalendarEvent[],
  target: CalendarEvent,
  series: RepeatingEvent,
  change: SeriesEdit,
  now: Instant,
) {
  const isTargetException = target.seriesId !== undefined;
  if (isTargetException) {
    return replaced(events, stamped(moved(target, change), now));
  }
  const originalStart = canonicalStart(change.originalStart, series);
  const existing = events.find(
    (event) => isExceptionOf(event, series) && canonicalStart(event.originalStart ?? "", series) === originalStart,
  );
  if (existing === undefined) {
    return [...events, exceptionFor(series, change, originalStart, now)];
  }
  return replaced(events, stamped(moved(existing, change), now));
}

function stoppedSeries(events: CalendarEvent[], series: RepeatingEvent, change: SeriesEdit, now: Instant) {
  const single = stamped({ ...moved(series, change), recurrence: undefined }, now);
  return events.flatMap((event) => {
    if (event.id === series.id) {
      return [single];
    }
    return isExceptionOf(event, series) ? [] : [event];
  });
}

function applyAll(events: CalendarEvent[], series: RepeatingEvent, change: SeriesEdit, now: Instant): CalendarEvent[] {
  const rule = ruleOfEdit(series, change);
  if (rule === null) {
    return stoppedSeries(events, series, change, now);
  }
  const move = moveOf(series, change);
  const recurrence = shiftRecurrence(rule, series, move);
  if (recurrence === undefined) {
    return events;
  }
  const editedSlot = canonicalStart(change.originalStart, series);
  const start = shiftValue(series.start, series, move.shift, change.allDay);
  const movedSeries = { ...moved(series, change), start, end: endAfter(start, change, series.timeZone), recurrence };
  return events.flatMap((event) => {
    if (event.id === series.id) {
      return [stamped(movedSeries, now)];
    }
    if (event.originalStart === undefined || !isExceptionOf(event, series)) {
      return [event];
    }
    if (canonicalStart(event.originalStart, series) === editedSlot) {
      return [];
    }
    const originalStart = shiftValue(event.originalStart, series, move.shift, change.allDay);
    return [stamped({ ...event, originalStart }, now)];
  });
}

function splitOf(series: RepeatingEvent, change: SeriesEdit, used: number): SeriesSplit {
  const editedSlot = canonicalStart(change.originalStart, series);
  const splitOrder = slotOrder(editedSlot, series);
  return {
    editedSlot,
    used,
    move: moveOf(series, change),
    followingId: `${series.id}/${editedSlot}`,
    isEarlier: (value) => slotOrder(value, series) < splitOrder,
    isLater: (value) => slotOrder(value, series) > splitOrder,
  };
}

function endedSeriesOf(series: RepeatingEvent, split: SeriesSplit): CalendarEvent {
  const recurrence = series.recurrence;
  const until = untilBefore(split.editedSlot, series);
  const exceptionDates = recurrence.exceptionDates?.filter(split.isEarlier);
  return { ...series, recurrence: { ...recurrence, count: undefined, until, exceptionDates } };
}

function followingSeriesOf(series: RepeatingEvent, change: SeriesEdit, split: SeriesSplit): CalendarEvent | undefined {
  const recurrence = ruleOfEdit(series, change);
  if (recurrence === null) {
    return { ...moved(series, change), id: split.followingId, recurrence: undefined, version: 0 };
  }
  const remaining = {
    ...recurrence,
    count: recurrence.count === undefined ? undefined : recurrence.count - split.used,
    exceptionDates: recurrence.exceptionDates?.filter(split.isLater),
  };
  const shifted = shiftRecurrence(remaining, series, split.move);
  if (shifted === undefined) {
    return undefined;
  }
  return { ...moved(series, change), id: split.followingId, recurrence: shifted, version: 0 };
}

function laterExceptionOf(event: CalendarEvent, series: RepeatingEvent, change: SeriesEdit, split: SeriesSplit) {
  if (event.originalStart === undefined || ruleOfEdit(series, change) === null) {
    return [];
  }
  const originalStart = shiftValue(event.originalStart, series, split.move.shift, change.allDay);
  return [{ ...event, seriesId: split.followingId, originalStart }];
}

function applyFollowing(events: CalendarEvent[], series: RepeatingEvent, change: SeriesEdit, now: Instant) {
  const used = usedCount(series, change.originalStart);
  const count = series.recurrence.count;
  const isPastCount = count !== undefined && used >= count;
  if (isPastCount) {
    return events;
  }
  if (used === 0) {
    return applyAll(events, series, change, now);
  }
  const split = splitOf(series, change, used);
  const following = followingSeriesOf(series, change, split);
  if (following === undefined) {
    return events;
  }
  return events.flatMap((event) => {
    if (event.id === series.id) {
      return [stamped(endedSeriesOf(series, split), now), stamped(following, now)];
    }
    if (event.originalStart === undefined || !isExceptionOf(event, series)) {
      return [event];
    }
    if (split.isEarlier(event.originalStart)) {
      return [event];
    }
    if (!split.isLater(event.originalStart)) {
      return [];
    }
    return laterExceptionOf(event, series, change, split).map((exception) => stamped(exception, now));
  });
}

function withRuleOf(event: CalendarEvent, change: SeriesEdit): CalendarEvent {
  return change.recurrence === undefined ? event : { ...event, recurrence: change.recurrence ?? undefined };
}

export function applyRecurringEdit(events: CalendarEvent[], change: SeriesEdit, now: Instant): CalendarEvent[] {
  const target = events.find((event) => event.id === change.eventId);
  if (target === undefined) {
    return events;
  }
  const series = seriesOf(target, events);
  if (series === undefined) {
    return replaced(events, stamped(withRuleOf(moved(target, change), change), now));
  }
  if (change.scope === ChangeScope.This) {
    return applyThis(events, target, series, change, now);
  }
  if (change.scope === ChangeScope.Following) {
    return applyFollowing(events, series, change, now);
  }
  return applyAll(events, series, change, now);
}

export const applyRecurringChange: ChangeApplier = applyRecurringEdit;
