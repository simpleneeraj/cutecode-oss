import { describe, expect, it } from "vitest";
import { dstTransitions2026, testZones, TransitionKind } from "../testing";
import { addDays, daySpan, eachDate, milliseconds, toWallClock } from "../time";
import { FocusTarget, KeyCommand, type EventFocus, type GridFocus, type SlotFocus } from "../types";
import { isCommandAllowed, moveFocus, type FocusGrid } from "./focus";

const hour = 60;

function weekGrid(start: string, end: string, timeZone = testZones.losAngeles): FocusGrid {
  const dates = eachDate({ start, end });
  return {
    dates,
    columnKeys: ["day"],
    stepMinutes: hour,
    days: dates.map((date) => daySpan(date, timeZone)),
    timeZone,
  };
}

function slot(date: string, minute: number, columnKey = "day"): SlotFocus {
  return { target: FocusTarget.Slot, date, minute, columnKey };
}

function onEvent(date: string, minute: number): EventFocus {
  return { target: FocusTarget.Event, date, minute, columnKey: "day", occurrenceKey: "design-crit" };
}

const week = weekGrid("2026-11-15", "2026-11-22");

describe("moveFocus", () => {
  it("steps a day each way", () => {
    expect(moveFocus(slot("2026-11-18", 600), KeyCommand.NextDay, week)).toEqual(slot("2026-11-19", 600));
    expect(moveFocus(slot("2026-11-18", 600), KeyCommand.PreviousDay, week)).toEqual(slot("2026-11-17", 600));
  });

  it("steps a week each way, leaving the grid so the view navigates", () => {
    expect(moveFocus(slot("2026-11-18", 600), KeyCommand.PreviousWeek, week)).toEqual(slot("2026-11-11", 600));
    expect(moveFocus(slot("2026-11-18", 600), KeyCommand.NextWeek, week)).toEqual(slot("2026-11-25", 600));
  });

  it("steps past the last date of the grid", () => {
    expect(moveFocus(slot("2026-11-21", 600), KeyCommand.NextDay, week).date).toBe("2026-11-22");
  });

  it("crosses month and year edges", () => {
    expect(moveFocus(slot("2026-12-31", 0), KeyCommand.NextDay, week).date).toBe("2027-01-01");
    expect(moveFocus(slot("2026-03-01", 0), KeyCommand.PreviousDay, week).date).toBe("2026-02-28");
  });

  it("steps an hour each way", () => {
    expect(moveFocus(slot("2026-11-18", 600), KeyCommand.NextHour, week)).toEqual(slot("2026-11-18", 660));
    expect(moveFocus(slot("2026-11-18", 600), KeyCommand.PreviousHour, week)).toEqual(slot("2026-11-18", 540));
  });

  it("clamps up from the first hour", () => {
    expect(moveFocus(slot("2026-11-18", 0), KeyCommand.PreviousHour, week)).toEqual(slot("2026-11-18", 0));
  });

  it("clamps down from the last hour", () => {
    expect(moveFocus(slot("2026-11-18", 1380), KeyCommand.NextHour, week)).toEqual(slot("2026-11-18", 1380));
  });

  it("reaches the 25th hour on a fall day", () => {
    const fall = weekGrid("2026-11-01", "2026-11-08");
    const last = moveFocus(slot("2026-11-01", 1380), KeyCommand.NextHour, fall);
    expect(last).toEqual(slot("2026-11-01", 1440));
    expect(moveFocus(last, KeyCommand.NextHour, fall)).toEqual(slot("2026-11-01", 1440));
  });

  it("clamps into a 23 hour spring day", () => {
    const spring = weekGrid("2026-03-08", "2026-03-15");
    expect(moveFocus(slot("2026-03-09", 1380), KeyCommand.PreviousDay, spring)).toEqual(slot("2026-03-08", 1320));
  });

  it("finds the last hour on every transition day of 2026", () => {
    const lastHours = dstTransitions2026.map((transition) => {
      const grid = weekGrid(transition.date, addDays(transition.date, 1), transition.timeZone);
      return moveFocus(slot(transition.date, 3000), KeyCommand.NextHour, grid).minute;
    });
    const expected = dstTransitions2026.map((transition) => (transition.kind === TransitionKind.Fall ? 1440 : 1320));
    expect(lastHours).toEqual(expected);
  });

  it("uses the grid step for carrying nudges", () => {
    const fine = { ...week, stepMinutes: 15 };
    expect(moveFocus(slot("2026-11-18", 600), KeyCommand.NextHour, fine)).toEqual(slot("2026-11-18", 615));
    expect(moveFocus(slot("2026-11-18", 1425), KeyCommand.NextHour, fine)).toEqual(slot("2026-11-18", 1425));
  });

  it("walks resource columns before changing day", () => {
    const rooms = { ...week, columnKeys: ["room-a", "room-b", "room-c"] };
    expect(moveFocus(slot("2026-11-18", 600, "room-a"), KeyCommand.NextDay, rooms)).toEqual(
      slot("2026-11-18", 600, "room-b"),
    );
    expect(moveFocus(slot("2026-11-18", 600, "room-c"), KeyCommand.NextDay, rooms)).toEqual(
      slot("2026-11-19", 600, "room-a"),
    );
    expect(moveFocus(slot("2026-11-18", 600, "room-a"), KeyCommand.PreviousDay, rooms)).toEqual(
      slot("2026-11-17", 600, "room-c"),
    );
  });

  it("keeps the column on a week step", () => {
    const rooms = { ...week, columnKeys: ["room-a", "room-b"] };
    expect(moveFocus(slot("2026-11-18", 600, "room-b"), KeyCommand.NextWeek, rooms)).toEqual(
      slot("2026-11-25", 600, "room-b"),
    );
  });

  it("moves off an event onto a slot", () => {
    expect(moveFocus(onEvent("2026-11-18", 600), KeyCommand.NextHour, week)).toEqual(slot("2026-11-18", 660));
  });

  it("leaves focus alone for commands that do not move", () => {
    const focus: GridFocus = onEvent("2026-11-18", 600);
    expect(moveFocus(focus, KeyCommand.OpenEvent, week)).toBe(focus);
    expect(moveFocus(focus, KeyCommand.Today, week)).toBe(focus);
  });
});

