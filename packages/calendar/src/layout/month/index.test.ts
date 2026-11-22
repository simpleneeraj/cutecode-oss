import { describe, expect, it } from "vitest";
import { occurrenceOf } from "../../event";
import { makeAllDayEvent, makeOccurrence, testZones } from "../../testing";
import { monthWeeks } from "../../time";
import { Weekday, type EventOccurrence, type MonthCell, type PlainDate } from "../../types";
import { layoutMonth } from ".";

const zone = testZones.losAngeles;
const sundayWeeks = monthWeeks("2026-11-01", Weekday.Sunday);
const mondayWeeks = monthWeeks("2026-11-01", Weekday.Monday);
const options = { timeZone: zone, month: "2026-11-01", chipCapacity: 4, hiddenCalendarIds: [] };

function allDay(id: string, start: PlainDate, end: PlainDate): EventOccurrence {
  return occurrenceOf(makeAllDayEvent(start, end, { id }));
}

function meeting(id: string, start: string, end: string, timeZone: string = zone): EventOccurrence {
  return makeOccurrence({ id, start, end, timeZone });
}

function meetingsOn(date: PlainDate, count: number): EventOccurrence[] {
  return Array.from({ length: count }, (_, index) => {
    const hour = String(9 + index).padStart(2, "0");
    return meeting(`meeting-${index}`, `${date}T${hour}:00:00-08:00`, `${date}T${hour}:30:00-08:00`);
  });
}

function cellOn(cells: MonthCell[], date: PlainDate): MonthCell | undefined {
  return cells.find((cell) => cell.date === date);
}

describe("layoutMonth grid", () => {
  it("makes 5 rows for November 2026 with a Sunday start", () => {
    const { cells } = layoutMonth([], sundayWeeks, options);
    expect(sundayWeeks).toHaveLength(5);
    expect(cells).toHaveLength(35);
    expect(cells[0]?.date).toBe("2026-11-01");
    expect(cells.at(-1)?.date).toBe("2026-12-05");
  });

  it("makes 6 rows for November 2026 with a Monday start", () => {
    const { cells } = layoutMonth([], mondayWeeks, options);
    expect(mondayWeeks).toHaveLength(6);
    expect(cells).toHaveLength(42);
    expect(cells[0]?.date).toBe("2026-10-26");
    expect(cells.at(-1)?.date).toBe("2026-12-06");
  });

  it("flags only the days of the shown month as in month", () => {
    const { cells } = layoutMonth([], mondayWeeks, options);
    expect(cells.filter((cell) => cell.inMonth)).toHaveLength(30);
    expect(cellOn(cells, "2026-10-31")?.inMonth).toBe(false);
    expect(cellOn(cells, "2026-11-30")?.inMonth).toBe(true);
    expect(cellOn(cells, "2026-12-01")?.inMonth).toBe(false);
  });

  it("accepts any date inside the month", () => {
    const { cells } = layoutMonth([], sundayWeeks, { ...options, month: "2026-11-18" });
    expect(cellOn(cells, "2026-11-01")?.inMonth).toBe(true);
    expect(cellOn(cells, "2026-12-01")?.inMonth).toBe(false);
  });

  it("gives empty cells for an empty month", () => {
    const { cells, bars } = layoutMonth([], sundayWeeks, options);
    expect(bars).toEqual([]);
    expect(cells.every((cell) => cell.visibleKeys.length === 0 && cell.hiddenCount === 0)).toBe(true);
  });

  it("returns nothing for an empty grid", () => {
    expect(layoutMonth(meetingsOn("2026-11-18", 2), [], options)).toEqual({ cells: [], bars: [] });
  });
});

