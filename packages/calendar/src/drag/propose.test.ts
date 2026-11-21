import { describe, expect, it } from "vitest";
import { occurrenceOf } from "../event";
import { instantAt, makeAllDayEvent, makeOccurrence, testZones } from "../testing";
import { milliseconds, offsetMinutesAt, startOfDay, toWallClock } from "../time";
import {
  ChangeSource,
  DragKind,
  OccurrenceKind,
  type CalendarEvent,
  type EventOccurrence,
  type MoveIntent,
  type ResizeIntent,
  type SlotPoint,
  type TimedOccurrence,
} from "../types";
import { proposeDrop } from "./propose";
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

function resizeIntent(occurrence: TimedOccurrence, target: SlotPoint, grab = target): ResizeIntent {
  return { kind: DragKind.Resize, source: ChangeSource.Resize, occurrence, grab, target };
}

function durationMinutes(start: number, end: number): number {
  return (end - start) / milliseconds.minute;
}

describe("proposeDrop move", () => {
  it("snaps the start to 15 minutes", () => {
    const intent = moveIntent(timed(), slot("2026-11-18", 615), slot("2026-11-18", 682));
    const proposal = proposeDrop(intent, defaultDragSettings, zone);
    expect(proposal.start).toBe(instantAt("2026-11-18", "11:00"));
    expect(proposal.end).toBe(instantAt("2026-11-18", "12:00"));
    expect(proposal.allDay).toBe(false);
  });

  it("puts an off grid event back on the grid", () => {
    const occurrence = timed({ start: "2026-11-18T10:07:00-08:00", end: "2026-11-18T10:52:00-08:00" });
    const intent = moveIntent(occurrence, slot("2026-11-18", 607), slot("2026-11-18", 667));
    const proposal = proposeDrop(intent, defaultDragSettings, zone);
    expect(proposal.start).toBe(instantAt("2026-11-18", "11:00"));
    expect(durationMinutes(proposal.start, proposal.end)).toBe(45);
  });

  it("keeps an off grid event in place when dropped where it was grabbed", () => {
    const occurrence = timed({ start: "2026-11-18T10:07:00-08:00", end: "2026-11-18T10:52:00-08:00" });
    const pointer = moveIntent(occurrence, slot("2026-11-18", 620), slot("2026-11-18", 620));
    const keyboard: MoveIntent = { ...pointer, source: ChangeSource.Keyboard };
    for (const intent of [pointer, keyboard]) {
      const proposal = proposeDrop(intent, defaultDragSettings, zone);
      expect(proposal.start).toBe(occurrence.start);
      expect(proposal.end).toBe(occurrence.end);
    }
  });

  it("snaps an off grid event once the target leaves the grab point", () => {
    const occurrence = timed({ start: "2026-11-18T10:07:00-08:00", end: "2026-11-18T10:52:00-08:00" });
    const intent = moveIntent(occurrence, slot("2026-11-18", 620), slot("2026-11-18", 615));
    expect(proposeDrop(intent, defaultDragSettings, zone).start).toBe(instantAt("2026-11-18", "10:00"));
  });

  it("snaps an off grid event dropped in place in another column", () => {
    const occurrence = timed({ start: "2026-11-18T10:07:00-08:00", end: "2026-11-18T10:52:00-08:00" });
    const intent = moveIntent(occurrence, slot("2026-11-18", 620, "room-a"), slot("2026-11-18", 620, "room-b"));
    const proposal = proposeDrop(intent, defaultDragSettings, zone);
    expect(proposal.start).toBe(instantAt("2026-11-18", "10:00"));
    expect(proposal.resourceId).toBe("room-b");
  });

  it("moves across days to the same wall clock", () => {
    const intent = moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-20", 600));
    const proposal = proposeDrop(intent, defaultDragSettings, zone);
    expect(proposal.start).toBe(instantAt("2026-11-20", "10:00"));
    expect(proposal.end).toBe(instantAt("2026-11-20", "11:00"));
  });

  it("keeps the wall clock across a DST weekend", () => {
    const occurrence = timed({ start: "2026-10-31T10:00:00-07:00", end: "2026-10-31T11:00:00-07:00" });
    const intent = moveIntent(occurrence, slot("2026-10-31", 600), slot("2026-11-02", 600));
    const proposal = proposeDrop(intent, defaultDragSettings, zone);
    expect(proposal.start).toBe(instantAt("2026-11-02", "10:00"));
    expect(durationMinutes(proposal.start, proposal.end)).toBe(60);
  });

  it("follows elapsed time when dropped on the fall day", () => {
    const occurrence = timed({ start: "2026-10-31T10:00:00-07:00", end: "2026-10-31T11:00:00-07:00" });
    const intent = moveIntent(occurrence, slot("2026-10-31", 600), slot("2026-11-01", 600));
    const proposal = proposeDrop(intent, defaultDragSettings, zone);
    expect(proposal.start).toBe(instantAt("2026-11-01", "09:00"));
  });

  it("lands on the repeated 1 AM inside the fall day", () => {
    const occurrence = timed({ start: "2026-11-01T00:00:00-07:00", end: "2026-11-01T00:30:00-07:00" });
    const intent = moveIntent(occurrence, slot("2026-11-01", 0), slot("2026-11-01", 120));
    const proposal = proposeDrop(intent, defaultDragSettings, zone);
    expect(toWallClock(proposal.start, zone)).toEqual({ date: "2026-11-01", minute: 60 });
    expect(offsetMinutesAt(proposal.start, zone)).toBe(-480);
    expect(durationMinutes(proposal.start, proposal.end)).toBe(30);
  });

  it("skips the missing hour inside the spring day", () => {
    const occurrence = timed({ start: "2026-03-08T00:00:00-08:00", end: "2026-03-08T01:00:00-08:00" });
    const intent = moveIntent(occurrence, slot("2026-03-08", 0), slot("2026-03-08", 120));
    const proposal = proposeDrop(intent, defaultDragSettings, zone);
    expect(toWallClock(proposal.start, zone)).toEqual({ date: "2026-03-08", minute: 180 });
  });

  it("moves a crossing midnight event whole when grabbed by its second piece", () => {
    const occurrence = timed({ start: "2026-11-17T23:00:00-08:00", end: "2026-11-18T01:00:00-08:00" });
    const intent = moveIntent(occurrence, slot("2026-11-18", 30), slot("2026-11-19", 30));
    const proposal = proposeDrop(intent, defaultDragSettings, zone);
    expect(proposal.start).toBe(instantAt("2026-11-18", "23:00"));
    expect(proposal.end).toBe(instantAt("2026-11-19", "01:00"));
  });

  it("moves an all-day event by whole days and keeps the exclusive end", () => {
    const occurrence = occurrenceOf(makeAllDayEvent("2026-11-18", "2026-11-20"));
    const intent = moveIntent(occurrence, slot("2026-11-18", 0), slot("2026-11-21", 500));
    const proposal = proposeDrop(intent, defaultDragSettings, zone);
    expect(proposal.allDay).toBe(true);
    expect(proposal.start).toBe(startOfDay("2026-11-21", zone));
    expect(proposal.end).toBe(startOfDay("2026-11-23", zone));
  });

  it("moves an all-day event across the fall day by calendar days", () => {
    const occurrence = occurrenceOf(makeAllDayEvent("2026-10-31", "2026-11-01"));
    const intent = moveIntent(occurrence, slot("2026-10-31", 0), slot("2026-11-01", 0));
    const proposal = proposeDrop(intent, defaultDragSettings, zone);
    expect(proposal.start).toBe(startOfDay("2026-11-01", zone));
    expect(durationMinutes(proposal.start, proposal.end)).toBe(1500);
  });

  it("sets the resource of the target column", () => {
    const intent = moveIntent(timed(), slot("2026-11-18", 600, "room-a"), slot("2026-11-18", 600, "room-b"));
    expect(proposeDrop(intent, defaultDragSettings, zone).resourceId).toBe("room-b");
  });
});

