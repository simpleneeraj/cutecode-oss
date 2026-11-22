import { describe, expect, it } from "vitest";

import { layoutDayColumn, timedColumnLimits } from "../../layout/timed";
import { makeOccurrence, testZones } from "../../testing";
import { daySpan } from "../../time";
import { OccurrenceKind, type TimedOccurrence } from "../../types";
import { canResize } from "./placement";

const zone = testZones.losAngeles;

function lateNight(): TimedOccurrence {
  const occurrence = makeOccurrence({ start: "2026-11-18T22:00:00-08:00", end: "2026-11-19T02:00:00-08:00" });
  if (occurrence.kind !== OccurrenceKind.Timed) {
    throw new Error("Expected a timed occurrence");
  }
  return occurrence;
}

function pieceOn(date: string) {
  const [box] = layoutDayColumn([lateNight()], daySpan(date, zone), { maxColumns: timedColumnLimits.week, minimumMinutes: 15, columnKey: "day", timeZone: zone }).boxes;
  if (box === undefined) {
    throw new Error("Expected a box");
  }
  return box;
}

describe("canResize", () => {
  it("offers the grip only on the last piece of an event that crosses midnight", () => {
    expect(canResize(pieceOn("2026-11-18"))).toBe(false);
    expect(canResize(pieceOn("2026-11-19"))).toBe(true);
  });
});
