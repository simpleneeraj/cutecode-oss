import { describe, expect, it } from "vitest";
import { FocusTarget, type EventFocus, type SlotFocus } from "../../types";
import { eventKey, focusKeyOf, focusPropsOf, slotKey } from "./focus-key";

const slot: SlotFocus = { target: FocusTarget.Slot, date: "2026-11-18", minute: 600, columnKey: "2026-11-18" };
const onEvent: EventFocus = { ...slot, target: FocusTarget.Event, occurrenceKey: "design-crit@2026-11-18" };

describe("focusKeyOf", () => {
  it("keys a slot by its column, not its minute", () => {
    expect(focusKeyOf(slot)).toBe(slotKey("2026-11-18", "2026-11-18"));
    expect(focusKeyOf({ ...slot, minute: 660 })).toBe(focusKeyOf(slot));
  });

  it("keys each piece of an event by its day", () => {
    expect(focusKeyOf(onEvent)).toBe(eventKey("design-crit@2026-11-18", "2026-11-18", "2026-11-18"));
    expect(focusKeyOf({ ...onEvent, date: "2026-11-19" })).not.toBe(focusKeyOf(onEvent));
  });

  it("keys the copies of an event booked on two resources apart", () => {
    expect(focusKeyOf({ ...onEvent, columnKey: "atlas" })).not.toBe(focusKeyOf({ ...onEvent, columnKey: "sam" }));
  });
});

describe("focusPropsOf", () => {
  it("gives the grid one tab stop", () => {
    const current = slotKey("2026-11-18", "2026-11-18");
    const other = slotKey("2026-11-19", "2026-11-19");
    expect(focusPropsOf(current, slot)).toEqual({ tabIndex: 0, "data-focus-key": current });
    expect(focusPropsOf(other, slot).tabIndex).toBe(-1);
  });
});
