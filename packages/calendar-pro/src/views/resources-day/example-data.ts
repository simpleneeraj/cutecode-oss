import { makeCalendar, makeEvent, makeResource, testZones } from "@cutecode/calendar/testing";
import { CalendarTone, ResourceKind, type Calendar, type CalendarEvent, type Resource } from "@cutecode/calendar/types";
import type { TimeGridOptions } from "@cutecode/calendar/day";

export const exampleDate = "2026-11-18";

const bookableHours = { start: "07:00", end: "19:00" };

export const exampleResources: Resource[] = [
  makeResource({ id: "atlas", name: "Atlas", capacity: 8, bookableHours }),
  makeResource({ id: "borealis", name: "Borealis", capacity: 4, bookableHours }),
  makeResource({ id: "cove", name: "Cove", capacity: 12, bookableHours: { start: "09:00", end: "17:00" } }),
  makeResource({ id: "projector", name: "Projector", kind: ResourceKind.Equipment, detail: "Shared, floor 2" }),
  makeResource({ id: "sam", name: "Sam Rivera", kind: ResourceKind.Person, detail: "Design lead" }),
];

export const exampleCalendars: Calendar[] = [
  makeCalendar(),
  makeCalendar({ id: "team", name: "Team", tone: CalendarTone.Ink }),
  makeCalendar({ id: "facilities", name: "Facilities", tone: CalendarTone.Grey, readOnly: true }),
];

export const exampleOptions: TimeGridOptions = {
  locale: "en-US",
  timeZone: testZones.losAngeles,
  shownHours: { start: "07:00", end: "20:00" },
  viewerId: "me",
  now: "2026-11-18T11:20",
};

function booking(id: string, title: string, hours: [string, string], resourceIds: string[], overrides: Partial<CalendarEvent> = {}) {
  const [start, end] = hours;
  return makeEvent({
    id,
    title,
    start: `${exampleDate}T${start}:00-08:00`,
    end: `${exampleDate}T${end}:00-08:00`,
    resourceIds,
    ...overrides,
  });
}

export const exampleEvents: CalendarEvent[] = [
  booking("standup", "Standup", ["09:00", "09:30"], ["atlas"], { calendarId: "team" }),
  booking("crit", "Design crit", ["10:00", "11:00"], ["atlas", "sam"]),
  booking("hiring", "Hiring sync", ["10:00", "11:30"], ["atlas"], { calendarId: "team" }),
  booking("vendor", "Vendor call", ["10:15", "11:00"], ["atlas"]),
  booking("review", "Brand review", ["10:30", "11:30"], ["atlas"], { calendarId: "team" }),
  booking("intro", "Intro call", ["10:30", "11:00"], ["atlas"]),
  booking("workshop", "Research workshop with the product, design and research leads", ["13:00", "15:30"], ["cove"]),
  booking("demo", "Customer demo", ["14:00", "15:00"], ["borealis", "projector"]),
  booking("service", "Projector service", ["08:00", "09:00"], ["projector"], { calendarId: "facilities" }),
  booking("focus", "Focus time", ["15:30", "17:00"], ["sam"], { calendarId: "team" }),
];
