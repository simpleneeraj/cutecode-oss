import { describe, expect, it } from "vitest";
import { occurrenceOf } from "../event";
import { instantAt, makeAllDayEvent, makeCalendar, makeOccurrence, makeResource, testZones } from "../testing";
import {
  ChangeSource,
  DragKind,
  OccurrenceKind,
  RefusalReason,
  VerdictKind,
  type CalendarEvent,
  type ConstraintContext,
  type CreateIntent,
  type DropProposal,
  type EventOccurrence,
  type MoveIntent,
  type ResizeIntent,
  type SlotPoint,
  type TimedOccurrence,
} from "../types";
import { allowedHoursConstraint, readOnlyConstraint, resolveDrop, unchangedConstraint } from "./constrain";
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

describe("readOnlyConstraint", () => {
  it("accepts a writable calendar", () => {
    const proposal = propose(moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 660)));
    expect(readOnlyConstraint(proposal, context)).toEqual({ kind: VerdictKind.Accepted });
  });

  it("names the read-only calendar it refuses", () => {
    const occurrence = timed({ calendarId: "team" });
    const proposal = propose(moveIntent(occurrence, slot("2026-11-18", 600), slot("2026-11-18", 660)));
    expect(readOnlyConstraint(proposal, context)).toEqual({
      kind: VerdictKind.Refused,
      reason: RefusalReason.ReadOnly,
      calendarName: "Team holidays",
    });
  });

  it("checks the target calendar of a create", () => {
    const proposal = propose(createIntent("team", slot("2026-11-18", 600)));
    expect(readOnlyConstraint(proposal, context)).toMatchObject({ reason: RefusalReason.ReadOnly });
    const writable = propose(createIntent("work", slot("2026-11-18", 600)));
    expect(readOnlyConstraint(writable, context).kind).toBe(VerdictKind.Accepted);
  });

  it("refuses an unknown calendar without a name", () => {
    const proposal = propose(createIntent("missing", slot("2026-11-18", 600)));
    const verdict = readOnlyConstraint(proposal, context);
    expect(verdict).toMatchObject({ reason: RefusalReason.ReadOnly, calendarName: undefined });
  });
});

describe("allowedHoursConstraint", () => {
  const constraint = allowedHoursConstraint(workHours);

  it("accepts a drop inside the hours, edges included", () => {
    const proposal = propose(moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 960)));
    expect(proposal.end).toBe(instantAt("2026-11-18", "17:00"));
    expect(constraint(proposal, context).kind).toBe(VerdictKind.Accepted);
    const opening = propose(moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 540)));
    expect(constraint(opening, context).kind).toBe(VerdictKind.Accepted);
  });

  it("refuses a drop outside the hours and carries them", () => {
    const proposal = propose(moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 990)));
    expect(constraint(proposal, context)).toEqual({
      kind: VerdictKind.Refused,
      reason: RefusalReason.OutsideAllowedHours,
      allowedHours: workHours,
    });
  });

  it("refuses a drop that starts too early", () => {
    const proposal = propose(moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 510)));
    expect(constraint(proposal, context).kind).toBe(VerdictKind.Refused);
  });

  it("refuses a resize past closing", () => {
    const proposal = propose(resizeIntent(timed(), slot("2026-11-18", 1050)));
    expect(constraint(proposal, context)).toMatchObject({ reason: RefusalReason.OutsideAllowedHours });
  });

  it("refuses an event that crosses midnight", () => {
    const occurrence = timed({ start: "2026-11-18T22:00:00-08:00", end: "2026-11-19T01:00:00-08:00" });
    const proposal = propose(moveIntent(occurrence, slot("2026-11-18", 1320), slot("2026-11-18", 1320)));
    expect(allowedHoursConstraint({ start: "00:00", end: "23:59" })(proposal, context).kind).toBe(VerdictKind.Refused);
  });

  it("accepts a drop that ends at a 24:00 close", () => {
    const lateHours = allowedHoursConstraint({ start: "18:00", end: "24:00" });
    const proposal = propose(moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 1380)));
    expect(proposal.end).toBe(instantAt("2026-11-19", "00:00"));
    expect(lateHours(proposal, context).kind).toBe(VerdictKind.Accepted);
    const past = propose(moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 1395)));
    expect(lateHours(past, context).kind).toBe(VerdictKind.Refused);
  });

  it("accepts drops inside overnight hours", () => {
    const nightHours = allowedHoursConstraint({ start: "22:00", end: "06:00" });
    const occurrence = timed({ start: "2026-11-18T23:00:00-08:00", end: "2026-11-19T01:00:00-08:00" });
    const late = propose(moveIntent(occurrence, slot("2026-11-18", 1380), slot("2026-11-18", 1380)));
    const noon = propose(moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 720)));
    expect(nightHours(late, context).kind).toBe(VerdictKind.Accepted);
    expect(nightHours(noon, context).kind).toBe(VerdictKind.Refused);
  });

  it("reads the wall clock on the fall day", () => {
    const occurrence = timed({ start: "2026-10-31T10:00:00-07:00", end: "2026-10-31T11:00:00-07:00" });
    const proposal = propose(moveIntent(occurrence, slot("2026-10-31", 600), slot("2026-11-01", 660)));
    expect(proposal.start).toBe(instantAt("2026-11-01", "10:00"));
    expect(constraint(proposal, context).kind).toBe(VerdictKind.Accepted);
  });

  it("accepts all-day drops", () => {
    const occurrence = occurrenceOf(makeAllDayEvent("2026-11-18", "2026-11-19"));
    const proposal = propose(moveIntent(occurrence, slot("2026-11-18", 0), slot("2026-11-20", 0)));
    expect(constraint(proposal, context).kind).toBe(VerdictKind.Accepted);
  });
});

