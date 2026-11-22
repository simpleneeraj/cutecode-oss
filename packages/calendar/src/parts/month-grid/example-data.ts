import { makeAllDayEvent, makeEvent } from "../../testing";
import type { CalendarEvent } from "../../types";
import { exampleEvents } from "../time-grid/example-data";

function timed(id: string, title: string, start: string, end: string, calendarId = "work"): CalendarEvent {
  return makeEvent({ id, title, calendarId, start: `${start}-08:00`, end: `${end}-08:00` });
}

export const monthEvents: CalendarEvent[] = [
  ...exampleEvents,
  timed("standup-2", "Standup", "2026-11-02T09:00:00", "2026-11-02T09:15:00"),
  timed("vendor-2", "Vendor call", "2026-11-02T14:00:00", "2026-11-02T15:00:00"),
  timed("book-club", "Book club", "2026-11-05T18:00:00", "2026-11-05T19:30:00", "personal"),
  timed("doctor", "Doctor", "2026-11-12T10:00:00", "2026-11-12T10:45:00", "personal"),
  timed("dinner-party", "Dinner party", "2026-11-14T20:00:00", "2026-11-14T23:00:00", "family"),
  timed("studio", "Studio visit", "2026-11-24T14:00:00", "2026-11-24T15:00:00"),
  timed("kickoff", "Kickoff", "2026-11-30T10:00:00", "2026-11-30T11:00:00"),
  makeAllDayEvent("2026-11-03", "2026-11-05", { id: "offsite-early", title: "Offsite", calendarId: "team" }),
  makeAllDayEvent("2026-11-26", "2026-11-27", { id: "thanksgiving", title: "Thanksgiving", calendarId: "holidays" }),
  makeAllDayEvent("2026-11-27", "2026-12-01", { id: "family-visit", title: "Family visit", calendarId: "family" }),
];
