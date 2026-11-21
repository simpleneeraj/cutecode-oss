import { describe, expect, it } from "vitest";
import { occurrenceOf } from "../event";
import { makeAllDayEvent, makeOccurrence, testZones } from "../testing";
import {
  ChangeScope,
  ChangeSource,
  DragKind,
  KeyCommand,
  OccurrenceKind,
  type CalendarEvent,
  type CreateIntent,
  type EventOccurrence,
  type MoveIntent,
  type ResizeIntent,
  type SlotPoint,
  type TimedOccurrence,
} from "../types";
import { isChangeProposal, toEventChange } from "./change";
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

function resizeIntent(occurrence: TimedOccurrence, target: SlotPoint, grab = target): ResizeIntent {
  return { kind: DragKind.Resize, source: ChangeSource.Resize, occurrence, grab, target };
}

function createIntent(anchor: SlotPoint): CreateIntent {
  return { kind: DragKind.Create, source: ChangeSource.Drag, calendarId: "work", anchor, target: anchor };
}

function changeOf(intent: MoveIntent | ResizeIntent, scope: ChangeScope = ChangeScope.This) {
  const proposal = proposeDrop(intent, defaultDragSettings, zone);
  if (!isChangeProposal(proposal)) {
    throw new Error("Expected a change proposal");
  }
  return toEventChange(proposal, scope);
}

describe("isChangeProposal", () => {
  it("is true for moves and resizes and false for creates", () => {
    const move = proposeDrop(
      moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 660)),
      defaultDragSettings,
      zone,
    );
    const resize = proposeDrop(resizeIntent(timed(), slot("2026-11-18", 690)), defaultDragSettings, zone);
    const create = proposeDrop(createIntent(slot("2026-11-18", 600)), defaultDragSettings, zone);
    expect(isChangeProposal(move)).toBe(true);
    expect(isChangeProposal(resize)).toBe(true);
    expect(isChangeProposal(create)).toBe(false);
  });
});

describe("toEventChange", () => {
  it("writes a timed move as ISO strings in the event zone", () => {
    expect(changeOf(moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-19", 720)))).toEqual({
      eventId: "design-crit",
      originalStart: "2026-11-18T10:00:00-08:00",
      start: "2026-11-19T12:00:00-08:00",
      end: "2026-11-19T13:00:00-08:00",
      allDay: false,
      resourceId: undefined,
      scope: ChangeScope.This,
      source: ChangeSource.Drag,
    });
  });

  it("keeps the event zone when the view zone differs", () => {
    const occurrence = timed({
      start: "2026-11-19T03:00:00+09:00",
      end: "2026-11-19T04:00:00+09:00",
      timeZone: testZones.tokyo,
    });
    const change = changeOf(moveIntent(occurrence, slot("2026-11-18", 600), slot("2026-11-18", 660)));
    expect(change.start).toBe("2026-11-19T04:00:00+09:00");
    expect(change.end).toBe("2026-11-19T05:00:00+09:00");
  });

  it("writes the new offset after a DST weekend", () => {
    const occurrence = timed({ start: "2026-10-31T10:00:00-07:00", end: "2026-10-31T11:00:00-07:00" });
    const change = changeOf(moveIntent(occurrence, slot("2026-10-31", 600), slot("2026-11-02", 600)));
    expect(change.originalStart).toBe("2026-10-31T10:00:00-07:00");
    expect(change.start).toBe("2026-11-02T10:00:00-08:00");
  });

  it("writes UTC events with Z", () => {
    const occurrence = timed({ start: "2026-11-18T18:00:00Z", end: "2026-11-18T19:00:00Z", timeZone: testZones.utc });
    const change = changeOf(moveIntent(occurrence, slot("2026-11-18", 600), slot("2026-11-18", 630)));
    expect(change.start).toBe("2026-11-18T18:30:00Z");
  });

  it("gives plain dates for an all-day move and keeps the exclusive end", () => {
    const occurrence = occurrenceOf(makeAllDayEvent("2026-11-18", "2026-11-20"));
    const change = changeOf(moveIntent(occurrence, slot("2026-11-18", 0), slot("2026-11-22", 300)));
    expect(change).toMatchObject({ start: "2026-11-22", end: "2026-11-24", allDay: true, originalStart: "2026-11-18" });
  });

  it("writes a resize across midnight with its source", () => {
    const occurrence = timed({ start: "2026-11-18T22:00:00-08:00", end: "2026-11-18T23:00:00-08:00" });
    const change = changeOf(resizeIntent(occurrence, slot("2026-11-19", 30)));
    expect(change).toMatchObject({
      start: "2026-11-18T22:00:00-08:00",
      end: "2026-11-19T00:30:00-08:00",
      source: ChangeSource.Resize,
    });
  });

  it("leaves the resource out of a resize that drifts into another column", () => {
    const change = changeOf(resizeIntent(timed(), slot("2026-11-18", 690, "room-b")));
    expect(change.resourceId).toBeUndefined();
    expect(change.end).toBe("2026-11-18T11:30:00-08:00");
  });

  it("carries the scope and target resource", () => {
    const intent = moveIntent(timed(), slot("2026-11-18", 600, "room-a"), slot("2026-11-18", 600, "room-b"));
    expect(changeOf(intent, ChangeScope.Following)).toMatchObject({
      scope: ChangeScope.Following,
      resourceId: "room-b",
    });
  });

  it("carries the keyboard source of a nudged move", () => {
    const intent: MoveIntent = {
      ...moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 600)),
      source: ChangeSource.Keyboard,
    };
    const nudged = nudgeIntent(intent, KeyCommand.NextHour, defaultDragSettings, zone);
    expect(changeOf(nudged)).toMatchObject({ start: "2026-11-18T10:15:00-08:00", source: ChangeSource.Keyboard });
  });
});
