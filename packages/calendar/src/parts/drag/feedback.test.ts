import { describe, expect, it } from "vitest";

import { defaultDragSettings, resolveDrop } from "../../drag";
import { occurrenceOf } from "../../event";
import { makeAllDayEvent, makeCalendar, makeEvent, makeSettings, testZones } from "../../testing";
import {
  AnnouncementKind,
  ChangeSource,
  DragKind,
  OccurrenceKind,
  RefusalReason,
  type DragIntent,
  type TimedOccurrence,
} from "../../types";
import { dragTip, dropAnnouncement, isRefusal, readOnlyAnnouncement, TipIcon } from "./feedback";
import { monthMoveIntent } from "./month-intent";

const settings = makeSettings();
const zone = testZones.losAngeles;
const work = makeCalendar();
const holidays = makeCalendar({ id: "holidays", name: "US holidays", readOnly: true });
const context = { calendars: [work, holidays], resources: [], timeZone: zone };
const allowed = { ...defaultDragSettings, allowedHours: { start: "07:00", end: "19:00" } };

function timedOccurrence(): TimedOccurrence {
  const occurrence = occurrenceOf(makeEvent());
  if (occurrence.kind !== OccurrenceKind.Timed) {
    throw new Error("Expected a timed occurrence");
  }
  return occurrence;
}

function moveTo(date: string, minute: number): DragIntent {
  const grab = { date: "2026-11-18", minute: 600, columnKey: "day" };
  return {
    kind: DragKind.Move,
    source: ChangeSource.Drag,
    occurrence: timedOccurrence(),
    grab,
    target: { ...grab, date, minute },
  };
}

describe("dragTip", () => {
  it("names the day and the snapped time while moving", () => {
    const result = resolveDrop(moveTo("2026-11-19", 735), allowed, context, []);
    expect(dragTip(result, settings)).toEqual({ text: "Thu, 12:15 – 1:15 PM", icon: TipIcon.Grab });
  });

  it("says why a drop outside the allowed hours is refused", () => {
    const result = resolveDrop(moveTo("2026-11-18", 1170), allowed, context, []);
    expect(isRefusal(result)).toBe(true);
    expect(dragTip(result, settings).text).toBe("Outside 7 AM to 7 PM");
  });

  it("names a read only calendar", () => {
    const occurrence = occurrenceOf(makeAllDayEvent("2026-11-26", "2026-11-27", { calendarId: "holidays" }));
    const intent = monthMoveIntent(occurrence, "2026-11-26", "2026-11-27", zone);
    const result = resolveDrop(intent, allowed, context, []);
    expect(dragTip(result, settings)).toEqual({ text: "US holidays is read only", icon: TipIcon.Lock });
  });

  it("does not treat an unmoved pick up as a refusal", () => {
    const result = resolveDrop(moveTo("2026-11-18", 600), allowed, context, []);
    expect(isRefusal(result)).toBe(false);
    expect(dragTip(result, settings).text).toBe("Wed, 10 – 11 AM");
  });
});

describe("dropAnnouncement", () => {
  it("announces a move", () => {
    const result = resolveDrop(moveTo("2026-11-19", 660), allowed, context, []);
    expect(dropAnnouncement(result)).toMatchObject({ kind: AnnouncementKind.Moved, title: "Design crit" });
  });

  it("announces a refusal with the allowed hours", () => {
    const result = resolveDrop(moveTo("2026-11-18", 1170), allowed, context, []);
    expect(dropAnnouncement(result)).toEqual({
      kind: AnnouncementKind.Refused,
      reason: RefusalReason.OutsideAllowedHours,
      allowedHours: allowed.allowedHours,
    });
  });

  it("stays quiet when nothing moved", () => {
    const result = resolveDrop(moveTo("2026-11-18", 600), allowed, context, []);
    expect(dropAnnouncement(result)).toBeNull();
  });

  it("announces a resize with the new end", () => {
    const occurrence = timedOccurrence();
    const grab = { date: "2026-11-18", minute: 660, columnKey: "day" };
    const intent: DragIntent = {
      kind: DragKind.Resize,
      source: ChangeSource.Resize,
      occurrence,
      grab,
      target: { ...grab, minute: 765 },
    };
    const result = resolveDrop(intent, allowed, context, []);
    expect(dropAnnouncement(result)).toMatchObject({
      kind: AnnouncementKind.Resized,
      end: occurrence.end + 105 * 60000,
    });
  });
});

describe("readOnlyAnnouncement", () => {
  it("names the event and its calendar", () => {
    const occurrence = occurrenceOf(
      makeAllDayEvent("2026-11-26", "2026-11-27", { title: "Thanksgiving", calendarId: "holidays" }),
    );
    const result = resolveDrop(monthMoveIntent(occurrence, "2026-11-26", "2026-11-26", zone), allowed, context, []);
    expect(readOnlyAnnouncement(result)).toEqual({
      kind: AnnouncementKind.ReadOnly,
      title: "Thanksgiving",
      calendarName: "US holidays",
    });
  });
});

describe("monthMoveIntent", () => {
  it("keeps the wall time when a timed event moves days", () => {
    const intent = monthMoveIntent(timedOccurrence(), "2026-11-18", "2026-11-20", zone);
    const result = resolveDrop(intent, allowed, context, []);
    expect(result.proposal.start - timedOccurrence().start).toBe(2 * 24 * 60 * 60000);
  });

  it("keeps the wall time across the fall clock change", () => {
    const occurrence = occurrenceOf(
      makeEvent({ start: "2026-10-31T10:00:00-07:00", end: "2026-10-31T11:00:00-07:00" }),
    );
    const intent = monthMoveIntent(occurrence, "2026-10-31", "2026-11-01", zone);
    const result = resolveDrop(intent, allowed, context, []);
    expect(new Date(result.proposal.start).toISOString()).toBe("2026-11-01T18:00:00.000Z");
  });
});