describe("layoutMonth chips", () => {
  it("shows chips in start order", () => {
    const meetings = meetingsOn("2026-11-18", 3);
    const { cells } = layoutMonth([...meetings].reverse(), sundayWeeks, options);
    expect(cellOn(cells, "2026-11-18")?.visibleKeys).toEqual(meetings.map((occurrence) => occurrence.key));
  });

  it("puts the longer chip first when starts tie", () => {
    const short = meeting("short", "2026-11-18T09:00:00-08:00", "2026-11-18T09:30:00-08:00");
    const long = meeting("long", "2026-11-18T09:00:00-08:00", "2026-11-18T11:00:00-08:00");
    const { cells } = layoutMonth([short, long], sundayWeeks, options);
    expect(cellOn(cells, "2026-11-18")?.visibleKeys).toEqual([long.key, short.key]);
  });

  it("fills the cell to capacity and counts the rest as hidden", () => {
    const { cells } = layoutMonth(meetingsOn("2026-11-18", 6), sundayWeeks, options);
    expect(cellOn(cells, "2026-11-18")?.visibleKeys).toHaveLength(4);
    expect(cellOn(cells, "2026-11-18")?.hiddenCount).toBe(2);
  });

  it("shows +N with the capacity left after 2 lanes are used in the row", () => {
    const bars = [allDay("trip", "2026-11-16", "2026-11-20"), allDay("offsite", "2026-11-17", "2026-11-19")];
    const { cells } = layoutMonth([...bars, ...meetingsOn("2026-11-18", 5)], sundayWeeks, options);
    const cell = cellOn(cells, "2026-11-18");
    expect(cell?.visibleKeys).toHaveLength(2);
    expect(cell?.hiddenCount).toBe(3);
  });

  it("takes the lanes of the whole row, even on a day without a bar", () => {
    const bars = [allDay("trip", "2026-11-16", "2026-11-18"), allDay("offsite", "2026-11-16", "2026-11-18")];
    const { cells } = layoutMonth([...bars, ...meetingsOn("2026-11-21", 3)], sundayWeeks, options);
    expect(cellOn(cells, "2026-11-21")?.visibleKeys).toHaveLength(2);
    expect(cellOn(cells, "2026-11-21")?.hiddenCount).toBe(1);
  });

  it("keeps full capacity in rows without bars", () => {
    const bars = [allDay("trip", "2026-11-16", "2026-11-18"), allDay("offsite", "2026-11-16", "2026-11-18")];
    const { cells } = layoutMonth([...bars, ...meetingsOn("2026-11-25", 4)], sundayWeeks, options);
    expect(cellOn(cells, "2026-11-25")?.visibleKeys).toHaveLength(4);
    expect(cellOn(cells, "2026-11-25")?.hiddenCount).toBe(0);
  });

  it("keeps a line free under the bars when bars overflow", () => {
    const bars = ["a", "b", "c", "d", "e"].map((id) => allDay(id, "2026-11-18", "2026-11-19"));
    const { cells, bars: shown } = layoutMonth([...bars, ...meetingsOn("2026-11-18", 2)], sundayWeeks, options);
    expect(shown).toHaveLength(3);
    expect(cellOn(cells, "2026-11-18")?.visibleKeys).toHaveLength(1);
    expect(cellOn(cells, "2026-11-18")?.hiddenCount).toBe(3);
  });

  it("frees a line for +N when bars alone fill the row", () => {
    const bars = ["a", "b", "c", "d", "e"].map((id) => allDay(id, "2026-11-16", "2026-11-19"));
    const { cells, bars: shown } = layoutMonth(bars, sundayWeeks, options);
    expect(shown.map((bar) => bar.lane)).toEqual([0, 1, 2]);
    expect(cellOn(cells, "2026-11-17")?.hiddenCount).toBe(2);
    expect(cellOn(cells, "2026-11-17")?.visibleKeys).toEqual([]);
  });

  it("frees a line when bars fill the row and a day has chips", () => {
    const bars = ["a", "b", "c", "d"].map((id) => allDay(id, "2026-11-16", "2026-11-17"));
    const { cells, bars: shown } = layoutMonth([...bars, ...meetingsOn("2026-11-18", 1)], sundayWeeks, options);
    expect(shown).toHaveLength(3);
    expect(cellOn(cells, "2026-11-18")?.visibleKeys).toHaveLength(1);
  });

  it("keeps only the bars that fit and counts the rest on each day they cover", () => {
    const short = ["a", "b", "c", "d"].map((id) => allDay(id, "2026-11-18", "2026-11-19"));
    const long = allDay("long", "2026-11-17", "2026-11-21");
    const { cells, bars } = layoutMonth([...short, long], sundayWeeks, options);
    expect(bars.map((bar) => bar.lane)).toEqual([0, 1, 2]);
    expect(bars.some((bar) => bar.key === long.key)).toBe(true);
    expect(bars.filter((bar) => bar.key !== long.key)).toHaveLength(2);
    expect(cellOn(cells, "2026-11-17")?.hiddenCount).toBe(0);
    expect(cellOn(cells, "2026-11-18")?.hiddenCount).toBe(2);
    expect(cellOn(cells, "2026-11-20")?.hiddenCount).toBe(0);
  });

  it("counts a bar on an overflow lane on every day it covers", () => {
    const blockers = ["a", "b"].map((id) => allDay(id, "2026-11-16", "2026-11-21"));
    const trip = allDay("trip", "2026-11-17", "2026-11-20");
    const { cells, bars } = layoutMonth([...blockers, trip], sundayWeeks, { ...options, chipCapacity: 2 });
    expect(bars.some((bar) => bar.key === trip.key)).toBe(false);
    expect(
      ["2026-11-16", "2026-11-17", "2026-11-18", "2026-11-19", "2026-11-20"].map(
        (date) => cellOn(cells, date)?.hiddenCount,
      ),
    ).toEqual([1, 2, 2, 2, 1]);
  });

  it("hides every bar at zero capacity and counts it", () => {
    const trip = allDay("trip", "2026-11-18", "2026-11-20");
    const { cells, bars } = layoutMonth([trip], sundayWeeks, { ...options, chipCapacity: 0 });
    expect(bars).toEqual([]);
    expect(cellOn(cells, "2026-11-19")?.hiddenCount).toBe(1);
  });

  it("hides every chip at zero capacity", () => {
    const { cells } = layoutMonth(meetingsOn("2026-11-18", 2), sundayWeeks, { ...options, chipCapacity: 0 });
    expect(cellOn(cells, "2026-11-18")?.hiddenCount).toBe(2);
  });

  it("shows a short timed event crossing midnight on both days", () => {
    const late = meeting("late", "2026-11-18T22:00:00-08:00", "2026-11-19T01:00:00-08:00");
    const { cells } = layoutMonth([late], sundayWeeks, options);
    expect(cellOn(cells, "2026-11-18")?.visibleKeys).toEqual([late.key]);
    expect(cellOn(cells, "2026-11-19")?.visibleKeys).toEqual([late.key]);
    expect(cellOn(cells, "2026-11-20")?.visibleKeys).toEqual([]);
  });

  it("counts a crossing midnight event toward hidden on both days", () => {
    const late = meeting("late", "2026-11-18T22:00:00-08:00", "2026-11-19T01:00:00-08:00");
    const { cells } = layoutMonth([late, ...meetingsOn("2026-11-19", 4)], sundayWeeks, options);
    expect(cellOn(cells, "2026-11-19")?.visibleKeys[0]).toBe(late.key);
    expect(cellOn(cells, "2026-11-19")?.hiddenCount).toBe(1);
  });

  it("crosses the week edge from Saturday into Sunday", () => {
    const late = meeting("late", "2026-11-21T23:00:00-08:00", "2026-11-22T02:00:00-08:00");
    const { cells } = layoutMonth([late], sundayWeeks, options);
    expect(cellOn(cells, "2026-11-21")?.visibleKeys).toEqual([late.key]);
    expect(cellOn(cells, "2026-11-22")?.visibleKeys).toEqual([late.key]);
  });

  it("does not show an event ending at midnight on the next day", () => {
    const evening = meeting("evening", "2026-11-18T20:00:00-08:00", "2026-11-19T00:00:00-08:00");
    const { cells } = layoutMonth([evening], sundayWeeks, options);
    expect(cellOn(cells, "2026-11-18")?.visibleKeys).toEqual([evening.key]);
    expect(cellOn(cells, "2026-11-19")?.visibleKeys).toEqual([]);
  });

  it("shows a zero length event on its day", () => {
    const marker = meeting("marker", "2026-11-18T09:00:00-08:00", "2026-11-18T09:00:00-08:00");
    const { cells } = layoutMonth([marker], sundayWeeks, options);
    expect(cellOn(cells, "2026-11-18")?.visibleKeys).toEqual([marker.key]);
  });

  it("places chips by the view zone, not the event zone", () => {
    const tokyoMorning = meeting("call", "2026-11-19T08:00:00+09:00", "2026-11-19T09:00:00+09:00", testZones.tokyo);
    const { cells } = layoutMonth([tokyoMorning], sundayWeeks, options);
    expect(cellOn(cells, "2026-11-18")?.visibleKeys).toEqual([tokyoMorning.key]);
    expect(cellOn(cells, "2026-11-19")?.visibleKeys).toEqual([]);
  });

  it("keeps an evening event on the 25 hour fall day", () => {
    const late = meeting("late", "2026-11-01T23:00:00-08:00", "2026-11-01T23:30:00-08:00");
    const { cells } = layoutMonth([late], sundayWeeks, options);
    expect(cellOn(cells, "2026-11-01")?.visibleKeys).toEqual([late.key]);
    expect(cellOn(cells, "2026-11-02")?.visibleKeys).toEqual([]);
  });

  it("sends spanning events to bars, not chips", () => {
    const trip = allDay("trip", "2026-11-18", "2026-11-19");
    const summit = meeting("summit", "2026-11-18T10:00:00-08:00", "2026-11-19T10:00:00-08:00");
    const { cells, bars } = layoutMonth([trip, summit], sundayWeeks, options);
    expect(cellOn(cells, "2026-11-18")?.visibleKeys).toEqual([]);
    expect(bars.map((bar) => bar.key).sort()).toEqual([summit.key, trip.key].sort());
  });
});
