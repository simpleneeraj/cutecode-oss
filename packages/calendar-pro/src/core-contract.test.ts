import { describe, expect, it } from "vitest";
import { occurrencesInRange } from "@cutecode/calendar/event";
import { makeEvent, testZones } from "@cutecode/calendar/testing";
import { OccurrenceKind, type OccurrenceExpander } from "@cutecode/calendar/types";

describe("free core contract", () => {
  it("accepts an expander plugged in from Pro", () => {
    const expandTwice: OccurrenceExpander = (events) =>
      events.flatMap((event) => [
        {
          kind: OccurrenceKind.AllDay,
          key: `${event.id}@1`,
          event,
          originalStart: event.start,
          startDate: "2026-11-18",
          endDate: "2026-11-19",
        },
        {
          kind: OccurrenceKind.AllDay,
          key: `${event.id}@2`,
          event,
          originalStart: event.start,
          startDate: "2026-11-25",
          endDate: "2026-11-26",
        },
      ]);
    const context = {
      range: { start: Date.UTC(2026, 10, 15, 8), end: Date.UTC(2026, 10, 22, 8) },
      dates: { start: "2026-11-15", end: "2026-11-22" },
      timeZone: testZones.losAngeles,
    };
    expect(occurrencesInRange([makeEvent()], context, expandTwice).map((occurrence) => occurrence.key)).toEqual([
      "design-crit@1",
    ]);
  });
});
