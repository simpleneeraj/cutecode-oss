import { describe, expect, it } from "vitest";
import { instantAt, makeEvent, testZones } from "../../testing";
import { occurrenceOf } from "../../event";
import { daySpan } from "../../time";
import { OccurrenceKind, type DayColumn, type Instant, type TimedOccurrence } from "../../types";
import { layoutDayColumn, layoutTimedColumns, timedColumnLimits, type TimedLayoutOptions } from ".";

const day = daySpan("2026-11-18", testZones.losAngeles);

const weekOptions: TimedLayoutOptions = {
  maxColumns: timedColumnLimits.week,
  minimumMinutes: 30,
  columnKey: "week",
  timeZone: testZones.losAngeles,
};
const dayOptions: TimedLayoutOptions = {
  maxColumns: timedColumnLimits.day,
  minimumMinutes: 30,
  columnKey: "day",
  timeZone: testZones.losAngeles,
};

function timedOccurrence(key: string, start: Instant, end: Instant): TimedOccurrence {
  return { kind: OccurrenceKind.Timed, key, event: makeEvent({ id: key }), originalStart: key, start, end };
}

function onDay(key: string, from: string, to: string, date = "2026-11-18"): TimedOccurrence {
  return timedOccurrence(key, instantAt(date, from), instantAt(date, to));
}

function placementOf(column: DayColumn): string[] {
  return column.boxes.map((box) => `${box.key}:${box.column}/${box.columnCount}`);
}

const fiveOverlapping = [
  onDay("a", "10:00", "12:00"),
  onDay("b", "10:00", "11:30"),
  onDay("c", "10:15", "11:00"),
  onDay("d", "10:30", "11:15"),
  onDay("e", "10:45", "12:30"),
];

describe("timedColumnLimits", () => {
  it("allows 3 columns in week and 4 in day", () => {
    expect(timedColumnLimits).toEqual({ week: 3, day: 4 });
  });
});

