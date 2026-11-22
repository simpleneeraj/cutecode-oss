import { makeCalendar, makeEvent, testZones } from "@cutecode/calendar/testing";
import { eachDate, weekdayOf } from "@cutecode/calendar/time";
import { CalendarTone, Weekday, type Calendar, type CalendarEvent, type PlainDate } from "@cutecode/calendar/types";

import { HeatLook } from "./model";
import type { HeatMonthOptions } from "./props";

export enum HeatExampleState {
  Count = "count",
  Heat = "heat",
  Quiet = "quiet",
  Loading = "loading",
}

export const heatExampleStates = [
  { kind: HeatExampleState.Count, label: "Count" },
  { kind: HeatExampleState.Heat, label: "Heat" },
  { kind: HeatExampleState.Quiet, label: "Quiet month" },
  { kind: HeatExampleState.Loading, label: "Loading" },
];

export const heatExampleCopy = {
  states: "Heat month state",
};

export const heatExampleDate = "2026-11-18";

export const heatExampleCalendars: Calendar[] = [
  makeCalendar(),
  makeCalendar({ id: "team", name: "Team", tone: CalendarTone.Ink }),
];

const hours = ["09", "11", "13", "15", "17"];

function countOn(date: PlainDate, index: number): number {
  const weekday = weekdayOf(date);
  const isWeekend = weekday === Weekday.Saturday || weekday === Weekday.Sunday;
  const seed = (index * 7 + 3) % 6;
  return isWeekend ? 0 : Math.min(hours.length, seed);
}

function eventsOn(date: PlainDate, index: number): CalendarEvent[] {
  return hours.slice(0, countOn(date, index)).map((hour, slot) =>
    makeEvent({
      id: `${date}-${hour}`,
      title: "Busy",
      calendarId: slot % 2 === 0 ? "work" : "team",
      start: `${date}T${hour}:00:00-08:00`,
      end: `${date}T${hour}:45:00-08:00`,
    }),
  );
}

export const heatExampleEvents: CalendarEvent[] = eachDate({ start: "2026-11-01", end: "2026-12-01" }).flatMap(
  eventsOn,
);

const baseOptions = { locale: "en-US", timeZone: testZones.losAngeles, now: "2026-11-18T09:40" };

export function heatExampleProps(state: HeatExampleState) {
  const look = state === HeatExampleState.Heat ? HeatLook.Heat : HeatLook.Count;
  const options: HeatMonthOptions = { ...baseOptions, look };
  const events = state === HeatExampleState.Quiet ? [] : heatExampleEvents;
  return { options, data: { events, calendars: heatExampleCalendars }, loading: state === HeatExampleState.Loading };
}
