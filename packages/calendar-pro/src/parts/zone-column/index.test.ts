import { makeSettings, testZones } from "@cutecode/calendar/testing";
import { daySpan } from "@cutecode/calendar/time";
import { describe, expect, it } from "vitest";

import { zoneColumnOf } from "./index";

const settings = makeSettings({ timeZone: testZones.losAngeles });

function shiftLabels(date: string, timeZone: string) {
  const zone = zoneColumnOf(timeZone);
  const marks = zone.marksOf(daySpan(date, testZones.losAngeles), zone.timeZone);
  return marks.flatMap((mark, index) => {
    const label = zone.shiftLabelOf?.(mark, marks[index - 1], settings) ?? null;
    return label === null ? [] : [{ wallMinute: mark.wallMinute, label }];
  });
}

describe("zone column", () => {
  it("marks the hour London leaves summer time", () => {
    expect(shiftLabels("2026-10-24", testZones.london)).toEqual([{ wallMinute: 60, label: "GMT" }]);
  });

  it("marks nothing on a plain day", () => {
    expect(shiftLabels("2026-11-18", testZones.london)).toEqual([]);
  });

  it("marks the other zone's spring jump", () => {
    expect(shiftLabels("2026-03-28", testZones.london)).toEqual([{ wallMinute: 120, label: "GMT+1" }]);
  });
});
