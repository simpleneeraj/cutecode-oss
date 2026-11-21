import { describe, expect, it } from "vitest";
import { OccurrenceKind } from "../types";
import { instantAt, makeOccurrence, testZones } from ".";

describe("testing helpers", () => {
  it("builds instants from wall clock text", () => {
    expect(instantAt("2026-11-18", "10:00")).toBe(Date.UTC(2026, 10, 18, 18));
    expect(instantAt("2026-11-18", "10:00", testZones.utc)).toBe(Date.UTC(2026, 10, 18, 10));
  });

  it("builds a timed occurrence", () => {
    const occurrence = makeOccurrence();
    expect(occurrence.kind).toBe(OccurrenceKind.Timed);
    expect(occurrence.key).toBe("design-crit@2026-11-18T10:00:00-08:00");
  });
});
