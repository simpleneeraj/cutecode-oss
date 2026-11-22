import { describe, expect, it } from "vitest";
import { instantAt, makeCalendar, makeOccurrence, makeSettings, testZones } from "../../testing";
import { Attendance, ChangeSource } from "../../types";
import {
  attendeesOf,
  draftOf,
  editedEventValues,
  newEventValues,
  occurrenceTiming,
  quickEventSchema,
  slotTiming,
  writableCalendars,
} from "./schema";

const settings = makeSettings();
const calendars = [
  makeCalendar({ id: "holidays", readOnly: true }),
  makeCalendar({ id: "hidden", visible: false }),
  makeCalendar({ id: "work" }),
];
const slot = { start: instantAt("2026-11-19", "13:00"), end: instantAt("2026-11-19", "14:00"), allDay: false };

describe("quickEventSchema", () => {
  it("needs a title and trims it", () => {
    const values = { title: "  ", calendarId: "work", place: "", invitees: [], recurrence: null };
    expect(quickEventSchema.safeParse(values).success).toBe(false);
    expect(quickEventSchema.parse({ ...values, title: " Lunch " }).title).toBe("Lunch");
  });
});

describe("newEventValues", () => {
  it("starts on the first writable calendar", () => {
    expect(writableCalendars(calendars).map((calendar) => calendar.id)).toEqual(["work"]);
    expect(newEventValues(slot, calendars).calendarId).toBe("work");
    expect(newEventValues({ ...slot, calendarId: "team" }, calendars).calendarId).toBe("team");
  });
});

describe("slotTiming", () => {
  it("writes zoned date times for a timed slot", () => {
    expect(slotTiming(slot, settings)).toMatchObject({
      start: "2026-11-19T13:00:00-08:00",
      end: "2026-11-19T14:00:00-08:00",
      allDay: false,
      timeZone: testZones.losAngeles,
    });
  });

  it("writes plain dates for an all-day slot", () => {
    const allDay = { start: instantAt("2026-11-20", "00:00"), end: instantAt("2026-11-21", "00:00"), allDay: true };
    expect(slotTiming(allDay, settings)).toMatchObject({ start: "2026-11-20", end: "2026-11-21", allDay: true });
  });
});

describe("attendeesOf", () => {
  it("keeps known answers and the organizer, and invites the rest", () => {
    const existing = [
      { id: "me", name: "Me", attendance: Attendance.Accepted, organizer: true },
      { id: "ana", name: "Ana", attendance: Attendance.Accepted },
    ];
    expect(attendeesOf(["Ana", "Sam Lee"], existing)).toEqual([
      existing[0],
      existing[1],
      { id: "invitee-sam-lee", name: "Sam Lee", attendance: Attendance.Pending },
    ]);
  });
});

describe("draftOf", () => {
  it("builds a new event draft without empty fields", () => {
    const values = { title: "Lunch", calendarId: "work", place: "", invitees: [], recurrence: null };
    expect(draftOf(values, slotTiming(slot, settings), null)).toEqual({
      eventId: undefined,
      originalStart: undefined,
      calendarId: "work",
      title: "Lunch",
      start: "2026-11-19T13:00:00-08:00",
      end: "2026-11-19T14:00:00-08:00",
      allDay: false,
      timeZone: testZones.losAngeles,
      location: undefined,
      attendees: undefined,
      source: ChangeSource.Form,
    });
  });

  it("keeps the event id and times when editing", () => {
    const occurrence = makeOccurrence({ location: "Atlas" });
    const values = editedEventValues(occurrence);
    const draft = draftOf({ ...values, title: "Crit" }, occurrenceTiming(occurrence, settings), occurrence);
    expect(draft).toMatchObject({
      eventId: "design-crit",
      originalStart: occurrence.originalStart,
      title: "Crit",
      location: "Atlas",
      start: occurrence.event.start,
    });
  });
});
