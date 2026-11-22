import { makeCalendar, makeEvent, testZones } from "../../../testing";
import { Attendance, CalendarTone, type CalendarEvent } from "../../../types";
import type { WidgetOptions } from "./props";

export enum WidgetExampleState {
  Ready = "ready",
  DayDone = "dayDone",
  Placeholder = "placeholder",
  Busy = "busy",
}

export const widgetExampleChoices = [
  { kind: WidgetExampleState.Ready, label: "Today" },
  { kind: WidgetExampleState.DayDone, label: "Day done" },
  { kind: WidgetExampleState.Placeholder, label: "Placeholder" },
  { kind: WidgetExampleState.Busy, label: "Busy" },
];

export const widgetExampleCopy = {
  states: "Widget state",
};

const calendars = [
  makeCalendar(),
  makeCalendar({ id: "team", name: "Team", tone: CalendarTone.Ink }),
  makeCalendar({ id: "personal", name: "Personal", tone: CalendarTone.Grey }),
];

function timed(id: string, title: string, start: string, end: string, overrides: Partial<CalendarEvent> = {}) {
  return makeEvent({ id, title, start: `${start}-08:00`, end: `${end}-08:00`, ...overrides });
}

const people = [
  { id: "ana", name: "Ana Novak", attendance: Attendance.Accepted, organizer: true },
  { id: "sam", name: "Sam Lee", attendance: Attendance.Accepted },
  { id: "mia", name: "Mia Rose", attendance: Attendance.Tentative },
];

const day = [
  timed("crit", "Design crit", "2026-11-18T10:00:00", "2026-11-18T11:00:00", { location: "Atlas", attendees: people }),
  timed("sam", "1:1 with Sam", "2026-11-18T10:30:00", "2026-11-18T11:30:00", {
    calendarId: "team",
    location: "Borealis",
  }),
  timed("ship", "Ship review", "2026-11-18T15:00:00", "2026-11-18T16:00:00", {
    location: "Atlas",
    calendarId: "personal",
  }),
  timed("standup", "Standup", "2026-11-19T09:00:00", "2026-11-19T09:15:00", { calendarId: "team" }),
  timed("planning", "Sprint planning", "2026-11-10T09:00:00", "2026-11-10T10:00:00"),
  timed("review", "Roadmap review", "2026-11-10T13:00:00", "2026-11-10T14:00:00", { calendarId: "team" }),
  timed("dinner", "Team dinner", "2026-11-10T19:00:00", "2026-11-10T21:00:00", { calendarId: "personal" }),
];

const rush = [
  timed("vendor", "Vendor call", "2026-11-18T12:00:00", "2026-11-18T12:30:00"),
  timed("interview", "Interview", "2026-11-18T13:00:00", "2026-11-18T14:00:00", { calendarId: "team" }),
  timed("gym", "Gym", "2026-11-18T17:30:00", "2026-11-18T18:30:00", { calendarId: "personal" }),
];

const options = {
  locale: "en-US",
  timeZone: testZones.losAngeles,
};

const nowFor: Record<WidgetExampleState, string> = {
  [WidgetExampleState.Ready]: "2026-11-18T09:40",
  [WidgetExampleState.DayDone]: "2026-11-18T19:00",
  [WidgetExampleState.Placeholder]: "2026-11-18T09:40",
  [WidgetExampleState.Busy]: "2026-11-18T09:40",
};

export function widgetExampleProps(state: WidgetExampleState) {
  const events = state === WidgetExampleState.Busy ? [...day, ...rush] : day;
  const widgetOptions: WidgetOptions = { ...options, now: nowFor[state] };
  return {
    data: { events, calendars },
    options: widgetOptions,
    placeholder: state === WidgetExampleState.Placeholder,
  };
}