function clockMinuteOf(focus: GridFocus, timeZone: string): number {
  return toWallClock(daySpan(focus.date, timeZone).start + focus.minute * milliseconds.minute, timeZone).minute;
}

describe("moveFocus keeps the clock time across DST days", () => {
  const newYork = weekGrid("2026-03-07", "2026-03-10", testZones.newYork);
  const newYorkFall = weekGrid("2026-10-31", "2026-11-03", testZones.newYork);

  it("keeps 10 AM stepping into and out of a spring day in New York", () => {
    expect(moveFocus(slot("2026-03-07", 600), KeyCommand.NextDay, newYork)).toEqual(slot("2026-03-08", 540));
    expect(moveFocus(slot("2026-03-08", 540), KeyCommand.NextDay, newYork)).toEqual(slot("2026-03-09", 600));
    expect(moveFocus(slot("2026-03-09", 600), KeyCommand.PreviousDay, newYork)).toEqual(slot("2026-03-08", 540));
    expect(moveFocus(slot("2026-03-08", 540), KeyCommand.PreviousDay, newYork)).toEqual(slot("2026-03-07", 600));
  });

  it("keeps 10 AM stepping into and out of a fall day in New York", () => {
    expect(moveFocus(slot("2026-10-31", 600), KeyCommand.NextDay, newYorkFall)).toEqual(slot("2026-11-01", 660));
    expect(moveFocus(slot("2026-11-01", 660), KeyCommand.NextDay, newYorkFall)).toEqual(slot("2026-11-02", 600));
    expect(moveFocus(slot("2026-11-02", 600), KeyCommand.PreviousDay, newYorkFall)).toEqual(slot("2026-11-01", 660));
  });

  it("keeps 10 AM on week steps that land on or leave a transition day", () => {
    expect(moveFocus(slot("2026-03-01", 600), KeyCommand.NextWeek, newYork)).toEqual(slot("2026-03-08", 540));
    expect(moveFocus(slot("2026-03-15", 600), KeyCommand.PreviousWeek, newYork)).toEqual(slot("2026-03-08", 540));
    expect(moveFocus(slot("2026-03-08", 540), KeyCommand.NextWeek, newYork)).toEqual(slot("2026-03-15", 600));
    expect(moveFocus(slot("2026-10-25", 600), KeyCommand.NextWeek, newYorkFall)).toEqual(slot("2026-11-01", 660));
    expect(moveFocus(slot("2026-11-08", 600), KeyCommand.PreviousWeek, newYorkFall)).toEqual(slot("2026-11-01", 660));
  });

  it("takes the next valid slot for a clock time the spring day skips", () => {
    const berlin = weekGrid("2026-03-28", "2026-03-30", testZones.berlin);
    const landed = moveFocus(slot("2026-03-28", 120), KeyCommand.NextDay, berlin);
    expect(landed).toEqual(slot("2026-03-29", 120));
    expect(clockMinuteOf(landed, testZones.berlin)).toBe(180);
  });

  it("keeps the late evening hour leaving the 25th hour of a fall day", () => {
    expect(moveFocus(slot("2026-11-01", 1440), KeyCommand.NextDay, newYorkFall)).toEqual(slot("2026-11-02", 1380));
  });

  it("keeps the clock time for every 2026 transition in every test zone", () => {
    const steps = [
      { command: KeyCommand.NextDay, from: -1 },
      { command: KeyCommand.PreviousDay, from: 1 },
      { command: KeyCommand.NextWeek, from: -7 },
      { command: KeyCommand.PreviousWeek, from: 7 },
    ];
    const clockMinutes = dstTransitions2026.flatMap((transition) => {
      const grid = weekGrid(transition.date, addDays(transition.date, 1), transition.timeZone);
      return steps.map((step) => {
        const landed = moveFocus(slot(addDays(transition.date, step.from), 600), step.command, grid);
        return { date: landed.date, clock: clockMinuteOf(landed, transition.timeZone) };
      });
    });
    const expected = dstTransitions2026.flatMap((transition) =>
      steps.map(() => ({ date: transition.date, clock: 600 })),
    );
    expect(clockMinutes).toEqual(expected);
  });
});

