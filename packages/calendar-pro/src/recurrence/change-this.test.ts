import { describe, expect, it } from "vitest";
import { occurrenceKey } from "@cutecode/calendar/event";
import { makeEvent } from "@cutecode/calendar/testing";
import { ChangeScope } from "@cutecode/calendar/types";
import { applyRecurringChange } from "./change";
import { at, byId, changeOf, expandYear, now, stampedAt, standupSeries } from "./change-fixtures";

describe("applyRecurringChange for This", () => {
  it("moves a non-repeating event and bumps its version", () => {
    const event = makeEvent();
    const [updated] = applyRecurringChange(
      [event],
      changeOf({
        eventId: event.id,
        originalStart: event.start,
        start: at("2026-11-18", "13:00"),
        end: at("2026-11-18", "14:00"),
      }),
      now,
    );
    expect(updated).toMatchObject({ start: at("2026-11-18", "13:00"), version: 2, updatedAt: stampedAt });
  });

  it("returns the events unchanged for an unknown id", () => {
    const events = [standupSeries()];
    expect(applyRecurringChange(events, changeOf({ eventId: "missing" }), now)).toBe(events);
  });

  it("writes an exception for This and keeps the occurrence key", () => {
    const series = standupSeries();
    const events = applyRecurringChange([series], changeOf({ resourceId: "room-a" }), now);
    expect(events).toHaveLength(2);
    expect(byId(events, "standup")).toBe(series);
    const exception = events[1];
    expect(exception).toMatchObject({
      id: occurrenceKey("standup", at("2026-11-16", "09:00")),
      seriesId: "standup",
      originalStart: at("2026-11-16", "09:00"),
      start: at("2026-11-16", "10:00"),
      recurrence: undefined,
      resourceIds: ["room-a"],
      version: 1,
      updatedAt: stampedAt,
    });
    const moved = expandYear(events).filter(
      (occurrence) => occurrence.key === occurrenceKey("standup", at("2026-11-16", "09:00")),
    );
    expect(moved).toHaveLength(1);
    expect(moved[0]?.event.start).toBe(at("2026-11-16", "10:00"));
    expect(expandYear(events)).toHaveLength(10);
  });

  it("updates the existing exception for a second This edit", () => {
    const first = applyRecurringChange([standupSeries()], changeOf({}), now);
    const second = applyRecurringChange(
      first,
      changeOf({ start: at("2026-11-16", "11:00"), end: at("2026-11-16", "11:30") }),
      now,
    );
    expect(second).toHaveLength(2);
    expect(second[1]).toMatchObject({ start: at("2026-11-16", "11:00"), version: 2 });
  });

  it("updates an exception targeted directly", () => {
    const first = applyRecurringChange([standupSeries()], changeOf({}), now);
    const exceptionId = first[1]?.id ?? "";
    const second = applyRecurringChange(
      first,
      changeOf({ eventId: exceptionId, start: at("2026-11-17", "09:00"), end: at("2026-11-17", "09:30") }),
      now,
    );
    expect(byId(second, exceptionId)).toMatchObject({ start: at("2026-11-17", "09:00"), version: 2 });
  });

  it("keeps a second booking when the move stays in the grabbed resource", () => {
    const series = standupSeries({ resourceIds: ["atlas", "sam"] });
    const events = applyRecurringChange([series], changeOf({ fromResourceId: "atlas", resourceId: "atlas" }), now);
    expect(events[1]?.resourceIds).toEqual(["atlas", "sam"]);
  });

  it("swaps only the grabbed booking across resources", () => {
    const series = standupSeries({ resourceIds: ["atlas", "sam"] });
    const change = changeOf({ fromResourceId: "atlas", resourceId: "borealis", scope: ChangeScope.All });
    const events = applyRecurringChange([series], change, now);
    expect(byId(events, "standup")?.resourceIds).toEqual(["borealis", "sam"]);
  });
});
