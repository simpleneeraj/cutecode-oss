import { describe, expect, it } from "vitest";
import { occurrenceOf } from "../../event";
import { makeAllDayEvent, makeOccurrence, testZones } from "../../testing";
import { monthWeeks, weekDates } from "../../time";
import { Weekday, type EventOccurrence, type SpanBar } from "../../types";
import { laneCount, layoutSpans } from ".";

const zone = testZones.losAngeles;
const sundayWeeks = monthWeeks("2026-11-01", Weekday.Sunday);
const mondayWeeks = monthWeeks("2026-11-01", Weekday.Monday);

function allDay(id: string, start: string, end: string): EventOccurrence {
  return occurrenceOf(makeAllDayEvent(start, end, { id }));
}

function timedSpan(id: string, start: string, end: string, timeZone: string = zone): EventOccurrence {
  return makeOccurrence({ id, start, end, timeZone });
}

function barsOf(bars: SpanBar[], id: string): SpanBar[] {
  return bars.filter((bar) => bar.occurrence.event.id === id);
}

function shape(bar: SpanBar | undefined) {
  if (bar === undefined) {
    return undefined;
  }
  const { week, lane, startIndex, length, continuesBefore, continuesAfter } = bar;
  return { week, lane, startIndex, length, continuesBefore, continuesAfter };
}