describe("isCommandAllowed", () => {
  const event = onEvent("2026-11-18", 600);
  const empty = slot("2026-11-18", 600);

  it("refuses delete, duplicate and pick up on read only", () => {
    expect(isCommandAllowed(KeyCommand.DeleteEvent, event, true)).toBe(false);
    expect(isCommandAllowed(KeyCommand.DuplicateEvent, event, true)).toBe(false);
    expect(isCommandAllowed(KeyCommand.PickUp, event, true)).toBe(false);
  });

  it("still opens a read-only event", () => {
    expect(isCommandAllowed(KeyCommand.OpenEvent, event, true)).toBe(true);
  });

  it("allows event commands on a writable event", () => {
    expect(isCommandAllowed(KeyCommand.DeleteEvent, event, false)).toBe(true);
    expect(isCommandAllowed(KeyCommand.DuplicateEvent, event, false)).toBe(true);
    expect(isCommandAllowed(KeyCommand.PickUp, event, false)).toBe(true);
  });

  it("picks up only on an event", () => {
    expect(isCommandAllowed(KeyCommand.PickUp, empty, false)).toBe(false);
    expect(isCommandAllowed(KeyCommand.OpenEvent, empty, false)).toBe(false);
    expect(isCommandAllowed(KeyCommand.DeleteEvent, empty, false)).toBe(false);
  });

  it("allows navigation and new events on a slot", () => {
    expect(isCommandAllowed(KeyCommand.NextDay, empty, true)).toBe(true);
    expect(isCommandAllowed(KeyCommand.NewEvent, empty, false)).toBe(true);
  });
});
