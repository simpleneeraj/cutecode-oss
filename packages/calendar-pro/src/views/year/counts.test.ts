import { makeAllDayEvent, makeCalendar, makeEvent, testZones } from "@cutecode/calendar/testing";
import { describe, expect, it } from "vitest";

import { countYear } from "./counts";

const calendars = [makeCalendar(), makeCalendar({ id: "family", name: "Family", visible: false })];

function countOn(counts: { date: string; count: number }[], date: string) {
  return counts.find((day) => day.date === date)?.count;
}

describe("countYear", () => {
  const events = [
    makeEvent(),
    makeEvent({ id: "second", title: "Second" }),
    makeEvent({ id: "hidden", calendarId: "family" }),
    makeAllDayEvent("2026-12-31", "2027-01-02", { id: "new-year" }),
  ];
  const counts = countYear({ events, calendars }, "2026-01-01", testZones.losAngeles);

  it("returns every day of the year", () => {
    expect(counts).toHaveLength(365);
  });

  it("counts shown calendars only", () => {
    expect(countOn(counts, "2026-11-18")).toBe(2);
  });

  it("clips events at the year edge", () => {
    expect(countOn(counts, "2026-12-31")).toBe(1);
    expect(countOn(counts, "2027-01-01")).toBeUndefined();
  });
});
