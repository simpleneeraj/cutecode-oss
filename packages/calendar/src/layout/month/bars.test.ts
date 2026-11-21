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

function cellOn(cells: MonthCell[], date: PlainDate): MonthCell | undefined {
  return cells.find((cell) => cell.date === date);
}

describe("layoutMonth hidden calendars", () => {
  it("removes chips and bars of hidden calendars", () => {
    const school = occurrenceOf(makeAllDayEvent("2026-11-18", "2026-11-19", { id: "school", calendarId: "family" }));
    const dentist = makeOccurrence({
      id: "dentist",
      start: "2026-11-18T12:00:00-08:00",
      end: "2026-11-18T13:00:00-08:00",
      calendarId: "family",
    });
    const crit = meeting("crit", "2026-11-18T10:00:00-08:00", "2026-11-18T11:00:00-08:00");
    const { cells, bars } = layoutMonth([school, dentist, crit], sundayWeeks, {
      ...options,
      hiddenCalendarIds: ["family"],
    });
    expect(bars).toEqual([]);
    expect(cellOn(cells, "2026-11-18")?.visibleKeys).toEqual([crit.key]);
    expect(cellOn(cells, "2026-11-18")?.hiddenCount).toBe(0);
  });
});

describe("layoutMonth on the spring forward day", () => {
  const marchWeeks = monthWeeks("2026-03-01", Weekday.Sunday);
  const march = { ...options, month: "2026-03-01" };

  it("makes a midnight to midnight event of 23 hours a one day bar, like any other day", () => {
    const fullDay = meeting("full", "2026-03-08T00:00:00-08:00", "2026-03-09T00:00:00-07:00");
    const { cells, bars } = layoutMonth([fullDay], marchWeeks, march);
    expect(bars.map((bar) => [bar.key, bar.startIndex, bar.length])).toEqual([[fullDay.key, 0, 1]]);
    expect(cellOn(cells, "2026-03-08")?.visibleKeys).toEqual([]);
  });

  it("keeps 00:00 to 23:00 on the 25 hour fall day as a chip", () => {
    const longDay = meeting("long", "2026-11-01T00:00:00-07:00", "2026-11-01T23:00:00-08:00");
    const { cells, bars } = layoutMonth([longDay], sundayWeeks, options);
    expect(bars).toEqual([]);
    expect(cellOn(cells, "2026-11-01")?.visibleKeys).toEqual([longDay.key]);
  });

  it("makes a 24 hour event from midnight a bar over two days", () => {
    const longDay = meeting("long", "2026-03-08T00:00:00-08:00", "2026-03-09T01:00:00-07:00");
    const { cells, bars } = layoutMonth([longDay], marchWeeks, march);
    expect(bars.map((bar) => [bar.startIndex, bar.length])).toEqual([[0, 2]]);
    expect(cellOn(cells, "2026-03-08")?.visibleKeys).toEqual([]);
  });
});

describe("layoutMonth bars", () => {
  it("breaks a span at the week edge with a Monday start", () => {
    const trip = allDay("trip", "2026-11-20", "2026-11-25");
    const { bars } = layoutMonth([trip], mondayWeeks, options);
    expect(bars.map((bar) => [bar.week, bar.startIndex, bar.length, bar.continuesAfter])).toEqual([
      [3, 4, 3, true],
      [4, 0, 2, false],
    ]);
  });

  it("lays out a span that starts before the grid", () => {
    const trip = allDay("trip", "2026-10-20", "2026-11-03");
    const { bars } = layoutMonth([trip], sundayWeeks, options);
    expect(bars.map((bar) => [bar.week, bar.startIndex, bar.length, bar.continuesBefore])).toEqual([[0, 0, 2, true]]);
  });
});
