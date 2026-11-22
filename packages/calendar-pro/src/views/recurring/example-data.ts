import type { TimeGridOptions } from "@cutecode/calendar/week";
import { makeAllDayEvent, makeCalendar, makeEvent, testZones } from "@cutecode/calendar/testing";
import { formatDateTime, toInstant } from "@cutecode/calendar/time";
import {
  CalendarTone,
  Frequency,
  Weekday,
  type Calendar,
  type CalendarEvent,
  type Instant,
  type PlainDate,
} from "@cutecode/calendar/types";

export const exampleDate = "2026-11-18";

export const exampleNow: Instant = toInstant({ date: exampleDate, minute: 10 * 60 + 20 }, testZones.losAngeles);

export const exampleCalendars: Calendar[] = [
  makeCalendar(),
  makeCalendar({ id: "team", name: "Team", tone: CalendarTone.Ink }),
  makeCalendar({ id: "personal", name: "Personal", tone: CalendarTone.Grey }),
];

export const exampleOptions: TimeGridOptions = {
  locale: "en-US",
  timeZone: testZones.losAngeles,
  workingHours: { start: "09:00", end: "17:00" },
  shownHours: { start: "08:00", end: "20:00" },
  viewerId: "me",
  now: "2026-11-18T10:20",
};

const workWeek = [Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday, Weekday.Thursday, Weekday.Friday];

function at(date: PlainDate, hour: number, minute = 0): string {
  return formatDateTime(toInstant({ date, minute: hour * 60 + minute }, testZones.losAngeles), testZones.losAngeles);
}

const standup = makeEvent({
  id: "standup",
  title: "Standup",
  calendarId: "team",
  start: at("2026-11-02", 9),
  end: at("2026-11-02", 9, 15),
  recurrence: { frequency: Frequency.Weekly, interval: 1, byWeekday: workWeek },
});

const lateStandup = makeEvent({
  id: "standup@thursday",
  title: "Standup",
  calendarId: "team",
  start: at("2026-11-19", 9, 30),
  end: at("2026-11-19", 9, 45),
  seriesId: "standup",
  originalStart: at("2026-11-19", 9),
});

export const exampleEvents: CalendarEvent[] = [
  standup,
  lateStandup,
  makeEvent({
    id: "review",
    title: "Weekly review",
    start: at("2026-11-06", 14),
    end: at("2026-11-06", 15),
    recurrence: { frequency: Frequency.Weekly, interval: 1, byWeekday: [Weekday.Friday] },
  }),
  makeEvent({
    id: "one-on-one",
    title: "1:1 with Sam",
    calendarId: "team",
    start: at("2026-11-03", 11),
    end: at("2026-11-03", 11, 30),
    recurrence: { frequency: Frequency.Weekly, interval: 2, byWeekday: [Weekday.Tuesday] },
  }),
  makeEvent({
    id: "gym",
    title: "Gym",
    calendarId: "personal",
    start: at("2026-11-02", 18),
    end: at("2026-11-02", 19),
    recurrence: { frequency: Frequency.Weekly, interval: 1, byWeekday: [Weekday.Monday, Weekday.Wednesday], count: 12 },
  }),
  makeEvent({ id: "crit", title: "Design crit", start: at("2026-11-19", 13), end: at("2026-11-19", 14), location: "Atlas" }),
  makeAllDayEvent("2026-11-20", "2026-11-21", {
    id: "payroll",
    title: "Payroll",
    calendarId: "personal",
    recurrence: { frequency: Frequency.Weekly, interval: 2, byWeekday: [Weekday.Friday] },
  }),
];