describe("unchangedConstraint", () => {
  it("refuses a move back to the same time and column", () => {
    const proposal = propose(moveIntent(timed(), slot("2026-11-18", 600), slot("2026-11-18", 605)));
    expect(unchangedConstraint(proposal, context)).toEqual({
      kind: VerdictKind.Refused,
      reason: RefusalReason.Unchanged,
    });
  });

  it("accepts the same time in another resource column", () => {
    const intent = moveIntent(timed(), slot("2026-11-18", 600, "room-a"), slot("2026-11-18", 600, "room-b"));
    expect(unchangedConstraint(propose(intent), context).kind).toBe(VerdictKind.Accepted);
  });

  it("refuses an all-day move to the same day", () => {
    const occurrence = occurrenceOf(makeAllDayEvent("2026-11-18", "2026-11-19"));
    const same = propose(moveIntent(occurrence, slot("2026-11-18", 0), slot("2026-11-18", 400)));
    expect(unchangedConstraint(same, context).kind).toBe(VerdictKind.Refused);
    const moved = propose(moveIntent(occurrence, slot("2026-11-18", 0), slot("2026-11-19", 0)));
    expect(unchangedConstraint(moved, context).kind).toBe(VerdictKind.Accepted);
  });

  it("refuses an off grid event dropped where it was grabbed", () => {
    const occurrence = timed({ start: "2026-11-18T10:07:00-08:00", end: "2026-11-18T10:52:00-08:00" });
    const pointer = moveIntent(occurrence, slot("2026-11-18", 620), slot("2026-11-18", 620));
    const keyboard: MoveIntent = { ...pointer, source: ChangeSource.Keyboard };
    for (const intent of [pointer, keyboard]) {
      expect(resolveDrop(intent, defaultDragSettings, context, [])).toMatchObject({
        kind: VerdictKind.Refused,
        verdict: { reason: RefusalReason.Unchanged },
      });
    }
  });

  it("refuses a resize that keeps the end", () => {
    const same = propose(resizeIntent(timed(), slot("2026-11-18", 662)));
    expect(unchangedConstraint(same, context).kind).toBe(VerdictKind.Refused);
    const longer = propose(resizeIntent(timed(), slot("2026-11-18", 690)));
    expect(unchangedConstraint(longer, context).kind).toBe(VerdictKind.Accepted);
  });

  it("always accepts a create", () => {
    const proposal = propose(createIntent("work", slot("2026-11-18", 600)));
    expect(unchangedConstraint(proposal, context).kind).toBe(VerdictKind.Accepted);
  });
});
