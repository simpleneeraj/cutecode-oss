import { describe, expect, it } from "vitest";
import { occurrenceOf } from "../event";
import { makeAllDayEvent, makeOccurrence, testZones } from "../testing";
import { monthWeeks } from "../time";
import { Weekday, type EventOccurrence } from "../types";
import { busyDayLines, type BusyDay } from "./compact-month";

const zone = testZones.losAngeles;
const weeks = monthWeeks("2026-11-01", Weekday.Sunday);
const trip = occurrenceOf(makeAllDayEvent("2026-11-17", "2026-11-20", { id: "trip" }));

function timedAt(id: string, hour: string): EventOccurrence {
  return makeOccurrence({ id, start: `2026-11-18T${hour}:00:00-08:00`, end: `2026-11-18T${hour}:30:00-08:00` });
}

function idsOn(busyDays: Map<string, BusyDay>, date: string): string[] {
  return (busyDays.get(date)?.lines ?? []).map((occurrence) => occurrence.event.id);
}

describe("busyDayLines", () => {
  it("leaves free days out of the map", () => {
    expect(busyDayLines([], weeks, zone, 3).size).toBe(0);
  });

  it("puts an all-day trip on every covered day and not the exclusive end", () => {
    const lines = busyDayLines([trip], weeks, zone, 3);
    expect([...lines.keys()]).toEqual(["2026-11-17", "2026-11-18", "2026-11-19"]);
  });

  it("caps each day at the limit, all-day first then by start", () => {
    const events = [timedAt("late", "16"), timedAt("early", "08"), timedAt("noon", "12"), trip, timedAt("mid", "10")];
    const lines = busyDayLines(events, weeks, zone, 3);
    expect(idsOn(lines, "2026-11-18")).toEqual(["trip", "early", "mid"]);
    expect(idsOn(lines, "2026-11-17")).toEqual(["trip"]);
  });

  it("returns an empty list for a busy day when the limit is zero", () => {
    const lines = busyDayLines([trip], weeks, zone, 0);
    expect(lines.get("2026-11-18")).toEqual({ lines: [], hiddenCount: 1 });
  });

  it("counts the events it hides past the limit", () => {
    const events = [timedAt("late", "16"), timedAt("early", "08"), timedAt("noon", "12"), trip, timedAt("mid", "10")];
    const busyDays = busyDayLines(events, weeks, zone, 3);
    expect(busyDays.get("2026-11-18")?.hiddenCount).toBe(2);
    expect(busyDays.get("2026-11-17")).toEqual({ lines: [trip], hiddenCount: 0 });
  });

  it("keeps the last hour of the 25 hour fall back day", () => {
    const lateFallBack = makeOccurrence({
      id: "lateFall",
      start: "2026-11-01T23:30:00-08:00",
      end: "2026-11-02T00:00:00-08:00",
    });
    const early = makeOccurrence({ id: "early", start: "2026-11-01T01:30:00-07:00", end: "2026-11-01T01:45:00-07:00" });
    const busyDays = busyDayLines([lateFallBack, early], weeks, zone, 3);
    expect(idsOn(busyDays, "2026-11-01")).toEqual(["early", "lateFall"]);
    expect(busyDays.has("2026-11-02")).toBe(false);
  });

  it("covers days outside the month that the grid shows", () => {
    const spill = occurrenceOf(makeAllDayEvent("2026-12-04", "2026-12-06", { id: "spill" }));
    const lines = busyDayLines([spill], weeks, zone, 3);
    expect([...lines.keys()]).toEqual(["2026-12-04", "2026-12-05"]);
  });

  it("places a timed event that crosses midnight on both days", () => {
    const late = makeOccurrence({ id: "late", start: "2026-11-18T23:00:00-08:00", end: "2026-11-19T01:00:00-08:00" });
    const lines = busyDayLines([late], weeks, zone, 3);
    expect([...lines.keys()]).toEqual(["2026-11-18", "2026-11-19"]);
  });

  it("does not spill an event ending at midnight into the next day", () => {
    const evening = makeOccurrence({
      id: "evening",
      start: "2026-11-18T22:00:00-08:00",
      end: "2026-11-19T00:00:00-08:00",
    });
    expect([...busyDayLines([evening], weeks, zone, 3).keys()]).toEqual(["2026-11-18"]);
  });

  it("places days by the view zone", () => {
    const crit = makeOccurrence({ id: "crit", start: "2026-11-18T20:00:00-08:00", end: "2026-11-18T21:00:00-08:00" });
    expect([...busyDayLines([crit], weeks, testZones.tokyo, 3).keys()]).toEqual(["2026-11-19"]);
    expect([...busyDayLines([crit], weeks, testZones.chatham, 3).keys()]).toEqual(["2026-11-19"]);
  });

  it("keeps an event on the 25 hour fall back day", () => {
    const fallBack = makeOccurrence({
      id: "fall",
      start: "2026-11-01T23:30:00-08:00",
      end: "2026-11-01T23:45:00-08:00",
    });
    expect([...busyDayLines([fallBack], weeks, zone, 3).keys()]).toEqual(["2026-11-01"]);
  });
});
