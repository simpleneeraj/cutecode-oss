import { describe, expect, it } from "vitest";
import { occurrenceOf } from "../event";
import { makeAllDayEvent, makeCalendar, makeEvent, makeOccurrence, makeSettings, testZones } from "../testing";
import { EventStatus } from "../types";
import { eventAccessibleName } from "./phrases";

const settings = makeSettings();
const writable = makeCalendar();
const holidays = makeCalendar({ id: "holidays", name: "US holidays", readOnly: true });

describe("eventAccessibleName", () => {
  it("names title, day and time on a writable calendar", () => {
    expect(eventAccessibleName(makeOccurrence(), writable, settings)).toBe(
      "Design crit, Wednesday, November 18, 10 AM to 11 AM",
    );
  });

  it("adds the place and read only", () => {
    const occurrence = makeOccurrence({ location: "Room A, 4th floor", calendarId: "holidays" });
    expect(eventAccessibleName(occurrence, holidays, settings)).toBe(
      "Design crit, Wednesday, November 18, 10 AM to 11 AM, Room A, 4th floor, read only",
    );
  });

  it("keeps a long title whole", () => {
    const title = "Quarterly planning review with the whole design and engineering group and guests";
    expect(eventAccessibleName(makeOccurrence({ title }), writable, settings).startsWith(`${title}, `)).toBe(true);
  });

  it("treats an unknown calendar as read only", () => {
    expect(eventAccessibleName(makeOccurrence(), undefined, settings)).toMatch(/, read only$/);
  });

  it("names the status when it is not confirmed", () => {
    const occurrence = makeOccurrence({ status: EventStatus.Tentative });
    expect(eventAccessibleName(occurrence, writable, settings)).toBe(
      "Design crit, Wednesday, November 18, 10 AM to 11 AM, tentative",
    );
  });

  it("says all day for a one-day all-day event", () => {
    const occurrence = occurrenceOf(makeAllDayEvent("2026-11-26", "2026-11-27", { title: "Thanksgiving" }));
    expect(eventAccessibleName(occurrence, holidays, settings)).toBe(
      "Thanksgiving, Thursday, November 26, all day, read only",
    );
  });

  it("names the first and last day of a multi-day all-day event", () => {
    const occurrence = occurrenceOf(makeAllDayEvent("2026-11-20", "2026-11-23"));
    expect(eventAccessibleName(occurrence, writable, settings)).toBe(
      "Trip, Friday, November 20 to Sunday, November 22, all day",
    );
  });

  it("names both days when an event crosses midnight", () => {
    const occurrence = makeOccurrence({ start: "2026-11-17T23:00:00-08:00", end: "2026-11-18T01:30:00-08:00" });
    expect(eventAccessibleName(occurrence, writable, settings)).toBe(
      "Design crit, Tuesday, November 17, 11 PM to Wednesday, November 18, 1:30 AM",
    );
  });

  it("keeps an event that ends at midnight on one day", () => {
    const occurrence = makeOccurrence({ start: "2026-11-18T22:00:00-08:00", end: "2026-11-19T00:00:00-08:00" });
    expect(eventAccessibleName(occurrence, writable, settings)).toBe(
      "Design crit, Wednesday, November 18, 10 PM to 12 AM",
    );
  });

  it("keeps an event that ends at a skipped midnight on one day", () => {
    const santiago = makeSettings({ timeZone: testZones.santiago });
    const occurrence = makeOccurrence({ start: "2026-09-05T22:00:00-04:00", end: "2026-09-06T01:00:00-03:00" });
    expect(eventAccessibleName(occurrence, writable, santiago)).toBe(
      "Design crit, Saturday, September 5, 10 PM to 1 AM",
    );
  });

  it("names only the start of a zero-minute marker", () => {
    const occurrence = makeOccurrence({ title: "Deadline", end: "2026-11-18T10:00:00-08:00" });
    expect(eventAccessibleName(occurrence, writable, settings)).toBe("Deadline, Wednesday, November 18, 10 AM");
  });

  it("shows a five-minute event with its true times", () => {
    const occurrence = occurrenceOf(makeEvent({ end: "2026-11-18T10:05:00-08:00" }));
    expect(eventAccessibleName(occurrence, writable, settings)).toBe(
      "Design crit, Wednesday, November 18, 10 AM to 10:05 AM",
    );
  });
});