describe("layoutDayColumn", () => {
  it("returns an empty column with its day and key", () => {
    expect(layoutDayColumn([], day, weekOptions)).toEqual({ day, columnKey: "week", boxes: [], overflow: [] });
  });

  it("gives a lone event the full width", () => {
    const column = layoutDayColumn([onDay("crit", "10:00", "11:00")], day, weekOptions);
    expect(column.boxes).toEqual([
      {
        key: "crit",
        occurrence: expect.objectContaining({ key: "crit" }),
        date: "2026-11-18",
        startMinute: 600,
        endMinute: 660,
        column: 0,
        columnCount: 1,
        continuesBefore: false,
        continuesAfter: false,
        marker: false,
      },
    ]);
  });

  it("folds 5 overlapping events into 3 columns and a chip in week view", () => {
    const column = layoutDayColumn(fiveOverlapping, day, weekOptions);
    expect(placementOf(column)).toEqual(["a:0/3", "b:1/3", "c:2/3"]);
    expect(column.overflow).toEqual([{ date: "2026-11-18", startMinute: 630, endMinute: 750, keys: ["d", "e"] }]);
  });

  it("folds 5 overlapping events into 4 columns and a chip in day view", () => {
    const column = layoutDayColumn(fiveOverlapping, day, dayOptions);
    expect(placementOf(column)).toEqual(["a:0/4", "b:1/4", "c:2/4", "d:3/4"]);
    expect(column.overflow).toEqual([{ date: "2026-11-18", startMinute: 645, endMinute: 750, keys: ["e"] }]);
  });

  it("reuses a freed column before folding", () => {
    const occurrences = [
      onDay("a", "10:00", "12:00"),
      onDay("b", "10:00", "11:00"),
      onDay("c", "10:00", "10:30"),
      onDay("d", "10:30", "11:00"),
      onDay("e", "11:00", "11:30"),
    ];
    const column = layoutDayColumn(occurrences, day, weekOptions);
    expect(placementOf(column)).toEqual(["a:0/3", "b:1/3", "c:2/3", "d:2/3", "e:1/3"]);
    expect(column.overflow).toEqual([]);
  });

  it("splits hidden events into separate chips when they do not overlap", () => {
    const occurrences = [
      onDay("a", "09:00", "13:00"),
      onDay("b", "09:00", "13:00"),
      onDay("c", "09:00", "10:00"),
      onDay("d", "11:00", "12:00"),
    ];
    const column = layoutDayColumn(occurrences, day, { ...weekOptions, maxColumns: 2 });
    expect(placementOf(column)).toEqual(["a:0/2", "b:1/2"]);
    expect(column.overflow).toEqual([
      { date: "2026-11-18", startMinute: 540, endMinute: 600, keys: ["c"] },
      { date: "2026-11-18", startMinute: 660, endMinute: 720, keys: ["d"] },
    ]);
  });

  it("puts the longest first when starts are equal", () => {
    const column = layoutDayColumn(
      [onDay("short", "10:00", "10:30"), onDay("long", "10:00", "12:00"), onDay("middle", "10:00", "11:00")],
      day,
      weekOptions,
    );
    expect(placementOf(column)).toEqual(["long:0/3", "middle:1/3", "short:2/3"]);
  });

  it("breaks full ties by key so any input order gives the same output", () => {
    const occurrences = [onDay("c", "10:00", "11:00"), onDay("a", "10:00", "11:00"), onDay("b", "10:00", "11:00")];
    const forward = layoutDayColumn(occurrences, day, weekOptions);
    const backward = layoutDayColumn([...occurrences].reverse(), day, weekOptions);
    expect(placementOf(forward)).toEqual(["a:0/3", "b:1/3", "c:2/3"]);
    expect(backward).toEqual(forward);
  });

  it("keeps touching events in one column", () => {
    const column = layoutDayColumn(
      [onDay("first", "10:00", "11:00"), onDay("second", "11:00", "12:00")],
      day,
      weekOptions,
    );
    expect(placementOf(column)).toEqual(["first:0/1", "second:0/1"]);
  });

  it("sizes each overlap group on its own", () => {
    const column = layoutDayColumn(
      [onDay("a", "09:00", "10:00"), onDay("b", "09:30", "10:30"), onDay("c", "14:00", "15:00")],
      day,
      weekOptions,
    );
    expect(placementOf(column)).toEqual(["a:0/2", "b:1/2", "c:0/1"]);
  });

  it("marks a 0 minute event and reserves the minimum for collisions", () => {
    const column = layoutDayColumn(
      [onDay("deadline", "10:00", "10:00"), onDay("review", "10:10", "11:00")],
      day,
      weekOptions,
    );
    expect(placementOf(column)).toEqual(["deadline:0/2", "review:1/2"]);
    expect(column.boxes[0]).toMatchObject({ startMinute: 600, endMinute: 600, marker: true });
  });

  it("keeps the true end of a 5 minute event while it collides for the minimum", () => {
    const column = layoutDayColumn(
      [onDay("ping", "09:00", "09:05"), onDay("sync", "09:20", "10:00")],
      day,
      weekOptions,
    );
    expect(placementOf(column)).toEqual(["ping:0/2", "sync:1/2"]);
    expect(column.boxes[0]).toMatchObject({ startMinute: 540, endMinute: 545, marker: false });
  });

  it("does not let a hidden marker chip run past the end of the day", () => {
    const column = layoutDayColumn([onDay("late", "23:30", "23:59"), onDay("deadline", "23:50", "23:50")], day, {
      ...weekOptions,
      maxColumns: 1,
    });
    expect(column.overflow).toEqual([{ date: "2026-11-18", startMinute: 1430, endMinute: 1440, keys: ["deadline"] }]);
  });

  it("skips occurrences outside the day", () => {
    const column = layoutDayColumn(
      [onDay("yesterday", "10:00", "11:00", "2026-11-17"), onDay("today", "10:00", "11:00")],
      day,
      weekOptions,
    );
    expect(column.boxes.map((box) => box.key)).toEqual(["today"]);
  });

  it("lays out the fall day in real elapsed minutes", () => {
    const fallDay = daySpan("2026-11-01", testZones.losAngeles);
    const column = layoutDayColumn([onDay("early", "03:00", "04:00", "2026-11-01")], fallDay, weekOptions);
    expect(column.boxes[0]).toMatchObject({ date: "2026-11-01", startMinute: 240, endMinute: 300 });
  });

  it("lays out the spring day in real elapsed minutes", () => {
    const springDay = daySpan("2026-03-08", testZones.losAngeles);
    const column = layoutDayColumn([onDay("early", "03:00", "04:00", "2026-03-08")], springDay, weekOptions);
    expect(column.boxes[0]).toMatchObject({ date: "2026-03-08", startMinute: 120, endMinute: 180 });
  });

  it("places an event made in Tokyo at the right minute in Los Angeles", () => {
    const occurrence = occurrenceOf(
      makeEvent({
        id: "tokyo",
        start: "2026-11-19T03:00:00+09:00",
        end: "2026-11-19T04:00:00+09:00",
        timeZone: testZones.tokyo,
      }),
    );
    const column = layoutTimedColumns([occurrence], [day], weekOptions);
    expect(column[0]?.boxes[0]).toMatchObject({ key: occurrence.key, startMinute: 600, endMinute: 660 });
  });
});
