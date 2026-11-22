import { describe, expect, it } from "vitest";
import { instantAt, makeOccurrence } from "../../testing";
import { draftOf, targetKey, targetLabel } from "./session";
import { QuickEventMode, type QuickEventTarget } from "./target";

const slot = { start: instantAt("2026-11-19", "13:00"), end: instantAt("2026-11-19", "14:00"), allDay: false };

describe("quick event target", () => {
  it("keys and names a new slot and an existing event", () => {
    const created: QuickEventTarget = { mode: QuickEventMode.Create, slot, anchor: null };
    const occurrence = makeOccurrence();
    const read: QuickEventTarget = { mode: QuickEventMode.Read, occurrence, anchor: null };
    expect(targetKey(created)).toBe(`new|${slot.start}|${slot.end}|false`);
    expect(targetKey(read)).toBe(`event|${occurrence.key}`);
    expect(targetLabel(created)).toBe("New event");
    expect(targetLabel(read)).toBe("Design crit");
  });
});

describe("draftOf", () => {
  it("shows a new timed slot as the draft", () => {
    expect(draftOf({ mode: QuickEventMode.Create, slot, anchor: null })).toEqual({ start: slot.start, end: slot.end });
  });

  it("has no draft for an open event, an all day slot or nothing", () => {
    expect(draftOf({ mode: QuickEventMode.Read, occurrence: makeOccurrence(), anchor: null })).toBeNull();
    expect(draftOf({ mode: QuickEventMode.Create, slot: { ...slot, allDay: true }, anchor: null })).toBeNull();
    expect(draftOf(null)).toBeNull();
  });
});
