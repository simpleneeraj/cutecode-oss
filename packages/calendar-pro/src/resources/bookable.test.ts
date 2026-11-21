import { describe, expect, it } from "vitest";
import { defaultDragSettings, resolveDrop } from "@cutecode/calendar/drag";
import { instantAt, makeCalendar, makeOccurrence, makeResource, testZones } from "@cutecode/calendar/testing";
import {
  ChangeSource,
  DragKind,
  OccurrenceKind,
  RefusalReason,
  VerdictKind,
  type ConstraintContext,
  type DropProposal,
  type ResizeIntent,
  type Resource,
} from "@cutecode/calendar/types";
import { bookableHoursConstraint } from "./bookable";

const officeHours = { start: "08:00", end: "18:00" };
const roomA = makeResource({ bookableHours: officeHours });
const tokyoRoom = makeResource({ id: "tokyo-room", bookableHours: officeHours, timeZone: testZones.tokyo });
const openRoom = makeResource({ id: "open-room" });
const allDayRoom = makeResource({ id: "all-day-room", bookableHours: { start: "00:00", end: "24:00" } });
const nightLab = makeResource({ id: "night-lab", bookableHours: { start: "22:00", end: "06:00" } });

function contextWith(resources: Resource[]): ConstraintContext {
  return { calendars: [makeCalendar()], resources, timeZone: testZones.losAngeles };
}

const context = contextWith([roomA, tokyoRoom, openRoom, allDayRoom, nightLab]);

function proposal(start: number, end: number, resourceId?: string, allDay = false): DropProposal {
  const slot = { date: "2026-11-18", minute: 0, columnKey: "2026-11-18" };
  return {
    intent: { kind: DragKind.Create, source: ChangeSource.Drag, calendarId: "work", anchor: slot, target: slot },
    start,
    end,
    allDay,
    resourceId,
  };
}

function verdictOf(startClock: string, endClock: string, resourceId: string, endDate = "2026-11-18") {
  return bookableHoursConstraint(
    proposal(instantAt("2026-11-18", startClock), instantAt(endDate, endClock), resourceId),
    context,
  );
}

const refused = {
  kind: VerdictKind.Refused,
  reason: RefusalReason.OutsideBookableHours,
  allowedHours: officeHours,
};

describe("bookableHoursConstraint", () => {
  it("accepts a drop inside bookable hours", () => {
    expect(verdictOf("09:00", "10:00", "room-a")).toEqual({ kind: VerdictKind.Accepted });
  });

  it("accepts a drop that touches both edges", () => {
    expect(verdictOf("08:00", "18:00", "room-a").kind).toBe(VerdictKind.Accepted);
  });

  it("refuses a drop starting before opening", () => {
    expect(verdictOf("07:45", "08:30", "room-a")).toEqual(refused);
  });

  it("refuses a drop crossing the end edge", () => {
    expect(verdictOf("17:30", "18:15", "room-a")).toEqual(refused);
  });

  it("refuses a drop crossing midnight", () => {
    expect(verdictOf("17:00", "08:30", "room-a", "2026-11-19")).toEqual(refused);
    expect(verdictOf("23:00", "01:00", "all-day-room", "2026-11-19").kind).toBe(VerdictKind.Refused);
  });

  it("accepts a drop ending exactly at midnight when the resource closes at 24:00", () => {
    expect(verdictOf("22:00", "00:00", "all-day-room", "2026-11-19").kind).toBe(VerdictKind.Accepted);
  });

  it("checks hours in the resource zone", () => {
    expect(verdictOf("17:00", "18:00", "tokyo-room").kind).toBe(VerdictKind.Accepted);
    expect(verdictOf("09:00", "10:00", "tokyo-room")).toEqual(refused);
  });

  it("checks hours in the context zone when the resource has none", () => {
    const londonContext = { ...context, timeZone: testZones.london };
    const lateInLondon = proposal(instantAt("2026-11-18", "11:00"), instantAt("2026-11-18", "12:00"), "room-a");
    const morningInLondon = proposal(instantAt("2026-11-18", "01:00"), instantAt("2026-11-18", "02:00"), "room-a");
    expect(bookableHoursConstraint(lateInLondon, londonContext)).toEqual(refused);
    expect(bookableHoursConstraint(morningInLondon, londonContext).kind).toBe(VerdictKind.Accepted);
  });

  it("uses wall clock hours on the 25 hour fall day", () => {
    const fallDay = proposal(instantAt("2026-11-01", "17:00"), instantAt("2026-11-01", "18:00"), "room-a");
    const firstOneAm = proposal(instantAt("2026-11-01", "01:00"), instantAt("2026-11-01", "02:00"), "room-a");
    expect(bookableHoursConstraint(fallDay, context).kind).toBe(VerdictKind.Accepted);
    expect(bookableHoursConstraint(firstOneAm, context)).toEqual(refused);
  });

  it("accepts resources without bookable hours, unknown resources and drops without one", () => {
    expect(verdictOf("02:00", "03:00", "open-room").kind).toBe(VerdictKind.Accepted);
    expect(verdictOf("02:00", "03:00", "missing").kind).toBe(VerdictKind.Accepted);
    const unassigned = proposal(instantAt("2026-11-18", "02:00"), instantAt("2026-11-18", "03:00"));
    expect(bookableHoursConstraint(unassigned, context).kind).toBe(VerdictKind.Accepted);
  });

  it("accepts drops inside an overnight window", () => {
    expect(verdictOf("23:00", "01:00", "night-lab", "2026-11-19").kind).toBe(VerdictKind.Accepted);
    expect(verdictOf("22:00", "06:00", "night-lab", "2026-11-19").kind).toBe(VerdictKind.Accepted);
    expect(verdictOf("22:30", "23:30", "night-lab").kind).toBe(VerdictKind.Accepted);
    expect(verdictOf("02:00", "05:00", "night-lab").kind).toBe(VerdictKind.Accepted);
  });

  it("refuses drops outside an overnight window", () => {
    expect(verdictOf("21:00", "23:00", "night-lab").kind).toBe(VerdictKind.Refused);
    expect(verdictOf("05:00", "07:00", "night-lab").kind).toBe(VerdictKind.Refused);
    expect(verdictOf("12:00", "13:00", "night-lab").kind).toBe(VerdictKind.Refused);
    expect(verdictOf("23:00", "07:00", "night-lab", "2026-11-19").kind).toBe(VerdictKind.Refused);
    expect(verdictOf("02:00", "23:00", "night-lab").kind).toBe(VerdictKind.Refused);
  });

  it("accepts all-day drops", () => {
    const allDay = proposal(instantAt("2026-11-18", "00:00"), instantAt("2026-11-19", "00:00"), "room-a", true);
    expect(bookableHoursConstraint(allDay, context).kind).toBe(VerdictKind.Accepted);
  });

  it("checks a resize against the grabbed resource", () => {
    const occurrence = makeOccurrence({ resourceIds: ["room-a"] });
    if (occurrence.kind !== OccurrenceKind.Timed) {
      throw new Error("Expected a timed occurrence");
    }
    const grab = { date: "2026-11-18", minute: 660, columnKey: "room-a", resourceId: "room-a" };
    const target = { ...grab, minute: 1140 };
    const intent: ResizeIntent = { kind: DragKind.Resize, source: ChangeSource.Resize, occurrence, grab, target };
    const result = resolveDrop(intent, defaultDragSettings, context, [bookableHoursConstraint]);
    expect(result).toMatchObject({ kind: VerdictKind.Refused, verdict: refused });
  });
});
