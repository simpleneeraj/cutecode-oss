import { occurrenceOf } from "../event";
import { parseClockTime, toInstant } from "../time";
import {
  CalendarTone,
  EventStatus,
  HourCycle,
  Weekday,
  type Calendar,
  type CalendarEvent,
  type ClockTime,
  type EventOccurrence,
  type Instant,
  type PlainDate,
  type Resource,
  ResourceKind,
  type ViewSettings,
} from "../types";

export enum TransitionKind {
  Spring = "spring",
  Fall = "fall",
}

export type DstTransition = {
  timeZone: string;
  kind: TransitionKind;
  date: PlainDate;
  dayMinutes: number;
};

export const testZones = {
  losAngeles: "America/Los_Angeles",
  newYork: "America/New_York",
  stJohns: "America/St_Johns",
  santiago: "America/Santiago",
  london: "Europe/London",
  berlin: "Europe/Berlin",
  kolkata: "Asia/Kolkata",
  kathmandu: "Asia/Kathmandu",
  tokyo: "Asia/Tokyo",
  sydney: "Australia/Sydney",
  chatham: "Pacific/Chatham",
  utc: "UTC",
};

export const dstTransitions2026: DstTransition[] = [
  { timeZone: testZones.losAngeles, kind: TransitionKind.Spring, date: "2026-03-08", dayMinutes: 1380 },
  { timeZone: testZones.losAngeles, kind: TransitionKind.Fall, date: "2026-11-01", dayMinutes: 1500 },
  { timeZone: testZones.newYork, kind: TransitionKind.Spring, date: "2026-03-08", dayMinutes: 1380 },
  { timeZone: testZones.newYork, kind: TransitionKind.Fall, date: "2026-11-01", dayMinutes: 1500 },
  { timeZone: testZones.stJohns, kind: TransitionKind.Spring, date: "2026-03-08", dayMinutes: 1380 },
  { timeZone: testZones.stJohns, kind: TransitionKind.Fall, date: "2026-11-01", dayMinutes: 1500 },
  { timeZone: testZones.santiago, kind: TransitionKind.Fall, date: "2026-04-04", dayMinutes: 1500 },
  { timeZone: testZones.santiago, kind: TransitionKind.Spring, date: "2026-09-06", dayMinutes: 1380 },
  { timeZone: testZones.london, kind: TransitionKind.Spring, date: "2026-03-29", dayMinutes: 1380 },
  { timeZone: testZones.london, kind: TransitionKind.Fall, date: "2026-10-25", dayMinutes: 1500 },
  { timeZone: testZones.berlin, kind: TransitionKind.Spring, date: "2026-03-29", dayMinutes: 1380 },
  { timeZone: testZones.berlin, kind: TransitionKind.Fall, date: "2026-10-25", dayMinutes: 1500 },
  { timeZone: testZones.sydney, kind: TransitionKind.Fall, date: "2026-04-05", dayMinutes: 1500 },
  { timeZone: testZones.sydney, kind: TransitionKind.Spring, date: "2026-10-04", dayMinutes: 1380 },
  { timeZone: testZones.chatham, kind: TransitionKind.Fall, date: "2026-04-05", dayMinutes: 1500 },
  { timeZone: testZones.chatham, kind: TransitionKind.Spring, date: "2026-09-27", dayMinutes: 1380 },
];

export function makeCalendar(overrides: Partial<Calendar> = {}): Calendar {
  return { id: "work", name: "Work", tone: CalendarTone.Accent, readOnly: false, visible: true, ...overrides };
}

export function makeEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    id: "design-crit",
    calendarId: "work",
    title: "Design crit",
    start: "2026-11-18T10:00:00-08:00",
    end: "2026-11-18T11:00:00-08:00",
    allDay: false,
    timeZone: testZones.losAngeles,
    status: EventStatus.Confirmed,
    version: 1,
    updatedAt: "2026-11-01T00:00:00Z",
    ...overrides,
  };
}

export function makeAllDayEvent(
  start: PlainDate,
  end: PlainDate,
  overrides: Partial<CalendarEvent> = {},
): CalendarEvent {
  return makeEvent({ id: `all-day-${start}`, title: "Trip", start, end, allDay: true, ...overrides });
}

export function makeResource(overrides: Partial<Resource> = {}): Resource {
  return { id: "room-a", kind: ResourceKind.Room, name: "Room A", capacity: 8, ...overrides };
}

export function makeSettings(overrides: Partial<ViewSettings> = {}): ViewSettings {
  return {
    locale: "en-US",
    timeZone: testZones.losAngeles,
    weekStartsOn: Weekday.Sunday,
    hourCycle: HourCycle.Twelve,
    ...overrides,
  };
}

export function instantAt(date: PlainDate, clock: ClockTime, timeZone: string = testZones.losAngeles): Instant {
  return toInstant({ date, minute: parseClockTime(clock) }, timeZone);
}

export function makeOccurrence(overrides: Partial<CalendarEvent> = {}): EventOccurrence {
  return occurrenceOf(makeEvent(overrides));
}
