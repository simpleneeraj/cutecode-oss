import { describe, expect, it } from "vitest";
import { groupAgenda, type AgendaRow } from "../../agenda";
import { agendaItems } from "../../agenda/virtual";
import { occurrenceOf } from "../../event";
import { instantAt, makeAllDayEvent, makeEvent, makeSettings } from "../../testing";
import { dayHeading, rowMeta, rowTimes } from "./row-text";
import {
  anchorIndex,
  extendEarlier,
  extendLater,
  growEarlier,
  growLater,
  initialLoad,
  initialWindow,
  offsetBefore,
  prependedHeight,
} from "./window";

const settings = makeSettings();

const night = makeEvent({
  id: "night",
  title: "Night shift",
  start: "2026-11-17T22:00:00-08:00",
  end: "2026-11-18T02:00:00-08:00",
  location: "Ward 4",
});

const events = [night, makeAllDayEvent("2026-11-18", "2026-11-19", { id: "trip" })];

function rowsOf(): AgendaRow[] {
  const dates = { start: "2026-11-17", end: "2026-11-19" };
  const days = groupAgenda(events.map(occurrenceOf), dates, instantAt("2026-11-18", "01:00"), settings.timeZone);
  return days.flatMap((day) => day.rows);
}

describe("agenda window", () => {
  it("opens a month back and three ahead", () => {
    expect(initialWindow("2026-11-18")).toEqual({ start: "2026-10-19", end: "2027-02-16" });
  });

  it("grows a page either way", () => {
    const window = { start: "2026-11-01", end: "2026-12-01" };
    expect(extendEarlier(window)).toEqual({ start: "2026-10-02", end: "2026-12-01" });
    expect(extendLater(window)).toEqual({ start: "2026-11-01", end: "2026-12-31" });
  });

  it("measures offsets from fixed sizes", () => {
    const days = groupAgenda(
      events.map(occurrenceOf),
      { start: "2026-11-17", end: "2026-11-19" },
      0,
      settings.timeZone,
    );
    const items = agendaItems(days);
    expect(items.map((item) => item.key)).toHaveLength(5);
    expect(anchorIndex(items, "2026-11-18")).toBe(2);
    expect(offsetBefore(items, 2)).toBe(44 + 60);
    expect(prependedHeight(items, items[2]?.key)).toBe(104);
    expect(prependedHeight(items, "missing")).toBe(0);
    expect(anchorIndex(items, "2026-12-01")).toBe(items.length);
  });
});

function itemsOn(date: string, end: string) {
  return (window: { start: string; end: string }) => {
    const occurrences = [occurrenceOf(makeAllDayEvent(date, end, { id: "far" }))];
    const days = groupAgenda(occurrences, window, 0, settings.timeZone);
    return agendaItems(days);
  };
}

describe("agenda growth", () => {
  const empty = () => [];

  it("looks ahead a bounded number of pages when nothing is planned", () => {
    const load = initialLoad("2026-11-18", empty);
    expect(load.laterPages).toBe(12);
    expect(load.earlierPages).toBe(0);
  });

  it("keeps looking ahead until a sparse event four months out is loaded", () => {
    const itemsFor = itemsOn("2027-03-20", "2027-03-21");
    const load = initialLoad("2026-11-18", itemsFor);
    expect(itemsFor(load.window).length).toBeGreaterThan(0);
  });

  it("stops growing at the page cap", () => {
    const capped = { window: initialWindow("2026-11-18"), earlierPages: 24, laterPages: 24 };
    expect(growLater(capped, empty)).toBe(capped);
    expect(growEarlier(capped, empty)).toBe(capped);
  });

  it("grows one edge until new items arrive", () => {
    const start = { window: initialWindow("2026-11-18"), earlierPages: 0, laterPages: 0 };
    const itemsFor = itemsOn("2027-04-01", "2027-04-02");
    const grown = growLater(start, itemsFor);
    expect(itemsFor(grown.window).length).toBeGreaterThan(0);
    expect(grown.laterPages).toBe(2);
  });
});

describe("agenda row text", () => {
  it("puts all-day rows first on each day", () => {
    const [first, trip, continued] = rowsOf();
    expect(first?.continuesFrom).toBe(null);
    expect(trip?.allDay).toBe(true);
    expect(continued?.continuesFrom).toBe("2026-11-17");
    expect(continued?.past).toBe(false);
  });

  it("says where a midnight crossing continues from", () => {
    const continued = rowsOf().find((row) => row.continuesFrom !== null);
    expect(continued === undefined ? "" : rowMeta(continued, settings)).toBe("Continues from Tue, Ward 4");
    expect(continued === undefined ? null : rowTimes(continued, settings)).toEqual({
      primary: "Until",
      secondary: "2 AM",
    });
  });

  it("names the day", () => {
    expect(dayHeading("2026-11-18", settings)).toEqual({ title: "Wednesday", subtitle: "November 18" });
  });
});
