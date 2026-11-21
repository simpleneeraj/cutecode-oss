import { describe, expect, it, vi } from "vitest";
import { instantAt, makeCalendar, makeOccurrence, makeResource, testZones } from "../testing";
import {
  ChangeSource,
  DragKind,
  OccurrenceKind,
  RefusalReason,
  VerdictKind,
  type CalendarEvent,
  type ConstraintContext,
  type CreateIntent,
  type DropConstraint,
  type DropProposal,
  type EventOccurrence,
  type MoveIntent,
  type ResizeIntent,
  type SlotPoint,
  type TimedOccurrence,
} from "../types";
import { allowedHoursConstraint, checkDrop, resolveDrop } from "./constrain";
import { proposeDrop } from "./propose";
import { defaultDragSettings } from "./snap";

const zone = testZones.losAngeles;
const workHours = { start: "09:00", end: "17:00" };

const context: ConstraintContext = {
  calendars: [makeCalendar(), makeCalendar({ id: "team", name: "Team holidays", readOnly: true })],
  resources: [makeResource(), makeResource({ id: "room-b", name: "Room B" })],
  timeZone: zone,
};

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

function createIntent(calendarId: string, anchor: SlotPoint): CreateIntent {
  return { kind: DragKind.Create, source: ChangeSource.Drag, calendarId, anchor, target: anchor };
}

function propose(intent: MoveIntent | ResizeIntent | CreateIntent): DropProposal {
  return proposeDrop(intent, defaultDragSettings, zone);
}

describe("checkDrop", () => {
  const refuseTooShort: DropConstraint = () => ({ kind: VerdictKind.Refused, reason: RefusalReason.TooShort });

  it("accepts when every constraint accepts", () => {
    const proposal = propose(moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 660)));
    expect(checkDrop(proposal, context, [])).toEqual({ kind: VerdictKind.Accepted });
  });

  it("runs core constraints before plugin ones", () => {
    const proposal = propose(
      moveIntent(timed({ calendarId: "team" }), slot("2026-11-18", 600), slot("2026-11-18", 660)),
    );
    expect(checkDrop(proposal, context, [refuseTooShort])).toMatchObject({ reason: RefusalReason.ReadOnly });
  });

  it("returns the first plugin refusal", () => {
    const proposal = propose(moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 1020)));
    const verdict = checkDrop(proposal, context, [allowedHoursConstraint(workHours), refuseTooShort]);
    expect(verdict).toMatchObject({ reason: RefusalReason.OutsideAllowedHours });
  });

  it("does not call later constraints after a refusal", () => {
    const record = vi.fn<DropConstraint>(() => ({ kind: VerdictKind.Accepted }));
    const proposal = propose(moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 660)));
    checkDrop(proposal, context, [refuseTooShort, record]);
    expect(record).not.toHaveBeenCalled();
  });
});

describe("resolveDrop", () => {
  it("accepts a valid move with its proposal", () => {
    const intent = moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-19", 720));
    const result = resolveDrop(intent, defaultDragSettings, context, []);
    expect(result.kind).toBe(VerdictKind.Accepted);
    expect(result.proposal.start).toBe(instantAt("2026-11-19", "12:00"));
  });

  it("applies the allowed hours from the settings", () => {
    const settings = { ...defaultDragSettings, allowedHours: workHours };
    const intent = moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 1080));
    const result = resolveDrop(intent, settings, context, []);
    expect(result).toMatchObject({
      kind: VerdictKind.Refused,
      verdict: { reason: RefusalReason.OutsideAllowedHours, allowedHours: workHours },
    });
    expect(result.proposal.start).toBe(instantAt("2026-11-18", "18:00"));
  });

  it("names the read-only calendar", () => {
    const intent = createIntent("team", slot("2026-11-18", 600));
    expect(resolveDrop(intent, defaultDragSettings, context, [])).toMatchObject({
      kind: VerdictKind.Refused,
      verdict: { reason: RefusalReason.ReadOnly, calendarName: "Team holidays" },
    });
  });

  it("carries the target resource", () => {
    const intent = moveIntent(timed(), slot("2026-11-18", 600, "room-a"), slot("2026-11-18", 600, "room-b"));
    const result = resolveDrop(intent, defaultDragSettings, context, []);
    expect(result.kind).toBe(VerdictKind.Accepted);
    expect(result.proposal.resourceId).toBe("room-b");
  });

  it("keeps the resource of a resize that drifts into another column", () => {
    const intent = resizeIntent(timed(), slot("2026-11-18", 690, "room-b"), slot("2026-11-18", 660, "room-a"));
    const result = resolveDrop(intent, defaultDragSettings, context, []);
    expect(result.kind).toBe(VerdictKind.Accepted);
    expect(result.proposal.resourceId).toBe("room-a");
  });

  it("refuses a resize that drifts into another column but keeps the end", () => {
    const intent = resizeIntent(timed(), slot("2026-11-18", 662, "room-b"));
    expect(resolveDrop(intent, defaultDragSettings, context, [])).toMatchObject({
      verdict: { reason: RefusalReason.Unchanged },
    });
  });

  it("reuses the allowed hours constraint for the same settings", () => {
    const settings = { ...defaultDragSettings, allowedHours: workHours };
    const inside = moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 660));
    const outside = moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 1080));
    expect(resolveDrop(inside, settings, context, []).kind).toBe(VerdictKind.Accepted);
    expect(resolveDrop(outside, settings, context, []).kind).toBe(VerdictKind.Refused);
    expect(resolveDrop(outside, defaultDragSettings, context, []).kind).toBe(VerdictKind.Accepted);
  });

  it("runs settings constraints before plugin ones", () => {
    const settings = { ...defaultDragSettings, allowedHours: workHours };
    const refuseTooShort: DropConstraint = () => ({ kind: VerdictKind.Refused, reason: RefusalReason.TooShort });
    const intent = moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 1080));
    expect(resolveDrop(intent, settings, context, [refuseTooShort])).toMatchObject({
      verdict: { reason: RefusalReason.OutsideAllowedHours },
    });
  });

  it("passes plugin constraints through", () => {
    const refuseRoomB: DropConstraint = (proposal) =>
      proposal.resourceId === "room-b"
        ? { kind: VerdictKind.Refused, reason: RefusalReason.OutsideBookableHours }
        : { kind: VerdictKind.Accepted };
    const intent = moveIntent(timed(), slot("2026-11-18", 600, "room-a"), slot("2026-11-18", 600, "room-b"));
    expect(resolveDrop(intent, defaultDragSettings, context, [refuseRoomB])).toMatchObject({
      verdict: { reason: RefusalReason.OutsideBookableHours },
    });
  });
});
