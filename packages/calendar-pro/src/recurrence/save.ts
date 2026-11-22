import { ChangeScope, type CalendarEvent, type EventDraft, type Instant, type Recurrence } from "@cutecode/calendar/types";
import { applyRecurringEdit, seriesOf, type EventFields, type SeriesEdit } from "./change";
import { endAfter } from "./rule";

export type SavedDraft = EventDraft & {
  eventId: string;
  originalStart?: string;
  scope?: ChangeScope;
};

function fieldsOf(draft: SavedDraft): EventFields {
  const { calendarId, title, location, attendees } = draft;
  const notes = draft.notes === undefined ? {} : { notes: draft.notes };
  const resourceIds = draft.resourceIds === undefined ? {} : { resourceIds: draft.resourceIds };
  return { calendarId, title, location, attendees, ...notes, ...resourceIds };
}

function recurrenceOf(draft: SavedDraft, target: CalendarEvent): Recurrence | null | undefined {
  const isException = target.seriesId !== undefined;
  return isException ? undefined : (draft.recurrence ?? null);
}

function timesOf(draft: SavedDraft, target: CalendarEvent, events: CalendarEvent[]) {
  const series = seriesOf(target, events);
  const keepsOwnTimes = series === undefined || (draft.scope === ChangeScope.This && target.seriesId !== undefined);
  if (keepsOwnTimes) {
    return { start: draft.start, end: draft.end, allDay: draft.allDay };
  }
  const start = draft.originalStart ?? target.start;
  return { start, end: endAfter(start, series, series.timeZone), allDay: series.allDay };
}

export function applyRecurringSave(events: CalendarEvent[], draft: SavedDraft, now: Instant): CalendarEvent[] {
  const target = events.find((event) => event.id === draft.eventId);
  if (target === undefined) {
    return events;
  }
  const edit: SeriesEdit = {
    eventId: draft.eventId,
    originalStart: draft.originalStart ?? target.start,
    ...timesOf(draft, target, events),
    fields: fieldsOf(draft),
    recurrence: recurrenceOf(draft, target),
    scope: draft.scope ?? ChangeScope.All,
    source: draft.source,
  };
  return applyRecurringEdit(events, edit, now);
}
