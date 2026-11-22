import { eachDate, weekdayOf } from "@cutecode/calendar/time";
import { makeAllDayEvent, makeCalendar, makeEvent, testZones } from "@cutecode/calendar/testing";
import { CalendarTone, Weekday, type Calendar, type CalendarEvent, type PlainDate } from "@cutecode/calendar/types";

import type { YearOptions } from "./props";

export const exampleDate = "2026-11-18";

export const exampleCalendars: Calendar[] = [
  makeCalendar(),
  makeCalendar({ id: "team", name: "Team", tone: CalendarTone.Ink }),
  makeCalendar({ id: "personal", name: "Personal", tone: CalendarTone.Grey }),
];

export const exampleOptions: YearOptions = {
  locale: "en-US",
  timeZone: testZones.losAngeles,
  now: "2026-11-18T14:20",
};

const busyMonths = new Set([2, 9]);

const hours = ["09:00", "10:30", "13:00", "15:00", "16:30"];

function busyCount(date: PlainDate, index: number): number {
  const month = Number(date.slice(5, 7)) - 1;
  const weekday = weekdayOf(date);
  const isWeekend = weekday === Weekday.Saturday || weekday === Weekday.Sunday;
  const seed = (index * 31 + month * 17) % 11;
  const boost = busyMonths.has(month) ? 2 : 0;
  return Math.max(0, Math.min(hours.length, Math.round(seed / 3) + boost - (isWeekend ? 3 : 0)));
}

function eventsOn(date: PlainDate, index: number): CalendarEvent[] {
  return hours.slice(0, busyCount(date, index)).map((hour, slot) =>
    makeEvent({
      id: `${date}-${slot}`,
      title: `Meeting ${slot + 1}`,
      calendarId: slot % 2 === 0 ? "work" : "team",
      start: `${date}T${hour}:00-08:00`,
      end: `${date}T${hour.slice(0, 2)}:45:00-08:00`,
    }),
  );
}

export const exampleEvents: CalendarEvent[] = [
  ...eachDate({ start: "2026-01-01", end: "2027-01-01" }).flatMap(eventsOn),
  makeAllDayEvent("2026-07-06", "2026-07-11", { id: "summer", title: "Summer trip", calendarId: "personal" }),
];
