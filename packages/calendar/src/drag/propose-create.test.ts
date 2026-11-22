import { describe, expect, it } from "vitest";
import { occurrenceOf } from "../event";
import { instantAt, makeAllDayEvent, makeOccurrence, testZones } from "../testing";
import { milliseconds } from "../time";
import {
  ChangeSource,
  DragKind,
  KeyCommand,
  OccurrenceKind,
  type CalendarEvent,
  type CreateIntent,
  type EventOccurrence,
  type MoveIntent,
  type SlotPoint,
  type TimedOccurrence,
} from "../types";
import { nudgeIntent, proposeDrop } from "./propose";
import { defaultDragSettings } from "./snap";

const zone = testZones.losAngeles;

function slot(date: string, minute: number, resourceId?: string): SlotPoint {
  return { date, minute, columnKey: date, resourceId };
}

function timed(overrides: Partial<CalendarEvent> = {}): TimedOccurrence {
  const occurrence = makeOccurrence(overrides);
  if (occurrence.kind !== OccurrenceKind.Timed) {
    throw new Error("Expected a timed occurrence");
  }
  return occurrence;
}

function moveIntent(occurrence: EventOccurrence, grab: SlotPoint, target: SlotPoint): MoveIntent {
  return { kind: DragKind.Move, source: ChangeSource.Drag, occurrence, grab, target };
}

function createIntent(anchor: SlotPoint, target: SlotPoint): CreateIntent {
  return { kind: DragKind.Create, source: ChangeSource.Drag, calendarId: "work", anchor, target };
}

function durationMinutes(start: number, end: number): number {
  return (end - start) / milliseconds.minute;
}

describe("proposeDrop create", () => {
  it("snaps a click to 30 minutes and lasts an hour", () => {
    const point = slot("2026-11-18", 620, "room-a");
    const proposal = proposeDrop(createIntent(point, point), defaultDragSettings, zone);
    expect(proposal.start).toBe(instantAt("2026-11-18", "10:00"));
    expect(proposal.end).toBe(instantAt("2026-11-18", "11:00"));
    expect(proposal.resourceId).toBe("room-a");
  });

  it("covers the dragged slots on the 30 minute grid", () => {
    const intent = createIntent(slot("2026-11-18", 600), slot("2026-11-18", 700));
    const proposal = proposeDrop(intent, defaultDragSettings, zone);
    expect(proposal.start).toBe(instantAt("2026-11-18", "10:00"));
    expect(proposal.end).toBe(instantAt("2026-11-18", "12:00"));
  });

  it("creates when dragged upward", () => {
    const intent = createIntent(slot("2026-11-18", 660), slot("2026-11-18", 545));
    const proposal = proposeDrop(intent, defaultDragSettings, zone);
    expect(proposal.start).toBe(instantAt("2026-11-18", "09:00"));
    expect(proposal.end).toBe(instantAt("2026-11-18", "11:00"));
  });

  it("keeps at least one step for a tiny drag", () => {
    const intent = createIntent(slot("2026-11-18", 600), slot("2026-11-18", 601));
    const proposal = proposeDrop(intent, defaultDragSettings, zone);
    expect(durationMinutes(proposal.start, proposal.end)).toBe(30);
  });

  it("creates across midnight", () => {
    const intent = createIntent(slot("2026-11-18", 1410), slot("2026-11-19", 50));
    const proposal = proposeDrop(intent, defaultDragSettings, zone);
    expect(proposal.start).toBe(instantAt("2026-11-18", "23:30"));
    expect(proposal.end).toBe(instantAt("2026-11-19", "01:00"));
  });
});

describe("nudgeIntent", () => {
  const settings = defaultDragSettings;

  it("moves 15 minutes with the hour commands", () => {
    const intent = moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 600));
    expect(nudgeIntent(intent, KeyCommand.NextHour, settings, zone).target.minute).toBe(615);
    expect(nudgeIntent(intent, KeyCommand.PreviousHour, settings, zone).target.minute).toBe(585);
  });

  it("wraps to the previous day at midnight", () => {
    const intent = moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 0));
    const nudged = nudgeIntent(intent, KeyCommand.PreviousHour, settings, zone);
    expect(nudged.target).toEqual({ ...slot("2026-11-17", 1425), columnKey: "2026-11-18" });
  });

  it("moves a day and keeps the wall clock across DST", () => {
    const intent = moveIntent(timed(), slot("2026-10-31", 600), slot("2026-10-31", 600));
    const onFallDay = nudgeIntent(intent, KeyCommand.NextDay, settings, zone);
    expect(onFallDay.target).toMatchObject({ date: "2026-11-01", minute: 660 });
    const after = nudgeIntent(onFallDay, KeyCommand.NextDay, settings, zone);
    expect(after.target).toMatchObject({ date: "2026-11-02", minute: 600 });
    const back = nudgeIntent(after, KeyCommand.PreviousDay, settings, zone);
    expect(back.target).toMatchObject({ date: "2026-11-01", minute: 660 });
  });

  it("gives a nudged move the expected drop", () => {
    const intent = moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 600));
    const nextDay = nudgeIntent(intent, KeyCommand.NextDay, settings, zone);
    const nudged = nudgeIntent(nextDay, KeyCommand.NextHour, settings, zone);
    const proposal = proposeDrop(nudged, settings, zone);
    expect(proposal.start).toBe(instantAt("2026-11-19", "10:15"));
  });

  it("ignores hour commands for all-day events but moves them by days", () => {
    const occurrence = occurrenceOf(makeAllDayEvent("2026-11-18", "2026-11-19"));
    const intent = moveIntent(occurrence, slot("2026-11-18", 0), slot("2026-11-18", 0));
    expect(nudgeIntent(intent, KeyCommand.PreviousHour, settings, zone)).toBe(intent);
    expect(nudgeIntent(intent, KeyCommand.NextDay, settings, zone).target.date).toBe("2026-11-19");
  });

  it("moves a week with the week commands", () => {
    const intent = moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 600));
    expect(nudgeIntent(intent, KeyCommand.NextWeek, settings, zone).target).toMatchObject({ date: "2026-11-25", minute: 600 });
    expect(nudgeIntent(intent, KeyCommand.PreviousWeek, settings, zone).target.date).toBe("2026-11-11");
  });

  it("leaves other commands alone", () => {
    const intent = moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 600));
    expect(nudgeIntent(intent, KeyCommand.Search, settings, zone)).toBe(intent);
  });
});
