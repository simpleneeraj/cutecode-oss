import { describe, expect, it } from "vitest";
import { coveredDates, occurrenceOf } from "../../event";
import { instantAt, makeAllDayEvent, makeOccurrence, testZones } from "../../testing";
import { OccurrenceKind, type EventOccurrence } from "../../types";
import { isShortTimed } from "../timed";
import { isSpanning } from ".";

const zone = testZones.losAngeles;
function allDay(id: string, start: string, end: string): EventOccurrence {
  return occurrenceOf(makeAllDayEvent(start, end, { id }));
}

function timedSpan(id: string, start: string, end: string, timeZone: string = zone): EventOccurrence {
  return makeOccurrence({ id, start, end, timeZone });
}

describe("isSpanning", () => {
  it("treats every all-day occurrence as spanning", () => {
    expect(isSpanning(allDay("trip", "2026-11-18", "2026-11-19"), zone)).toBe(true);
  });

  it("treats a short timed event as not spanning", () => {
    expect(isSpanning(makeOccurrence(), zone)).toBe(false);
  });

  it("treats a timed event of exactly 24 hours as spanning", () => {
    const occurrence = timedSpan("day", "2026-11-18T10:00:00-08:00", "2026-11-19T10:00:00-08:00");
    expect(isSpanning(occurrence, zone)).toBe(true);
  });

  it("keeps a 23 hour 59 minute event crossing midnight as timed", () => {
    const occurrence = timedSpan("night", "2026-11-18T10:00:00-08:00", "2026-11-19T09:59:00-08:00");
    expect(isSpanning(occurrence, zone)).toBe(false);
  });

  it("keeps 00:00 to 23:00 on the 25 hour fall day as timed, though it lasts 24 hours", () => {
    const occurrence = timedSpan("fall", "2026-11-01T00:00:00-07:00", "2026-11-01T23:00:00-08:00");
    expect(occurrence.kind === OccurrenceKind.Timed && occurrence.end - occurrence.start).toBe(24 * 60 * 60 * 1000);
    expect(isSpanning(occurrence, zone)).toBe(false);
  });

  it("makes midnight to midnight on the 25 hour fall day spanning", () => {
    const occurrence = timedSpan("fall", "2026-11-01T00:00:00-07:00", "2026-11-02T00:00:00-08:00");
    expect(isSpanning(occurrence, zone)).toBe(true);
  });

  it("makes midnight to midnight on the 23 hour spring day spanning one date", () => {
    const occurrence = timedSpan("spring", "2026-03-08T00:00:00-08:00", "2026-03-09T00:00:00-07:00");
    expect(isSpanning(occurrence, zone)).toBe(true);
    expect(coveredDates(occurrence, zone)).toEqual({ start: "2026-03-08", end: "2026-03-09" });
  });

  it("judges spanning by the wall clock of the zone it is given", () => {
    const occurrence = timedSpan("spring", "2026-03-08T00:00:00-08:00", "2026-03-09T00:00:00-07:00");
    expect(isSpanning(occurrence, testZones.utc)).toBe(false);
  });

  it("is the exact complement of isShortTimed for timed events", () => {
    const samples = [
      timedSpan("a", "2026-03-08T00:00:00-08:00", "2026-03-09T00:00:00-07:00"),
      timedSpan("b", "2026-11-01T00:30:00-07:00", "2026-11-01T23:45:00-08:00"),
      timedSpan("c", "2026-11-18T10:00:00-08:00", "2026-11-19T10:00:00-08:00"),
      timedSpan("d", "2026-11-18T10:00:00-08:00", "2026-11-18T11:00:00-08:00"),
    ];
    expect(samples.map((sample) => isSpanning(sample, zone))).toEqual(
      samples.map((sample) => !isShortTimed(sample, zone)),
    );
  });

  it("treats 24 elapsed hours from midnight on the spring day as spanning two dates", () => {
    const occurrence = timedSpan("spring", "2026-03-08T00:00:00-08:00", "2026-03-09T01:00:00-07:00");
    expect(isSpanning(occurrence, zone)).toBe(true);
    expect(coveredDates(occurrence, zone)).toEqual({ start: "2026-03-08", end: "2026-03-10" });
  });
});

describe("coveredDates", () => {
  it("keeps the all-day end exclusive", () => {
    expect(coveredDates(allDay("trip", "2026-11-20", "2026-11-23"), zone)).toEqual({
      start: "2026-11-20",
      end: "2026-11-23",
    });
  });

  it("gives an empty all-day event one day", () => {
    expect(coveredDates(allDay("trip", "2026-11-20", "2026-11-20"), zone)).toEqual({
      start: "2026-11-20",
      end: "2026-11-21",
    });
  });

  it("covers every date a timed span touches", () => {
    const occurrence = timedSpan("summit", "2026-11-18T10:00:00-08:00", "2026-11-20T09:00:00-08:00");
    expect(coveredDates(occurrence, zone)).toEqual({ start: "2026-11-18", end: "2026-11-21" });
  });

  it("does not cover the next date when a timed span ends at midnight", () => {
    const occurrence = timedSpan("day", "2026-11-18T00:00:00-08:00", "2026-11-19T00:00:00-08:00");
    expect(coveredDates(occurrence, zone)).toEqual({ start: "2026-11-18", end: "2026-11-19" });
  });

  it("reads dates in the view zone, not the event zone", () => {
    const occurrence = timedSpan("summit", "2026-11-18T10:00:00-08:00", "2026-11-19T10:00:00-08:00");
    expect(coveredDates(occurrence, testZones.tokyo)).toEqual({ start: "2026-11-19", end: "2026-11-21" });
  });

  it("keeps the 25 hour fall day as one date", () => {
    const occurrence = timedSpan("fall", "2026-11-01T00:00:00-07:00", "2026-11-02T00:00:00-08:00");
    expect(coveredDates(occurrence, zone)).toEqual({ start: "2026-11-01", end: "2026-11-02" });
  });

  it("keeps the 23 hour spring day as one date in Chatham", () => {
    const occurrence = timedSpan("spring", "2026-09-27T00:00:00+12:45", "2026-09-28T00:00:00+13:45", testZones.chatham);
    expect(occurrence.kind === OccurrenceKind.Timed && occurrence.end - occurrence.start).toBe(
      instantAt("2026-09-28", "00:00", testZones.chatham) - instantAt("2026-09-27", "00:00", testZones.chatham),
    );
    expect(isSpanning(occurrence, zone)).toBe(false);
    expect(coveredDates(occurrence, testZones.chatham)).toEqual({ start: "2026-09-27", end: "2026-09-28" });
  });
});
