import { z } from "zod";

import { occurrenceInterval } from "../../event";
import { dateOf, formatDateTime } from "../../time";
import {
  Attendance,
  ChangeSource,
  type Attendee,
  type Calendar,
  type EventOccurrence,
  type InstantRange,
  type ViewSettings,
} from "../../types";
import type { NewEventSlot, QuickEventDraft } from "./target";

export const quickEventLimits = {
  title: 200,
  place: 200,
  invitees: 50,
};

export const quickEventErrors = {
  titleMissing: "Add a title",
  calendarMissing: "Pick a calendar",
  noCalendar: "No calendar can take new events. Turn one on in the sidebar.",
};

export const quickEventSchema = z.object({
  title: z.string().trim().min(1, quickEventErrors.titleMissing).max(quickEventLimits.title),
  calendarId: z.string().min(1, quickEventErrors.calendarMissing),
  place: z.string().trim().max(quickEventLimits.place),
  invitees: z.array(z.string().trim().min(1)).max(quickEventLimits.invitees),
});

export type QuickEventValues = z.infer<typeof quickEventSchema>;

export type EventTiming = {
  start: string;
  end: string;
  allDay: boolean;
  timeZone: string;
  range: InstantRange;
};

export function writableCalendars(calendars: Calendar[]): Calendar[] {
  return calendars.filter((calendar) => !calendar.readOnly && calendar.visible);
}

export function slotTiming(slot: NewEventSlot, settings: ViewSettings): EventTiming {
  const { timeZone } = settings;
  const range = { start: slot.start, end: slot.end };
  if (slot.allDay) {
    return { start: dateOf(slot.start, timeZone), end: dateOf(slot.end, timeZone), allDay: true, timeZone, range };
  }
  const start = formatDateTime(slot.start, timeZone);
  return { start, end: formatDateTime(slot.end, timeZone), allDay: false, timeZone, range };
}

export function occurrenceTiming(occurrence: EventOccurrence, settings: ViewSettings): EventTiming {
  const { event } = occurrence;
  const range = occurrenceInterval(occurrence, settings.timeZone);
  return { start: event.start, end: event.end, allDay: event.allDay, timeZone: event.timeZone, range };
}

export function newEventValues(slot: NewEventSlot, calendars: Calendar[]): QuickEventValues {
  const [first] = writableCalendars(calendars);
  const calendarId = slot.calendarId ?? first?.id ?? "";
  return { title: "", calendarId, place: "", invitees: [] };
}

export function editedEventValues(occurrence: EventOccurrence): QuickEventValues {
  const { event } = occurrence;
  const invitees = (event.attendees ?? []).filter((attendee) => !attendee.organizer).map((attendee) => attendee.name);
  return { title: event.title, calendarId: event.calendarId, place: event.location ?? "", invitees };
}

function inviteeId(name: string): string {
  return `invitee-${name.trim().toLowerCase().replace(/\s+/g, "-")}`;
}

export function attendeesOf(invitees: string[], existing: Attendee[]): Attendee[] {
  const known = new Map(existing.map((attendee) => [attendee.name, attendee]));
  const organizers = existing.filter((attendee) => attendee.organizer);
  const invited = invitees.map(
    (name) => known.get(name) ?? { id: inviteeId(name), name, attendance: Attendance.Pending },
  );
  return [...organizers, ...invited];
}

export function draftOf(
  values: QuickEventValues,
  timing: EventTiming,
  edited: EventOccurrence | null,
): QuickEventDraft {
  const existing = edited?.event.attendees ?? [];
  const attendees = attendeesOf(values.invitees, existing);
  const location = values.place === "" ? undefined : values.place;
  return {
    eventId: edited?.event.id,
    originalStart: edited?.originalStart,
    calendarId: values.calendarId,
    title: values.title,
    start: timing.start,
    end: timing.end,
    allDay: timing.allDay,
    timeZone: timing.timeZone,
    location,
    attendees: attendees.length === 0 ? undefined : attendees,
    source: ChangeSource.Form,
  };
}
