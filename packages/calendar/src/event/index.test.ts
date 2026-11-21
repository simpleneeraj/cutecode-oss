import { describe, expect, it } from "vitest";
import { makeAllDayEvent, makeCalendar, makeEvent, testZones } from "../testing";
import { OccurrenceKind } from "../types";
import { isEventReadOnly, occurrenceInterval, occurrenceOf, occurrencesInRange, overlapsRange, visibleEvents } from ".";

const november18 = { start: Date.UTC(2026, 10, 18, 8), end: Date.UTC(2026, 10, 19, 8) };

describe("events", () => {
  it("resolves timed and all-day occurrences", () => {
    const timed = occurrenceOf(makeEvent());
    expect(timed.kind).toBe(OccurrenceKind.Timed);
    expect(occurrenceInterval(timed, testZones.utc)).toEqual({
      start: Date.UTC(2026, 10, 18, 18),
      end: Date.UTC(2026, 10, 18, 19),
    });
    const trip = occurrenceOf(makeAllDayEvent("2026-11-20", "2026-11-23"));
    expect(occurrenceInterval(trip, testZones.losAngeles)).toEqual({
      start: Date.UTC(2026, 10, 20, 8),
      end: Date.UTC(2026, 10, 23, 8),
    });
  });

  it("gives an empty all-day span one day", () => {
    const empty = occurrenceOf(makeAllDayEvent("2026-11-18", "2026-11-18"));
    expect(occurrenceInterval(empty, testZones.losAngeles)).toEqual(november18);
  });

  it("keys exceptions by their series", () => {
    const exception = makeEvent({ id: "x1", seriesId: "standup", originalStart: "2026-11-18T09:00:00-08:00" });
    expect(occurrenceOf(exception).key).toBe("standup@2026-11-18T09:00:00-08:00");
  });

  it("keeps zero minute markers inside a range", () => {
    expect(overlapsRange({ start: november18.start, end: november18.start }, november18)).toBe(true);
    expect(overlapsRange({ start: november18.end, end: november18.end }, november18)).toBe(false);
    expect(overlapsRange({ start: november18.start - 1, end: november18.start }, november18)).toBe(false);
  });

  it("filters to the range and visible calendars", () => {
    const events = [
      makeEvent(),
      makeEvent({ id: "late", start: "2026-11-19T10:00:00-08:00", end: "2026-11-19T11:00:00-08:00" }),
    ];
    const found = occurrencesInRange(events, {
      range: november18,
      dates: { start: "2026-11-18", end: "2026-11-19" },
      timeZone: testZones.losAngeles,
    });
    expect(found.map((occurrence) => occurrence.event.id)).toEqual(["design-crit"]);
    const calendars = [makeCalendar(), makeCalendar({ id: "family", visible: false, readOnly: true })];
    expect(visibleEvents([makeEvent(), makeEvent({ calendarId: "family" })], calendars)).toHaveLength(1);
    expect(isEventReadOnly(makeEvent({ calendarId: "family" }), calendars)).toBe(true);
    expect(isEventReadOnly(makeEvent(), calendars)).toBe(false);
  });
});
