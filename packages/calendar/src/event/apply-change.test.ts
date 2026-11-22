import { describe, expect, it } from "vitest";

import { makeEvent, makeOccurrence } from "../testing";
import { ChangeScope, ChangeSource, Frequency, type EventChange } from "../types";
import { applyEventChange } from "./apply-change";
import { expandEach } from "./index";
import { removeOccurrence } from "./remove";

const change: EventChange = {
  eventId: "design-crit",
  originalStart: "2026-11-18T10:00:00-08:00",
  start: "2026-11-19T11:00:00-08:00",
  end: "2026-11-19T12:00:00-08:00",
  allDay: false,
  scope: ChangeScope.All,
  source: ChangeSource.Drag,
};

const now = Date.parse("2026-11-18T22:00:00Z");

const weekly = makeEvent({
  start: "2026-11-04T10:00:00-08:00",
  end: "2026-11-04T11:00:00-08:00",
  recurrence: { frequency: Frequency.Weekly, interval: 1 },
});

const third = { ...change, eventId: weekly.id, originalStart: "2026-11-18T10:00:00-08:00" };

const context = { range: { start: 0, end: Number.MAX_SAFE_INTEGER }, dates: { start: "2026-11-01", end: "2026-12-01" }, timeZone: weekly.timeZone };

describe("applyEventChange", () => {
  it("moves the changed event and bumps its version", () => {
    const [moved] = applyEventChange([makeEvent()], change, now);
    expect(moved).toMatchObject({ start: change.start, end: change.end, version: 2 });
    expect(moved?.updatedAt).toBe("2026-11-18T22:00:00.000Z");
  });

  it("leaves other events alone", () => {
    const other = makeEvent({ id: "other" });
    expect(applyEventChange([other], change, now)).toEqual([other]);
  });

  it("rebooks the resource when the change names one", () => {
    const [moved] = applyEventChange([makeEvent({ resourceIds: ["room-a"] })], { ...change, resourceId: "room-b" }, now);
    expect(moved?.resourceIds).toEqual(["room-b"]);
  });

  it("keeps every booking when the move stays in the grabbed resource", () => {
    const event = makeEvent({ resourceIds: ["atlas", "sam"] });
    const [moved] = applyEventChange([event], { ...change, fromResourceId: "atlas", resourceId: "atlas" }, now);
    expect(moved?.resourceIds).toEqual(["atlas", "sam"]);
  });

  it("swaps only the grabbed booking when the move changes resource", () => {
    const event = makeEvent({ resourceIds: ["atlas", "sam"] });
    const [moved] = applyEventChange([event], { ...change, fromResourceId: "atlas", resourceId: "borealis" }, now);
    expect(moved?.resourceIds).toEqual(["borealis", "sam"]);
  });

  it("drops the duplicate when the target resource is already booked", () => {
    const event = makeEvent({ resourceIds: ["atlas", "sam"] });
    const [moved] = applyEventChange([event], { ...change, fromResourceId: "atlas", resourceId: "sam" }, now);
    expect(moved?.resourceIds).toEqual(["sam"]);
  });

  it("writes an exception for This event and keeps the series", () => {
    const [series, exception] = applyEventChange([weekly], { ...third, scope: ChangeScope.This }, now);
    expect(series).toBe(weekly);
    expect(exception).toMatchObject({ seriesId: weekly.id, originalStart: third.originalStart, start: third.start });
    expect(exception?.recurrence).toBeUndefined();
  });

  it("splits the series for This and following", () => {
    const [ended, next] = applyEventChange([weekly], { ...third, scope: ChangeScope.Following }, now);
    expect(ended).toMatchObject({ start: weekly.start, recurrence: { until: "2026-11-18T09:59:59-08:00" } });
    expect(next).toMatchObject({ start: third.start, end: third.end, recurrence: { frequency: Frequency.Weekly } });
    expect(next?.id).not.toBe(weekly.id);
  });

  it("shifts the whole series by the occurrence delta for All events", () => {
    const [shifted] = applyEventChange([weekly], third, now);
    expect(shifted).toMatchObject({ start: "2026-11-05T11:00:00-08:00", end: "2026-11-05T12:00:00-08:00" });
  });

  it("lets an exception replace the series occurrence it overrides", () => {
    const first = { ...third, originalStart: weekly.start, scope: ChangeScope.This };
    const occurrences = expandEach(applyEventChange([weekly], first, now), context);
    expect(occurrences.map((occurrence) => occurrence.event.start)).toEqual([third.start]);
  });
});

describe("removeOccurrence", () => {
  const occurrence = makeOccurrence({ ...weekly, originalStart: third.originalStart });

  it("removes a single event", () => {
    expect(removeOccurrence([makeEvent()], makeOccurrence(), ChangeScope.All, now)).toEqual([]);
  });

  it("skips one date for This event", () => {
    const [series] = removeOccurrence([weekly], occurrence, ChangeScope.This, now);
    expect(series?.recurrence?.exceptionDates).toEqual([third.originalStart]);
  });

  it("hides a skipped first date from the default expander", () => {
    const first = makeOccurrence(weekly);
    expect(expandEach(removeOccurrence([weekly], first, ChangeScope.This, now), context)).toEqual([]);
  });

  it("ends the series for This and following", () => {
    const [series] = removeOccurrence([weekly], occurrence, ChangeScope.Following, now);
    expect(series?.recurrence?.until).toBe("2026-11-18T09:59:59-08:00");
  });

  it("removes the series and its exceptions for All events", () => {
    const exception = makeEvent({ id: "moved", seriesId: weekly.id, originalStart: weekly.start });
    expect(removeOccurrence([weekly, exception], occurrence, ChangeScope.All, now)).toEqual([]);
  });
});
