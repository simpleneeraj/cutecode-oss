import { describe, expect, it } from "vitest";

import { makeAllDayEvent, makeEvent, makeOccurrence } from "../testing";
import { Frequency } from "../types";
import { duplicateOccurrence } from "./duplicate";
import { occurrenceOf } from "./index";

const now = Date.parse("2026-11-18T22:00:00Z");

describe("duplicateOccurrence", () => {
  it("copies a timed event at the same time with a new id", () => {
    const copy = duplicateOccurrence(makeOccurrence(), "copy", now);
    expect(copy).toMatchObject({ id: "copy", title: "Design crit", version: 1, allDay: false });
    expect(Date.parse(copy.start)).toBe(Date.parse("2026-11-18T10:00:00-08:00"));
  });

  it("copies an all-day event by date", () => {
    const copy = duplicateOccurrence(occurrenceOf(makeAllDayEvent("2026-11-18", "2026-11-20")), "copy", now);
    expect(copy).toMatchObject({ start: "2026-11-18", end: "2026-11-20", allDay: true });
  });

  it("drops the series so the copy stands alone", () => {
    const repeating = makeEvent({ recurrence: { frequency: Frequency.Weekly, interval: 1 }, seriesId: "series" });
    const copy = duplicateOccurrence(occurrenceOf(repeating), "copy", now);
    expect(copy.recurrence).toBeUndefined();
    expect(copy.seriesId).toBeUndefined();
  });
});
