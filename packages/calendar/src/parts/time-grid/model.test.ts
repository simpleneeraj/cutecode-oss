import { describe, expect, it } from "vitest";
import { occurrencesInRange } from "../../event";
import { createLayoutRange } from "../../layout";
import { resolveSettings } from "../../locale";
import { viewRange } from "../../range";
import { instantAt } from "../../testing";
import { FocusTarget, ViewKind, type EventFocus, type Instant } from "../../types";
import { exampleCalendars, exampleDate, exampleEvents, exampleOptions } from "./example-data";
import { boxesAtSlot, eventCountAtSlot, focusForKey, shownFocus, startingFocus } from "./focus";
import { buildGridModel, minimumMinutesOf, type GridModel } from "./model";
import { eventKey, slotKey } from "../roving-focus/focus-key";

const settings = resolveSettings(exampleOptions);

function modelAt(kind: ViewKind, now: Instant | null, open = { earlier: false, later: false }): GridModel {
  const range = viewRange(kind, exampleDate, settings);
  const occurrences = occurrencesInRange(exampleEvents, {
    range: range.instants,
    dates: range.dates,
    timeZone: settings.timeZone,
  });
  const maxColumns = kind === ViewKind.Day ? 4 : 3;
  const layout = createLayoutRange()(occurrences, range, { maxColumns, minimumMinutes: 17, hiddenCalendarIds: [] });
  const input = { range, settings, layout, occurrences, options: exampleOptions, calendars: exampleCalendars };
  return buildGridModel({ ...input, selected: exampleDate, now, open });
}

function columnOn(model: GridModel, date: string) {
  const column = model.columns.find((candidate) => candidate.column.day.date === date);
  if (!column) {
    throw new Error(`No column on ${date}`);
  }
  return column;
}

describe("buildGridModel", () => {
  const now = instantAt(exampleDate, "10:30");
  const week = modelAt(ViewKind.Week, now);

  it("lays out seven days with the shown hours", () => {
    expect(week.columns).toHaveLength(7);
    expect(week.visible.rows).toHaveLength(12);
    expect(week.heading.title).toBe("November 2026");
  });

  it("folds five overlapping events into three columns and a chip", () => {
    const thursday = columnOn(week, "2026-11-19");
    expect(Math.max(...thursday.blocks.map((block) => block.columnCount))).toBe(3);
    expect(thursday.chips.map((chip) => chip.chip.keys.length)).toEqual([2]);
    expect(thursday.blocks.every((block) => block.isReserved)).toBe(true);
  });

  it("marks today and places the now line", () => {
    const today = columnOn(week, exampleDate);
    expect(today.isToday).toBe(true);
    expect(today.nowOffset).toBe(2.5);
    expect(week.nowLabel?.text).toBe("10:30 AM");
  });

  it("shades off hours on weekdays only", () => {
    expect(columnOn(week, "2026-11-18").offHours).toEqual([
      { top: 0, height: 1 },
      { top: 9, height: 3 },
    ]);
    expect(columnOn(week, "2026-11-21").offHours).toEqual([]);
    expect(columnOn(week, "2026-11-21").isWeekend).toBe(true);
  });

  it("hides folded events and counts them in the pills", () => {
    const wednesday = columnOn(week, exampleDate);
    expect(wednesday.blocks.some((block) => block.box.occurrence.event.id === "run")).toBe(false);
    expect(week.pills.map((pill) => pill.label)).toEqual(["2 earlier, from 12 AM", "2 later, until 12 AM"]);
  });

  it("shows folded events once the edge opens", () => {
    const opened = modelAt(ViewKind.Week, now, { earlier: true, later: false });
    const wednesday = columnOn(opened, exampleDate);
    expect(wednesday.blocks.some((block) => block.box.occurrence.event.id === "run")).toBe(true);
  });

  it("puts multi-day events in the all-day row with a continuation", () => {
    const trip = week.bars.find((bar) => bar.occurrence.event.id === "trip");
    expect(trip).toMatchObject({ startIndex: 5, length: 2, continuesAfter: true });
  });

  it("gives the day view up to four columns", () => {
    const day = modelAt(ViewKind.Day, null);
    expect(day.columns).toHaveLength(1);
    expect(day.nowLabel).toBeNull();
  });
});

describe("focus helpers", () => {
  const week = modelAt(ViewKind.Week, instantAt(exampleDate, "10:30"));

  it("starts on today at the current hour", () => {
    expect(startingFocus(week, instantAt(exampleDate, "10:30"))).toMatchObject({ date: exampleDate, minute: 600 });
  });

  it("starts at the shown hours when today is elsewhere", () => {
    expect(startingFocus(week, null)).toMatchObject({ date: exampleDate, minute: 480 });
  });

  it("counts events at a slot", () => {
    expect(boxesAtSlot(columnOn(week, "2026-11-19"), 600)).toHaveLength(3);
  });

  it("counts events folded into a chip", () => {
    const column = columnOn(week, "2026-11-19");
    const hidden = column.column.overflow.reduce((total, chip) => total + chip.keys.length, 0);
    expect(eventCountAtSlot(column, 600)).toBe(boxesAtSlot(column, 600).length + hidden);
  });

  it("falls back to the slot when the focused event is gone", () => {
    const focus: EventFocus = {
      target: FocusTarget.Event,
      date: "2026-11-19",
      minute: 600,
      columnKey: "day",
      occurrenceKey: "gone",
    };
    expect(shownFocus(focus, week, null)).toMatchObject({ target: FocusTarget.Slot, date: "2026-11-19", minute: 600 });
  });

  it("reads focus back from slot and event keys", () => {
    const current = startingFocus(week, null);
    expect(focusForKey(slotKey("2026-11-19", "day"), week, current)).toMatchObject({ date: "2026-11-19", minute: 480 });
    const [box] = columnOn(week, "2026-11-19").column.boxes;
    if (!box) {
      throw new Error("No box");
    }
    expect(focusForKey(eventKey(box.key, box.date, "day"), week, current)?.target).toBe(FocusTarget.Event);
  });

  it("keeps blocks at least 18px tall", () => {
    expect(minimumMinutesOf(64)).toBe(17);
    expect(minimumMinutesOf(44)).toBe(25);
  });
});
