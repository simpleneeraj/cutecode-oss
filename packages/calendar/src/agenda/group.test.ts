import { describe, expect, it } from "vitest";
import { occurrenceOf } from "../event";
import { instantAt, makeAllDayEvent, makeOccurrence, testZones } from "../testing";
import { groupAgenda, type AgendaDay } from ".";

const zone = testZones.losAngeles;
const week = { start: "2026-11-16", end: "2026-11-23" };
const longAgo = 0;

function titlesByDay(days: AgendaDay[]): Record<string, string[]> {
  return Object.fromEntries(days.map((day) => [day.date, day.rows.map((row) => row.occurrence.event.id)]));
}

describe("groupAgenda", () => {
  it("returns nothing for no occurrences", () => {
    expect(groupAgenda([], week, longAgo, zone)).toEqual([]);
  });

  it("omits empty days and keeps days in date order", () => {
    const friday = makeOccurrence({
      id: "friday",
      start: "2026-11-20T09:00:00-08:00",
      end: "2026-11-20T10:00:00-08:00",
    });
    const monday = makeOccurrence({
      id: "monday",
      start: "2026-11-16T09:00:00-08:00",
      end: "2026-11-16T10:00:00-08:00",
    });
    const days = groupAgenda([friday, monday], week, longAgo, zone);
    expect(days.map((day) => day.date)).toEqual(["2026-11-16", "2026-11-20"]);
  });

  it("puts all-day rows first, then time order, with equal starts longest first", () => {
    const late = makeOccurrence({ id: "late", start: "2026-11-18T15:00:00-08:00", end: "2026-11-18T16:00:00-08:00" });
    const short = makeOccurrence({ id: "short", end: "2026-11-18T10:30:00-08:00" });
    const long = makeOccurrence({ id: "long", end: "2026-11-18T12:00:00-08:00" });
    const holiday = occurrenceOf(makeAllDayEvent("2026-11-18", "2026-11-19", { id: "holiday" }));
    const [day] = groupAgenda([late, short, holiday, long], week, longAgo, zone);
    expect(day?.rows.map((row) => row.occurrence.event.id)).toEqual(["holiday", "long", "short", "late"]);
    expect(day?.rows.map((row) => row.allDay)).toEqual([true, false, false, false]);
  });

  it("shows an event crossing midnight on both days and marks day two as continuing", () => {
    const overnight = makeOccurrence({
      id: "overnight",
      start: "2026-11-17T22:00:00-08:00",
      end: "2026-11-18T02:00:00-08:00",
    });
    const days = groupAgenda([overnight], week, longAgo, zone);
    expect(days.map((day) => day.date)).toEqual(["2026-11-17", "2026-11-18"]);
    const [tuesday, wednesday] = days;
    expect(tuesday?.rows[0]).toMatchObject({ continuesFrom: null, continuesAfter: true });
    expect(wednesday?.rows[0]).toMatchObject({ continuesFrom: "2026-11-17", continuesAfter: false });
  });

  it("gives every row a key unique per day", () => {
    const overnight = makeOccurrence({ start: "2026-11-17T22:00:00-08:00", end: "2026-11-18T02:00:00-08:00" });
    const keys = groupAgenda([overnight], week, longAgo, zone).flatMap((day) => day.rows.map((row) => row.key));
    expect(new Set(keys).size).toBe(2);
    expect(keys[1]).toBe(`${overnight.key}#2026-11-18`);
  });

  it("spreads a multi-day all-day trip over its days with an exclusive end", () => {
    const trip = occurrenceOf(makeAllDayEvent("2026-11-20", "2026-11-23", { id: "trip" }));
    const days = groupAgenda([trip], { start: "2026-11-16", end: "2026-11-30" }, longAgo, zone);
    expect(days.map((day) => day.date)).toEqual(["2026-11-20", "2026-11-21", "2026-11-22"]);
    expect(days.map((day) => day.rows[0]?.continuesFrom)).toEqual([null, "2026-11-20", "2026-11-20"]);
    expect(days.map((day) => day.rows[0]?.continuesAfter)).toEqual([true, true, false]);
  });

  it("clips spans to the requested dates but keeps where they began", () => {
    const trip = occurrenceOf(makeAllDayEvent("2026-11-14", "2026-11-18", { id: "trip" }));
    const days = groupAgenda([trip], week, longAgo, zone);
    expect(days.map((day) => day.date)).toEqual(["2026-11-16", "2026-11-17"]);
    expect(days[0]?.rows[0]?.continuesFrom).toBe("2026-11-14");
  });

  it("drops occurrences outside the dates", () => {
    const before = makeOccurrence({ start: "2026-11-15T10:00:00-08:00", end: "2026-11-15T11:00:00-08:00" });
    const after = occurrenceOf(makeAllDayEvent("2026-11-23", "2026-11-24"));
    const endsAtStart = makeOccurrence({ start: "2026-11-15T22:00:00-08:00", end: "2026-11-16T00:00:00-08:00" });
    expect(groupAgenda([before, after, endsAtStart], week, longAgo, zone)).toEqual([]);
  });

  it("flags rows that ended at or before now", () => {
    const morning = makeOccurrence({
      id: "morning",
      start: "2026-11-18T08:00:00-08:00",
      end: "2026-11-18T09:00:00-08:00",
    });
    const current = makeOccurrence({
      id: "current",
      start: "2026-11-18T09:30:00-08:00",
      end: "2026-11-18T10:30:00-08:00",
    });
    const evening = makeOccurrence({
      id: "evening",
      start: "2026-11-18T18:00:00-08:00",
      end: "2026-11-18T19:00:00-08:00",
    });
    const now = instantAt("2026-11-18", "09:00");
    const [day] = groupAgenda([evening, current, morning], week, now, zone);
    expect(day?.rows.map((row) => [row.occurrence.event.id, row.past])).toEqual([
      ["morning", true],
      ["current", false],
      ["evening", false],
    ]);
  });

  it("keeps a crossing-midnight event live on day one until it ends", () => {
    const overnight = makeOccurrence({ start: "2026-11-17T22:00:00-08:00", end: "2026-11-18T02:00:00-08:00" });
    const days = groupAgenda([overnight], week, instantAt("2026-11-17", "23:00"), zone);
    expect(days.map((day) => day.rows[0]?.past)).toEqual([false, false]);
  });

  it("marks an all-day row past only after its last day", () => {
    const trip = occurrenceOf(makeAllDayEvent("2026-11-16", "2026-11-18", { id: "trip" }));
    const during = groupAgenda([trip], week, instantAt("2026-11-17", "12:00"), zone);
    const after = groupAgenda([trip], week, instantAt("2026-11-18", "00:00"), zone);
    expect(during.map((day) => day.rows[0]?.past)).toEqual([false, false]);
    expect(after.map((day) => day.rows[0]?.past)).toEqual([true, true]);
  });

  it("buckets by the view zone, not the event zone", () => {
    const crit = makeOccurrence({ id: "crit", start: "2026-11-18T17:00:00-08:00", end: "2026-11-18T18:00:00-08:00" });
    expect(titlesByDay(groupAgenda([crit], week, longAgo, testZones.tokyo))).toEqual({ "2026-11-19": ["crit"] });
    expect(titlesByDay(groupAgenda([crit], week, longAgo, zone))).toEqual({ "2026-11-18": ["crit"] });
  });

  it("keeps a full fall DST day as one day", () => {
    const fallDay = makeOccurrence({
      id: "fall",
      start: "2026-11-01T00:00:00-07:00",
      end: "2026-11-02T00:00:00-08:00",
    });
    const dates = { start: "2026-10-31", end: "2026-11-03" };
    expect(titlesByDay(groupAgenda([fallDay], dates, longAgo, zone))).toEqual({ "2026-11-01": ["fall"] });
  });

  it("shows a zero minute marker on its day", () => {
    const deadline = makeOccurrence({ id: "deadline", end: "2026-11-18T10:00:00-08:00" });
    const [day] = groupAgenda([deadline], week, instantAt("2026-11-18", "10:00"), zone);
    expect(day?.rows[0]).toMatchObject({ continuesFrom: null, continuesAfter: false, past: true });
  });

  it("keeps a full spring DST day as one day", () => {
    const springDay = makeOccurrence({
      id: "spring",
      start: "2026-03-08T00:00:00-08:00",
      end: "2026-03-09T00:00:00-07:00",
    });
    const dates = { start: "2026-03-07", end: "2026-03-10" };
    expect(titlesByDay(groupAgenda([springDay], dates, longAgo, zone))).toEqual({ "2026-03-08": ["spring"] });
  });

  it("keeps an event over the spring gap on its one day", () => {
    const acrossGap = makeOccurrence({
      id: "gap",
      start: "2026-03-08T01:30:00-08:00",
      end: "2026-03-08T03:30:00-07:00",
    });
    const dates = { start: "2026-03-07", end: "2026-03-10" };
    const days = groupAgenda([acrossGap], dates, longAgo, zone);
    expect(titlesByDay(days)).toEqual({ "2026-03-08": ["gap"] });
    expect(days[0]?.rows[0]).toMatchObject({ continuesFrom: null, continuesAfter: false });
  });

  it("sorts a continuing overnight row before that day's morning events", () => {
    const overnight = makeOccurrence({
      id: "overnight",
      start: "2026-11-17T22:00:00-08:00",
      end: "2026-11-18T02:00:00-08:00",
    });
    const early = makeOccurrence({ id: "early", start: "2026-11-18T00:30:00-08:00", end: "2026-11-18T01:00:00-08:00" });
    const days = groupAgenda([early, overnight], week, longAgo, zone);
    expect(titlesByDay(days)["2026-11-18"]).toEqual(["overnight", "early"]);
  });

  it("flags the middle day of a timed multi-day span as continuing both ways", () => {
    const shift = makeOccurrence({
      id: "shift",
      start: "2026-11-17T20:00:00-08:00",
      end: "2026-11-19T08:00:00-08:00",
    });
    const days = groupAgenda([shift], week, longAgo, zone);
    expect(days.map((day) => day.date)).toEqual(["2026-11-17", "2026-11-18", "2026-11-19"]);
    expect(days.map((day) => [day.rows[0]?.continuesFrom, day.rows[0]?.continuesAfter])).toEqual([
      [null, true],
      ["2026-11-17", true],
      ["2026-11-17", false],
    ]);
  });

  it("keeps an empty all-day span live during the day it is shown on", () => {
    const empty = occurrenceOf(makeAllDayEvent("2026-11-18", "2026-11-18", { id: "empty" }));
    const during = groupAgenda([empty], week, instantAt("2026-11-18", "12:00"), zone);
    const after = groupAgenda([empty], week, instantAt("2026-11-19", "00:00"), zone);
    expect(titlesByDay(during)).toEqual({ "2026-11-18": ["empty"] });
    expect(during[0]?.rows[0]?.past).toBe(false);
    expect(after[0]?.rows[0]?.past).toBe(true);
  });

  it("judges past by the instant, whatever zone now was read in", () => {
    const crit = makeOccurrence({ start: "2026-11-18T10:00:00-08:00", end: "2026-11-18T11:00:00-08:00" });
    const justBefore = instantAt("2026-11-19", "03:59", testZones.tokyo);
    const atEnd = instantAt("2026-11-19", "04:00", testZones.tokyo);
    expect(groupAgenda([crit], week, justBefore, zone)[0]?.rows[0]?.past).toBe(false);
    expect(groupAgenda([crit], week, atEnd, zone)[0]?.rows[0]?.past).toBe(true);
  });
});