describe("proposeDrop resize", () => {
  it("snaps the end to 15 minutes", () => {
    const proposal = proposeDrop(resizeIntent(timed(), slot("2026-11-18", 700)), defaultDragSettings, zone);
    expect(proposal.start).toBe(instantAt("2026-11-18", "10:00"));
    expect(proposal.end).toBe(instantAt("2026-11-18", "11:45"));
  });

  it("keeps the grabbed resource when the pointer drifts into another column", () => {
    const intent = resizeIntent(timed(), slot("2026-11-18", 700, "room-b"), slot("2026-11-18", 660, "room-a"));
    const proposal = proposeDrop(intent, defaultDragSettings, zone);
    expect(proposal.resourceId).toBe("room-a");
    expect(proposal.end).toBe(instantAt("2026-11-18", "11:45"));
  });

  it("clamps to 15 minutes below the minimum", () => {
    const proposal = proposeDrop(resizeIntent(timed(), slot("2026-11-18", 604)), defaultDragSettings, zone);
    expect(proposal.end).toBe(instantAt("2026-11-18", "10:15"));
  });

  it("clamps when dragged above the start", () => {
    const proposal = proposeDrop(resizeIntent(timed(), slot("2026-11-18", 480)), defaultDragSettings, zone);
    expect(proposal.end).toBe(instantAt("2026-11-18", "10:15"));
  });

  it("resizes across midnight", () => {
    const occurrence = timed({ start: "2026-11-18T22:00:00-08:00", end: "2026-11-18T23:00:00-08:00" });
    const proposal = proposeDrop(resizeIntent(occurrence, slot("2026-11-19", 30)), defaultDragSettings, zone);
    expect(proposal.end).toBe(instantAt("2026-11-19", "00:30"));
  });

  it("measures elapsed time on the fall day", () => {
    const occurrence = timed({ start: "2026-11-01T00:00:00-07:00", end: "2026-11-01T00:30:00-07:00" });
    const proposal = proposeDrop(resizeIntent(occurrence, slot("2026-11-01", 180)), defaultDragSettings, zone);
    expect(durationMinutes(proposal.start, proposal.end)).toBe(180);
    expect(toWallClock(proposal.end, zone).minute).toBe(120);
  });
});
