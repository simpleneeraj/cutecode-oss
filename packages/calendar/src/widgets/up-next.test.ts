import { describe, expect, it } from "vitest";
import { occurrenceOf } from "../event";
import { instantAt, makeAllDayEvent, makeOccurrence, testZones } from "../testing";
import { EventStatus } from "../types";
import { dayStatus, DayStatus, upNext } from "./up-next";

const zone = testZones.losAngeles;
const crit = makeOccurrence({ id: "crit", start: "2026-11-18T10:00:00-08:00", end: "2026-11-18T11:00:00-08:00" });
const standup = makeOccurrence({ id: "standup", start: "2026-11-18T09:00:00-08:00", end: "2026-11-18T09:15:00-08:00" });
const lunch = makeOccurrence({ id: "lunch", start: "2026-11-18T12:00:00-08:00", end: "2026-11-18T13:00:00-08:00" });
const review = makeOccurrence({
  id: "review",
  start: "2026-11-18T15:00:00-08:00",
  end: "2026-11-18T16:00:00-08:00",
  status: EventStatus.Cancelled,
});

function idsOf(occurrences: { event: { id: string } }[]): string[] {
  return occurrences.map((occurrence) => occurrence.event.id);
}

describe("upNext", () => {
  it("skips events that have ended and sorts by start", () => {
    const now = instantAt("2026-11-18", "09:30");
    expect(idsOf(upNext([lunch, review, standup, crit], now, 5, zone))).toEqual(["crit", "lunch", "review"]);
  });

  it("keeps an event that is in progress", () => {
    const now = instantAt("2026-11-18", "10:30");
    expect(idsOf(upNext([lunch, crit], now, 5, zone))).toEqual(["crit", "lunch"]);
  });

  it("drops an event that ends exactly now", () => {
    const now = instantAt("2026-11-18", "11:00");
    expect(idsOf(upNext([crit, lunch], now, 5, zone))).toEqual(["lunch"]);
  });

  it("keeps cancelled events listed in start order", () => {
    const now = instantAt("2026-11-18", "13:30");
    const upcoming = upNext([review, lunch], now, 5, zone);
    expect(idsOf(upcoming)).toEqual(["review"]);
    expect(upcoming[0]?.event.status).toBe(EventStatus.Cancelled);
  });

  it("returns at most count events", () => {
    const now = instantAt("2026-11-18", "08:00");
    expect(idsOf(upNext([lunch, crit, standup, review], now, 2, zone))).toEqual(["standup", "crit"]);
    expect(upNext([lunch], now, 0, zone)).toEqual([]);
    expect(upNext([lunch], now, -1, zone)).toEqual([]);
  });

  it("puts an all-day event in progress first", () => {
    const trip = occurrenceOf(makeAllDayEvent("2026-11-17", "2026-11-20", { id: "trip" }));
    const now = instantAt("2026-11-18", "09:30");
    expect(idsOf(upNext([crit, trip], now, 5, zone))).toEqual(["trip", "crit"]);
  });

  it("puts a timed event soon ahead of an all-day event days away", () => {
    const later = occurrenceOf(makeAllDayEvent("2026-11-21", "2026-11-22", { id: "later" }));
    const now = instantAt("2026-11-18", "09:30");
    expect(idsOf(upNext([later, crit], now, 1, zone))).toEqual(["crit"]);
    expect(idsOf(upNext([later, lunch, crit], now, 2, zone))).toEqual(["crit", "lunch"]);
  });

  it("puts an all-day event first only within its own day", () => {
    const holiday = occurrenceOf(makeAllDayEvent("2026-11-19", "2026-11-20", { id: "holiday" }));
    const tomorrowMorning = makeOccurrence({
      id: "tomorrow",
      start: "2026-11-19T08:00:00-08:00",
      end: "2026-11-19T09:00:00-08:00",
    });
    const now = instantAt("2026-11-18", "09:30");
    expect(idsOf(upNext([tomorrowMorning, holiday, lunch], now, 5, zone))).toEqual(["lunch", "holiday", "tomorrow"]);
  });

  it("places the start day by the view zone", () => {
    const tokyoHoliday = occurrenceOf(makeAllDayEvent("2026-11-19", "2026-11-20", { id: "holiday" }));
    const evening = makeOccurrence({
      id: "evening",
      start: "2026-11-18T18:00:00-08:00",
      end: "2026-11-18T19:00:00-08:00",
    });
    const now = instantAt("2026-11-18", "09:30");
    expect(idsOf(upNext([evening, tokyoHoliday], now, 5, zone))).toEqual(["evening", "holiday"]);
    expect(idsOf(upNext([evening, tokyoHoliday], now, 5, testZones.tokyo))).toEqual(["holiday", "evening"]);
  });

  it("keeps a zero length marker that starts now", () => {
    const marker = makeOccurrence({
      id: "marker",
      start: "2026-11-18T10:00:00-08:00",
      end: "2026-11-18T10:00:00-08:00",
    });
    expect(idsOf(upNext([marker], instantAt("2026-11-18", "10:00"), 5, zone))).toEqual(["marker"]);
    expect(upNext([marker], instantAt("2026-11-18", "10:01"), 5, zone)).toEqual([]);
  });

  it("does not depend on the input order", () => {
    const now = instantAt("2026-11-18", "08:00");
    const forward = idsOf(upNext([standup, crit, lunch], now, 5, zone));
    expect(idsOf(upNext([lunch, crit, standup], now, 5, zone))).toEqual(forward);
  });
});

