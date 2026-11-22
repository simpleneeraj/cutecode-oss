import { makeAllDayEvent, makeCalendar, makeEvent, testZones } from "../../testing";
import { Attendance, CalendarTone, EventStatus, Frequency, type Calendar, type CalendarEvent } from "../../types";
import type { TimeGridOptions } from "./props";

export const exampleDate = "2026-11-18";

export const exampleCalendars: Calendar[] = [
  makeCalendar(),
  makeCalendar({ id: "team", name: "Team", tone: CalendarTone.Ink }),
  makeCalendar({ id: "personal", name: "Personal", tone: CalendarTone.Grey }),
  makeCalendar({ id: "family", name: "Family", tone: CalendarTone.Line }),
  makeCalendar({ id: "holidays", name: "US holidays", tone: CalendarTone.Grey, readOnly: true }),
];

export const exampleOptions: TimeGridOptions = {
  locale: "en-US",
  timeZone: testZones.losAngeles,
  workingHours: { start: "09:00", end: "17:00" },
  shownHours: { start: "08:00", end: "20:00" },
  viewerId: "me",
  now: "2026-11-18T14:20",
  allowedHours: { start: "07:00", end: "19:00" },
};

function timed(id: string, title: string, start: string, end: string, overrides: Partial<CalendarEvent> = {}) {
  return makeEvent({ id, title, start: `${start}-08:00`, end: `${end}-08:00`, ...overrides });
}

const overlapping = [
  timed("crit", "Design crit", "2026-11-19T10:00:00", "2026-11-19T11:00:00", { location: "Atlas" }),
  timed("sam", "1:1 with Sam", "2026-11-19T10:00:00", "2026-11-19T11:30:00", { calendarId: "team" }),
  timed("bank", "Call the bank", "2026-11-19T10:15:00", "2026-11-19T11:00:00", { calendarId: "personal" }),
  timed("pickup", "School pickup", "2026-11-19T10:30:00", "2026-11-19T11:30:00", { calendarId: "family" }),
  timed("vendor", "Vendor call", "2026-11-19T10:30:00", "2026-11-19T11:00:00"),
];

const statuses = [
  timed("sync", "Roadmap sync", "2026-11-17T13:00:00", "2026-11-17T14:00:00", { status: EventStatus.Tentative }),
  timed("lunch", "Team lunch", "2026-11-18T12:00:00", "2026-11-18T13:00:00", {
    calendarId: "team",
    attendees: [{ id: "me", name: "Me", attendance: Attendance.Declined }],
  }),
  timed("gym", "Gym", "2026-11-16T18:00:00", "2026-11-16T19:00:00", {
    calendarId: "personal",
    status: EventStatus.Cancelled,
  }),
];

const edges = [
  timed("run", "Morning run", "2026-11-18T06:30:00", "2026-11-18T07:15:00", { calendarId: "personal" }),
  timed("dinner", "Dinner with the family", "2026-11-20T21:00:00", "2026-11-20T22:30:00", { calendarId: "family" }),
  timed("night", "Night shift", "2026-11-17T22:00:00", "2026-11-18T02:00:00", { location: "Ward 4" }),
  timed("deck", "Deadline: send deck", "2026-11-20T17:00:00", "2026-11-20T17:00:00"),
  timed("pills", "Take pills", "2026-11-16T16:15:00", "2026-11-16T16:20:00", { calendarId: "personal" }),
  timed("review", "Weekly review", "2026-11-20T14:00:00", "2026-11-20T15:00:00", {
    recurrence: { frequency: Frequency.Weekly, interval: 1 },
  }),
  timed(
    "planning",
    "Quarterly planning with the product, design and research leads",
    "2026-11-16T10:00:00",
    "2026-11-16T11:30:00",
    {
      location: "Conference room on floor 3, north wing, behind the kitchen",
    },
  ),
];

const allDay = [
  makeAllDayEvent("2026-11-20", "2026-11-24", { id: "trip", title: "Trip to Lisbon", calendarId: "personal" }),
  makeAllDayEvent("2026-11-16", "2026-11-17", { id: "offsite", title: "Team offsite", calendarId: "team" }),
  makeAllDayEvent("2026-11-11", "2026-11-12", { id: "veterans", title: "Veterans Day", calendarId: "holidays" }),
];

export const exampleEvents: CalendarEvent[] = [...overlapping, ...statuses, ...edges, ...allDay];
