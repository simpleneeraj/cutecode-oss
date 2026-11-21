import { describe, expect, it } from "vitest";
import { occurrenceOf } from "../event";
import { makeAllDayEvent, makeOccurrence, testZones } from "../testing";
import { sortOccurrences } from ".";

const zone = testZones.losAngeles;

function keysOf(occurrences: ReturnType<typeof sortOccurrences>): string[] {
  return occurrences.map((occurrence) => occurrence.event.id);
}

describe("sortOccurrences", () => {
  it("puts all-day occurrences first, then time order", () => {
    const late = makeOccurrence({ id: "late", start: "2026-11-18T15:00:00-08:00", end: "2026-11-18T16:00:00-08:00" });
    const early = makeOccurrence({ id: "early", start: "2026-11-18T08:00:00-08:00", end: "2026-11-18T09:00:00-08:00" });
    const trip = occurrenceOf(makeAllDayEvent("2026-11-18", "2026-11-19", { id: "trip" }));
    expect(keysOf(sortOccurrences([late, trip, early], zone))).toEqual(["trip", "early", "late"]);
  });

  it("orders equal starts longest first", () => {
    const short = makeOccurrence({ id: "short", end: "2026-11-18T10:30:00-08:00" });
    const long = makeOccurrence({ id: "long", end: "2026-11-18T12:00:00-08:00" });
    const marker = makeOccurrence({ id: "marker", end: "2026-11-18T10:00:00-08:00" });
    expect(keysOf(sortOccurrences([marker, short, long], zone))).toEqual(["long", "short", "marker"]);
  });

  it("orders all-day occurrences by start, then longest first", () => {
    const week = occurrenceOf(makeAllDayEvent("2026-11-16", "2026-11-23", { id: "week" }));
    const day = occurrenceOf(makeAllDayEvent("2026-11-16", "2026-11-17", { id: "day" }));
    const later = occurrenceOf(makeAllDayEvent("2026-11-17", "2026-11-30", { id: "later" }));
    expect(keysOf(sortOccurrences([later, day, week], zone))).toEqual(["week", "day", "later"]);
  });

  it("breaks full ties by title then key so the order is stable", () => {
    const beta = makeOccurrence({ id: "b", title: "Beta" });
    const alpha = makeOccurrence({ id: "a", title: "Alpha" });
    const alphaTwin = makeOccurrence({ id: "c", title: "Alpha" });
    expect(keysOf(sortOccurrences([beta, alphaTwin, alpha], zone))).toEqual(["a", "c", "b"]);
    expect(keysOf(sortOccurrences([alpha, alphaTwin, beta], zone))).toEqual(["a", "c", "b"]);
  });

  it("compares instants, not wall clocks, across zones", () => {
    const tokyo = makeOccurrence({
      id: "tokyo",
      timeZone: testZones.tokyo,
      start: "2026-11-19T02:30:00+09:00",
      end: "2026-11-19T03:00:00+09:00",
    });
    const losAngeles = makeOccurrence({ id: "la" });
    expect(keysOf(sortOccurrences([losAngeles, tokyo], zone))).toEqual(["tokyo", "la"]);
  });

  it("does not mutate the input and handles an empty list", () => {
    const second = makeOccurrence({
      id: "second",
      start: "2026-11-18T12:00:00-08:00",
      end: "2026-11-18T13:00:00-08:00",
    });
    const first = makeOccurrence({ id: "first" });
    const input = [second, first];
    sortOccurrences(input, zone);
    expect(keysOf(input)).toEqual(["second", "first"]);
    expect(sortOccurrences([], zone)).toEqual([]);
  });

  it("ties titles by code unit order so the result does not depend on the host locale", () => {
    const lowerAlpha = makeOccurrence({ id: "lower", title: "alpha" });
    const upperBeta = makeOccurrence({ id: "upper", title: "Beta" });
    const umlaut = makeOccurrence({ id: "umlaut", title: "\u00c4pfel" });
    const zebra = makeOccurrence({ id: "zebra", title: "Zebra" });
    const expected = ["upper", "zebra", "lower", "umlaut"];
    expect(keysOf(sortOccurrences([umlaut, lowerAlpha, zebra, upperBeta], zone))).toEqual(expected);
    expect(keysOf(sortOccurrences([upperBeta, zebra, umlaut, lowerAlpha], zone))).toEqual(expected);
  });
});
