import { describe, expect, it } from "vitest";

import { defaultDragSettings, nudgeIntent, resolveDrop } from "../../drag";
import { occurrenceOf } from "../../event";
import { instantAt, makeCalendar, makeEvent, testZones } from "../../testing";
import { AnnouncementKind, ChangeSource, DragKind, KeyCommand, OccurrenceKind, type MoveIntent } from "../../types";
import { carriedAnnouncement, isUnchanged, pickedUpAnnouncement } from "./keyboard-carry";

const zone = testZones.losAngeles;
const context = { calendars: [makeCalendar()], resources: [], timeZone: zone };
const allowed = { ...defaultDragSettings, allowedHours: { start: "07:00", end: "19:00" } };

function keyboardMove(): MoveIntent {
  const occurrence = occurrenceOf(makeEvent());
  if (occurrence.kind !== OccurrenceKind.Timed) {
    throw new Error("Expected a timed occurrence");
  }
  const grab = { date: "2026-11-18", minute: 600, columnKey: "day" };
  return { kind: DragKind.Move, source: ChangeSource.Keyboard, occurrence, grab, target: grab };
}

const resolve = (intent: MoveIntent) => resolveDrop(intent, allowed, context, []);

describe("keyboard carry", () => {
  it("treats a pickup in place as unchanged and names where it sits", () => {
    const intent = keyboardMove();
    const result = resolve(intent);
    expect(isUnchanged(result)).toBe(true);
    expect(pickedUpAnnouncement(intent.occurrence, result)).toEqual({
      kind: AnnouncementKind.PickedUp,
      title: "Design crit",
      start: instantAt("2026-11-18", "10:00"),
      end: instantAt("2026-11-18", "11:00"),
      allDay: false,
    });
  });

  it("announces each allowed step", () => {
    const nudged = nudgeIntent(keyboardMove(), KeyCommand.NextHour, defaultDragSettings, zone);
    const result = resolve(nudged);
    expect(isUnchanged(result)).toBe(false);
    expect(carriedAnnouncement(result)).toMatchObject({
      kind: AnnouncementKind.Carried,
      start: instantAt("2026-11-18", "10:15"),
      isAllowed: true,
    });
  });

  it("marks a step outside the allowed hours", () => {
    const late = { ...keyboardMove(), target: { date: "2026-11-18", minute: 1110, columnKey: "day" } };
    expect(carriedAnnouncement(resolve(late))).toMatchObject({ isAllowed: false });
  });
});