describe("layoutSpans", () => {
  it("covers three days for 2026-11-20 to 2026-11-23", () => {
    const bars = layoutSpans([allDay("trip", "2026-11-20", "2026-11-23")], sundayWeeks, zone);
    expect(bars.map(shape)).toEqual([
      { week: 2, lane: 0, startIndex: 5, length: 2, continuesBefore: false, continuesAfter: true },
      { week: 3, lane: 0, startIndex: 0, length: 1, continuesBefore: true, continuesAfter: false },
    ]);
  });

  it("breaks a multi-week span at the week edge and repeats the occurrence per row", () => {
    const trip = allDay("trip", "2026-11-05", "2026-11-19");
    const bars = layoutSpans([trip], sundayWeeks, zone);
    expect(bars.map(shape)).toEqual([
      { week: 0, lane: 0, startIndex: 4, length: 3, continuesBefore: false, continuesAfter: true },
      { week: 1, lane: 0, startIndex: 0, length: 7, continuesBefore: true, continuesAfter: true },
      { week: 2, lane: 0, startIndex: 0, length: 4, continuesBefore: true, continuesAfter: false },
    ]);
    expect(bars.every((bar) => bar.occurrence === trip && bar.key === trip.key)).toBe(true);
  });

  it("keeps the lane across rows when it is free, even when a lower lane opens", () => {
    const week = allDay("week", "2026-11-01", "2026-11-08");
    const trip = allDay("trip", "2026-11-04", "2026-11-11");
    const bars = layoutSpans([trip, week], sundayWeeks, zone);
    expect(barsOf(bars, "week").map((bar) => bar.lane)).toEqual([0]);
    expect(barsOf(bars, "trip").map((bar) => [bar.week, bar.lane])).toEqual([
      [0, 1],
      [1, 1],
    ]);
  });

  it("moves to another free lane when the kept lane is taken in the next row", () => {
    const first = allDay("first", "2026-11-01", "2026-11-08");
    const second = allDay("second", "2026-11-08", "2026-11-15");
    const third = allDay("third", "2026-11-06", "2026-11-10");
    const fourth = allDay("fourth", "2026-11-08", "2026-11-13");
    const bars = layoutSpans([first, second, third, fourth], sundayWeeks, zone);
    expect(barsOf(bars, "third").map((bar) => [bar.week, bar.lane])).toEqual([
      [0, 1],
      [1, 2],
    ]);
    expect(barsOf(bars, "fourth").map((bar) => [bar.week, bar.lane])).toEqual([[1, 1]]);
  });

  it("reuses a lane after the span on it ends", () => {
    const early = allDay("early", "2026-11-15", "2026-11-17");
    const late = allDay("late", "2026-11-18", "2026-11-20");
    const bars = layoutSpans([early, late], sundayWeeks, zone);
    expect(bars.map((bar) => bar.lane)).toEqual([0, 0]);
    expect(laneCount(bars, 2)).toBe(1);
  });

  it("reuses a lane when the next span starts on the end date of the last", () => {
    const early = allDay("early", "2026-11-15", "2026-11-17");
    const late = allDay("late", "2026-11-17", "2026-11-19");
    expect(layoutSpans([early, late], sundayWeeks, zone).map((bar) => bar.lane)).toEqual([0, 0]);
  });

  it("places longer spans first", () => {
    const short = allDay("short", "2026-11-16", "2026-11-18");
    const long = allDay("long", "2026-11-17", "2026-11-21");
    const bars = layoutSpans([short, long], sundayWeeks, zone);
    expect(barsOf(bars, "long").map((bar) => bar.lane)).toEqual([0]);
    expect(barsOf(bars, "short").map((bar) => bar.lane)).toEqual([1]);
  });

  it("places the earlier start first when lengths tie, then the lower key", () => {
    const later = allDay("later", "2026-11-17", "2026-11-19");
    const earlier = allDay("earlier", "2026-11-16", "2026-11-18");
    const twinB = allDay("b-twin", "2026-11-18", "2026-11-20");
    const twinA = allDay("a-twin", "2026-11-18", "2026-11-20");
    const bars = layoutSpans([later, twinB, earlier, twinA], sundayWeeks, zone);
    expect(barsOf(bars, "earlier")[0]?.lane).toBe(0);
    expect(barsOf(bars, "later")[0]?.lane).toBe(1);
    expect(barsOf(bars, "a-twin")[0]?.lane).toBe(0);
    expect(barsOf(bars, "b-twin")[0]?.lane).toBe(2);
  });

  it("gives the same layout whatever the input order", () => {
    const spans = [
      allDay("one", "2026-11-02", "2026-11-12"),
      allDay("two", "2026-11-03", "2026-11-05"),
      allDay("three", "2026-11-04", "2026-11-09"),
      allDay("four", "2026-11-10", "2026-11-11"),
    ];
    const forward = layoutSpans(spans, sundayWeeks, zone).map(shape);
    const backward = layoutSpans([...spans].reverse(), sundayWeeks, zone).map(shape);
    expect(backward).toEqual(forward);
  });

  it("returns bars ordered by week, lane and start", () => {
    const bars = layoutSpans(
      [allDay("b", "2026-11-17", "2026-11-19"), allDay("a", "2026-11-03", "2026-11-25")],
      sundayWeeks,
      zone,
    );
    const order = bars.map((bar) => [bar.week, bar.lane]);
    expect(order).toEqual([
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [3, 0],
    ]);
  });

  it("lays out a timed multi-day event as a bar", () => {
    const summit = timedSpan("summit", "2026-11-18T10:00:00-08:00", "2026-11-20T09:00:00-08:00");
    expect(layoutSpans([summit], sundayWeeks, zone).map(shape)).toEqual([
      { week: 2, lane: 0, startIndex: 3, length: 3, continuesBefore: false, continuesAfter: false },
    ]);
  });

  it("leaves short timed events out", () => {
    expect(layoutSpans([makeOccurrence()], sundayWeeks, zone)).toEqual([]);
  });

  it("leaves out spans outside the grid", () => {
    expect(layoutSpans([allDay("before", "2026-10-01", "2026-10-03")], sundayWeeks, zone)).toEqual([]);
    expect(layoutSpans([allDay("after", "2026-12-10", "2026-12-12")], sundayWeeks, zone)).toEqual([]);
  });

  it("marks a span running past both grid edges as continuing", () => {
    const week = [weekDates("2026-11-18", Weekday.Sunday)];
    const bars = layoutSpans([allDay("long", "2026-11-01", "2026-12-01")], week, zone);
    expect(bars.map(shape)).toEqual([
      { week: 0, lane: 0, startIndex: 0, length: 7, continuesBefore: true, continuesAfter: true },
    ]);
  });

  it("breaks at a different edge with a Monday start", () => {
    const trip = allDay("trip", "2026-11-20", "2026-11-23");
    expect(layoutSpans([trip], mondayWeeks, zone).map(shape)).toEqual([
      { week: 3, lane: 0, startIndex: 4, length: 3, continuesBefore: false, continuesAfter: false },
    ]);
  });

  it("works on a single day row", () => {
    const day = [["2026-11-18"]];
    const bars = layoutSpans([allDay("trip", "2026-11-17", "2026-11-20")], day, zone);
    expect(bars.map(shape)).toEqual([
      { week: 0, lane: 0, startIndex: 0, length: 1, continuesBefore: true, continuesAfter: true },
    ]);
  });

  it("returns no bars for an empty grid", () => {
    expect(layoutSpans([allDay("trip", "2026-11-17", "2026-11-20")], [], zone)).toEqual([]);
  });
});

describe("laneCount", () => {
  it("counts the lanes used in one week row", () => {
    const bars = layoutSpans(
      [
        allDay("a", "2026-11-16", "2026-11-18"),
        allDay("b", "2026-11-16", "2026-11-18"),
        allDay("c", "2026-11-17", "2026-11-19"),
      ],
      sundayWeeks,
      zone,
    );
    expect(laneCount(bars, 2)).toBe(3);
  });

  it("is zero for a row without bars", () => {
    const bars = layoutSpans([allDay("a", "2026-11-16", "2026-11-18")], sundayWeeks, zone);
    expect(laneCount(bars, 0)).toBe(0);
    expect(laneCount([], 2)).toBe(0);
  });
});
