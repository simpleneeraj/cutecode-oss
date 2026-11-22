import { describe, expect, it } from "vitest";
import { occurrenceKey } from "@cutecode/calendar/event";
import { makeEvent } from "@cutecode/calendar/testing";
import { ChangeScope, ChangeSource } from "@cutecode/calendar/types";
import { applyRecurringSave, type SavedDraft } from "./save";
import { at, byId, now, occurrenceStarts, standupSeries } from "./change-fixtures";

function draftOf(overrides: Partial<SavedDraft> = {}): SavedDraft {
  const series = standupSeries();
  return {
    eventId: series.id,
    originalStart: at("2026-11-16", "09:00"),
    calendarId: series.calendarId,
    title: "Sync",
    start: series.start,
    end: series.end,
    allDay: false,
    timeZone: series.timeZone,
    recurrence: series.recurrence,
    source: ChangeSource.Form,
    ...overrides,
  };
}

function titlesByStart(events: ReturnType<typeof applyRecurringSave>) {
  return events.map((event) => [event.start, event.title]);
}

describe("applyRecurringSave", () => {
  it("renames only the edited occurrence for This", () => {
    const events = applyRecurringSave([standupSeries()], draftOf({ scope: ChangeScope.This }), now);
    expect(byId(events, "standup")).toMatchObject({ title: "Standup", start: at("2026-11-02", "09:00") });
    expect(byId(events, occurrenceKey("standup", at("2026-11-16", "09:00")))).toMatchObject({
      title: "Sync",
      start: at("2026-11-16", "09:00"),
      end: at("2026-11-16", "09:30"),
      recurrence: undefined,
    });
    expect(occurrenceStarts(events)).toHaveLength(10);
  });

  it("splits at the edited occurrence for Following without moving it", () => {
    const events = applyRecurringSave([standupSeries()], draftOf({ scope: ChangeScope.Following }), now);
    expect(titlesByStart(events)).toEqual([
      [at("2026-11-02", "09:00"), "Standup"],
      [at("2026-11-16", "09:00"), "Sync"],
    ]);
    expect(occurrenceStarts(events)).toHaveLength(10);
  });

  it("renames the series for All and keeps its start", () => {
    const events = applyRecurringSave([standupSeries()], draftOf({ scope: ChangeScope.All }), now);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ title: "Sync", start: at("2026-11-02", "09:00"), version: 2 });
    expect(events[0]).not.toHaveProperty("scope");
    expect(occurrenceStarts(events)).toHaveLength(10);
  });

  it("stops repeating for All when the draft drops the rule", () => {
    const events = applyRecurringSave([standupSeries()], draftOf({ scope: ChangeScope.All, recurrence: undefined }), now);
    expect(events[0]).toMatchObject({ start: at("2026-11-16", "09:00"), recurrence: undefined });
    expect(occurrenceStarts(events)).toEqual([at("2026-11-16", "09:00")]);
  });

  it("keeps the series rule when an exception is edited for All", () => {
    const exception = makeEvent({
      id: "late",
      seriesId: "standup",
      originalStart: at("2026-11-16", "09:00"),
      start: at("2026-11-16", "12:00"),
      end: at("2026-11-16", "12:30"),
    });
    const draft = draftOf({ eventId: "late", recurrence: undefined, scope: ChangeScope.All });
    const events = applyRecurringSave([standupSeries(), exception], draft, now);
    expect(byId(events, "standup")).toMatchObject({ title: "Sync", start: at("2026-11-02", "09:00") });
    expect(byId(events, "standup")?.recurrence).toBeDefined();
  });

  it("edits a plain event in place and keeps its bookings", () => {
    const plain = makeEvent({ resourceIds: ["atlas"] });
    const draft = draftOf({ eventId: plain.id, start: plain.start, end: plain.end, recurrence: undefined });
    const [edited] = applyRecurringSave([plain], draft, now);
    expect(edited).toMatchObject({ title: "Sync", start: plain.start, resourceIds: ["atlas"], recurrence: undefined });
  });
});
