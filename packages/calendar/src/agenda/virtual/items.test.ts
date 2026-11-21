import { Virtualizer } from "@tanstack/virtual-core";
import { describe, expect, it } from "vitest";
import { occurrenceOf } from "../../event";
import { makeAllDayEvent, makeOccurrence, testZones } from "../../testing";
import { addDays } from "../../time";
import { groupAgenda } from "..";
import { AgendaItemKind, agendaItems, agendaVirtualizerOptions, stickyHeaderIndex, type AgendaItem } from ".";

const zone = testZones.losAngeles;
const sizes = { header: 40, row: 60 };
const viewport = { width: 375, height: 300 };

function busyDays(dayCount: number) {
  const dates = { start: "2026-11-01", end: addDays("2026-11-01", dayCount) };
  const occurrences = Array.from({ length: dayCount }, (_, index) => {
    const date = addDays(dates.start, index);
    return [
      makeOccurrence({ id: `morning-${date}`, start: `${date}T09:00:00`, end: `${date}T10:00:00` }),
      makeOccurrence({ id: `noon-${date}`, start: `${date}T12:00:00`, end: `${date}T13:00:00` }),
    ];
  }).flat();
  return groupAgenda(occurrences, dates, 0, zone);
}

function virtualizerOf(items: AgendaItem[], initialOffset: number) {
  const options = agendaVirtualizerOptions(items, sizes, () => null);
  return new Virtualizer({ ...options, initialRect: viewport, initialOffset, overscan: 0 });
}

describe("agendaItems", () => {
  it("flattens each day into a header then its rows", () => {
    const trip = occurrenceOf(makeAllDayEvent("2026-11-20", "2026-11-22", { id: "trip" }));
    const crit = makeOccurrence({ start: "2026-11-21T10:00:00-08:00", end: "2026-11-21T11:00:00-08:00" });
    const days = groupAgenda([trip, crit], { start: "2026-11-16", end: "2026-11-23" }, 0, zone);
    const items = agendaItems(days);
    expect(items.map((item) => [item.kind, item.date])).toEqual([
      [AgendaItemKind.Header, "2026-11-20"],
      [AgendaItemKind.Row, "2026-11-20"],
      [AgendaItemKind.Header, "2026-11-21"],
      [AgendaItemKind.Row, "2026-11-21"],
      [AgendaItemKind.Row, "2026-11-21"],
    ]);
  });

  it("keeps keys unique and stable across rebuilds", () => {
    const days = busyDays(5);
    const keys = agendaItems(days).map((item) => item.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(agendaItems(busyDays(5)).map((item) => item.key)).toEqual(keys);
    expect(keys[0]).toBe("header#2026-11-01");
  });

  it("returns nothing for no days", () => {
    expect(agendaItems([])).toEqual([]);
  });
});

describe("stickyHeaderIndex", () => {
  const items = agendaItems(busyDays(3));

  it("finds the header of the day at the top", () => {
    expect([0, 1, 2, 3, 4, 5, 6, 8].map((index) => stickyHeaderIndex(items, index))).toEqual([0, 0, 0, 3, 3, 3, 6, 6]);
  });

  it("reads only back to the nearest header, not the whole list", () => {
    const longItems = agendaItems(busyDays(2000));
    let reads = 0;
    const counted = new Proxy(longItems, {
      get(target, property, receiver) {
        const isIndex = typeof property === "string" && /^\d+$/.test(property);
        if (isIndex) {
          reads += 1;
        }
        return Reflect.get(target, property, receiver);
      },
    });
    expect(stickyHeaderIndex(counted, 2)).toBe(0);
    expect(reads).toBeLessThanOrEqual(3);
  });

  it("stays in range past the end and is -1 when there is nothing", () => {
    expect(stickyHeaderIndex(items, 99)).toBe(6);
    expect(stickyHeaderIndex([], 0)).toBe(-1);
  });
});

describe("agendaVirtualizerOptions", () => {
  const items = agendaItems(busyDays(60));

  it("estimates size per kind and keys by item", () => {
    const options = agendaVirtualizerOptions(items, sizes, () => null);
    expect(options.count).toBe(items.length);
    expect(options.estimateSize(0)).toBe(sizes.header);
    expect(options.estimateSize(1)).toBe(sizes.row);
    expect(options.getItemKey?.(2)).toBe(items[2]?.key);
  });

  it("renders only a window of a long agenda", () => {
    const virtualizer = virtualizerOf(items, 0);
    const shown = virtualizer.getVirtualItems();
    expect(shown.length).toBeGreaterThan(0);
    expect(shown.length).toBeLessThan(10);
    expect(shown[0]?.key).toBe("header#2026-11-01");
    expect(virtualizer.getTotalSize()).toBe(60 * (sizes.header + 2 * sizes.row));
  });

  it("keeps the current day header in the window while scrolled into its rows", () => {
    const dayHeight = sizes.header + 2 * sizes.row;
    const virtualizer = virtualizerOf(items, dayHeight * 10 + sizes.header + 70);
    const indexes = virtualizer.getVirtualItems().map((item) => item.index);
    const headerIndex = 30;
    expect(items[headerIndex]).toMatchObject({ kind: AgendaItemKind.Header, date: "2026-11-11" });
    expect(indexes[0]).toBe(headerIndex);
    expect(indexes[1]).toBe(headerIndex + 2);
    expect(indexes.every((index) => index >= 0 && index < items.length)).toBe(true);
  });

  it("does not repeat the header when it is already in the window", () => {
    const virtualizer = virtualizerOf(items, 0);
    const indexes = virtualizer.getVirtualItems().map((item) => item.index);
    expect(new Set(indexes).size).toBe(indexes.length);
  });
});