describe("dayStatus", () => {
  it("is free with nothing planned", () => {
    expect(dayStatus([], "2026-11-18", instantAt("2026-11-18", "09:00"), zone)).toBe(DayStatus.Free);
  });

  it("is free when events fall on other days", () => {
    expect(dayStatus([crit], "2026-11-19", instantAt("2026-11-19", "09:00"), zone)).toBe(DayStatus.Free);
  });

  it("is free when the only event is cancelled", () => {
    expect(dayStatus([review], "2026-11-18", instantAt("2026-11-18", "09:00"), zone)).toBe(DayStatus.Free);
  });

  it("is busy before the last event ends", () => {
    expect(dayStatus([crit, lunch], "2026-11-18", instantAt("2026-11-18", "12:30"), zone)).toBe(DayStatus.Busy);
  });

  it("is done once the last event ends", () => {
    expect(dayStatus([crit, lunch], "2026-11-18", instantAt("2026-11-18", "13:00"), zone)).toBe(DayStatus.Done);
  });

  it("is busy for a future day", () => {
    expect(dayStatus([crit], "2026-11-18", instantAt("2026-11-17", "23:00"), zone)).toBe(DayStatus.Busy);
  });

  it("stays busy while an all-day trip runs past today", () => {
    const trip = occurrenceOf(makeAllDayEvent("2026-11-17", "2026-11-20"));
    expect(dayStatus([trip], "2026-11-18", instantAt("2026-11-18", "23:00"), zone)).toBe(DayStatus.Busy);
  });

  it("counts an event that crosses midnight on both days", () => {
    const late = makeOccurrence({ start: "2026-11-18T23:00:00-08:00", end: "2026-11-19T01:00:00-08:00" });
    const now = instantAt("2026-11-19", "00:30");
    expect(dayStatus([late], "2026-11-18", now, zone)).toBe(DayStatus.Busy);
    expect(dayStatus([late], "2026-11-19", now, zone)).toBe(DayStatus.Busy);
    expect(dayStatus([late], "2026-11-19", instantAt("2026-11-19", "01:00"), zone)).toBe(DayStatus.Done);
  });

  it("uses the view zone, not the host zone", () => {
    const tokyoMorning = makeOccurrence({ start: "2026-11-19T09:00:00+09:00", end: "2026-11-19T10:00:00+09:00" });
    const now = instantAt("2026-11-18", "08:00");
    expect(dayStatus([tokyoMorning], "2026-11-18", now, zone)).toBe(DayStatus.Busy);
    expect(dayStatus([tokyoMorning], "2026-11-18", now, testZones.tokyo)).toBe(DayStatus.Free);
  });

  it("is done on a 25 hour fall back day after the last event", () => {
    const early = makeOccurrence({ start: "2026-11-01T01:30:00-07:00", end: "2026-11-01T01:30:00-08:00" });
    expect(dayStatus([early], "2026-11-01", instantAt("2026-11-01", "02:00"), zone)).toBe(DayStatus.Done);
  });
});
