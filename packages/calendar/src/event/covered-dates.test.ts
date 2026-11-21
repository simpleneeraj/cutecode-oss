import { describe, expect, it } from "vitest";
import { dstTransitions2026, instantAt, makeAllDayEvent, makeOccurrence, testZones } from "../testing";
import { addDays, formatDateTime } from "../time";
import { coveredDates, occurrenceOf } from ".";

const zone = testZones.losAngeles;

describe("coveredDates", () => {
  it("covers one day for a same-day event", () => {
    expect(coveredDates(makeOccurrence(), zone)).toEqual({ start: "2026-11-18", end: "2026-11-19" });
  });

  it("covers both days for an event crossing midnight", () => {
    const overnight = makeOccurrence({ start: "2026-11-17T22:00:00-08:00", end: "2026-11-18T02:00:00-08:00" });
    expect(coveredDates(overnight, zone)).toEqual({ start: "2026-11-17", end: "2026-11-19" });
  });

  it("does not spill into the next day when an event ends at midnight", () => {
    const evening = makeOccurrence({ start: "2026-11-18T22:00:00-08:00", end: "2026-11-19T00:00:00-08:00" });
    expect(coveredDates(evening, zone)).toEqual({ start: "2026-11-18", end: "2026-11-19" });
  });

  it("covers the start day for a zero minute marker", () => {
    const marker = makeOccurrence({ end: "2026-11-18T10:00:00-08:00" });
    expect(coveredDates(marker, zone)).toEqual({ start: "2026-11-18", end: "2026-11-19" });
  });

  it("keeps the exclusive end of an all-day span", () => {
    const trip = occurrenceOf(makeAllDayEvent("2026-11-20", "2026-11-23"));
    expect(coveredDates(trip, zone)).toEqual({ start: "2026-11-20", end: "2026-11-23" });
  });

  it("widens an empty all-day span to one day", () => {
    const empty = occurrenceOf(makeAllDayEvent("2026-11-20", "2026-11-20"));
    expect(coveredDates(empty, zone)).toEqual({ start: "2026-11-20", end: "2026-11-21" });
  });

  it("widens an inverted all-day span to its start day", () => {
    const inverted = occurrenceOf(makeAllDayEvent("2026-11-20", "2026-11-18"));
    expect(coveredDates(inverted, zone)).toEqual({ start: "2026-11-20", end: "2026-11-21" });
  });

  it("covers the start day for a timed event that ends before it starts", () => {
    const inverted = makeOccurrence({ start: "2026-11-18T10:00:00-08:00", end: "2026-11-16T09:00:00-08:00" });
    expect(coveredDates(inverted, zone)).toEqual({ start: "2026-11-18", end: "2026-11-19" });
  });

  it("covers every date of a multi-day timed event", () => {
    const summit = makeOccurrence({ start: "2026-11-18T10:00:00-08:00", end: "2026-11-20T09:00:00-08:00" });
    expect(coveredDates(summit, zone)).toEqual({ start: "2026-11-18", end: "2026-11-21" });
  });

  it("reads dates in the view zone", () => {
    const crit = makeOccurrence({ start: "2026-11-18T17:00:00-08:00", end: "2026-11-18T18:00:00-08:00" });
    expect(coveredDates(crit, testZones.tokyo)).toEqual({ start: "2026-11-19", end: "2026-11-20" });
    expect(coveredDates(crit, testZones.kathmandu)).toEqual({ start: "2026-11-19", end: "2026-11-20" });
  });

  it.each(dstTransitions2026)("covers one day for a full DST day in $timeZone on $date", (transition) => {
    const start = formatDateTime(instantAt(transition.date, "00:00", transition.timeZone), transition.timeZone);
    const nextDay = addDays(transition.date, 1);
    const end = formatDateTime(instantAt(nextDay, "00:00", transition.timeZone), transition.timeZone);
    const wholeDay = makeOccurrence({ start, end, timeZone: transition.timeZone });
    expect(coveredDates(wholeDay, transition.timeZone)).toEqual({ start: transition.date, end: nextDay });
  });
});
