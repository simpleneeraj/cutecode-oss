import { describe, expect, it } from "vitest";
import { instantAt, makeAllDayEvent, makeEvent, testZones } from "../../testing";
import { occurrenceOf } from "../../event";
import { daySpan } from "../../time";
import { OccurrenceKind, type Instant, type TimedOccurrence } from "../../types";
import { isShortTimed, layoutTimedColumns, timedColumnLimits, type TimedLayoutOptions } from ".";

const weekOptions: TimedLayoutOptions = {
  maxColumns: timedColumnLimits.week,
  minimumMinutes: 30,
  columnKey: "week",
  timeZone: testZones.losAngeles,
};
function timedOccurrence(key: string, start: Instant, end: Instant): TimedOccurrence {
  return { kind: OccurrenceKind.Timed, key, event: makeEvent({ id: key }), originalStart: key, start, end };
}

function onDay(key: string, from: string, to: string, date = "2026-11-18"): TimedOccurrence {
  return timedOccurrence(key, instantAt(date, from), instantAt(date, to));
}

describe("isShortTimed", () => {
  const zone = testZones.losAngeles;

  it("accepts timed events under 24 hours", () => {
    expect(isShortTimed(onDay("crit", "10:00", "11:00"), zone)).toBe(true);
    expect(
      isShortTimed(timedOccurrence("almost", instantAt("2026-11-18", "00:00"), instantAt("2026-11-18", "23:59")), zone),
    ).toBe(true);
  });

  it("sends midnight to midnight on the 23 hour spring day to span bars", () => {
    const springDay = timedOccurrence("spring", instantAt("2026-03-08", "00:00"), instantAt("2026-03-09", "00:00"));
    expect(springDay.end - springDay.start).toBe(23 * 60 * 60 * 1000);
    expect(isShortTimed(springDay, zone)).toBe(false);
  });

  it("keeps 00:30 to 23:45 on the 25 hour fall day in the grid", () => {
    const fallDay = onDay("fall", "00:30", "23:45", "2026-11-01");
    expect(fallDay.end - fallDay.start).toBeGreaterThan(24 * 60 * 60 * 1000);
    expect(isShortTimed(fallDay, zone)).toBe(true);
  });

  it("keeps a timed event crossing the spring gap overnight in the grid", () => {
    const overnight = timedOccurrence("night", instantAt("2026-03-07", "22:00"), instantAt("2026-03-08", "21:59"));
    expect(isShortTimed(overnight, zone)).toBe(true);
  });

  it("judges by wall clock in the zone it is given", () => {
    const springDay = timedOccurrence("spring", instantAt("2026-03-08", "00:00"), instantAt("2026-03-09", "00:00"));
    expect(isShortTimed(springDay, testZones.utc)).toBe(true);
  });

  it("sends 24 hours and longer to span bars", () => {
    const fullDay = timedOccurrence("full", instantAt("2026-11-18", "09:00"), instantAt("2026-11-19", "09:00"));
    const twoDays = timedOccurrence("trip", instantAt("2026-11-18", "09:00"), instantAt("2026-11-20", "09:00"));
    expect(isShortTimed(fullDay, zone)).toBe(false);
    expect(isShortTimed(twoDays, zone)).toBe(false);
  });

  it("rejects all-day occurrences", () => {
    expect(isShortTimed(occurrenceOf(makeAllDayEvent("2026-11-18", "2026-11-19")), zone)).toBe(false);
  });
});

describe("layoutTimedColumns", () => {
  const days = [daySpan("2026-11-18", testZones.losAngeles), daySpan("2026-11-19", testZones.losAngeles)];

  it("returns one column per day in order", () => {
    const columns = layoutTimedColumns([], days, weekOptions);
    expect(columns.map((column) => column.day.date)).toEqual(["2026-11-18", "2026-11-19"]);
    expect(columns.every((column) => column.columnKey === "week")).toBe(true);
  });

  it("splits an event crossing midnight into two pieces", () => {
    const occurrence = timedOccurrence("late", instantAt("2026-11-18", "22:00"), instantAt("2026-11-19", "01:30"));
    const [first, second] = layoutTimedColumns([occurrence], days, weekOptions);
    expect(first?.boxes).toEqual([
      expect.objectContaining({
        key: "late",
        date: "2026-11-18",
        startMinute: 1320,
        endMinute: 1440,
        continuesBefore: false,
        continuesAfter: true,
      }),
    ]);
    expect(second?.boxes).toEqual([
      expect.objectContaining({
        key: "late",
        date: "2026-11-19",
        startMinute: 0,
        endMinute: 90,
        continuesBefore: true,
        continuesAfter: false,
      }),
    ]);
  });

  it("leaves long timed and all-day occurrences to span bars", () => {
    const occurrences = [
      timedOccurrence("trip", instantAt("2026-11-18", "09:00"), instantAt("2026-11-20", "09:00")),
      occurrenceOf(makeAllDayEvent("2026-11-18", "2026-11-19")),
      onDay("crit", "10:00", "11:00"),
    ];
    const columns = layoutTimedColumns(occurrences, days, weekOptions);
    expect(columns.flatMap((column) => column.boxes.map((box) => box.key))).toEqual(["crit"]);
  });

  it("draws a fall day event as a box and a spring midnight to midnight event as a span", () => {
    const fallDay = daySpan("2026-11-01", testZones.losAngeles);
    const springDay = daySpan("2026-03-08", testZones.losAngeles);
    const fallEvent = onDay("fall", "00:30", "23:45", "2026-11-01");
    const springEvent = timedOccurrence("spring", instantAt("2026-03-08", "00:00"), instantAt("2026-03-09", "00:00"));
    const [fallColumn, springColumn] = layoutTimedColumns([fallEvent, springEvent], [fallDay, springDay], weekOptions);
    expect(fallColumn?.boxes).toEqual([expect.objectContaining({ key: "fall", startMinute: 30, endMinute: 1485 })]);
    expect(springColumn?.boxes).toEqual([]);
  });

  it("skips occurrences outside every day", () => {
    const columns = layoutTimedColumns([onDay("later", "10:00", "11:00", "2026-11-25")], days, weekOptions);
    expect(columns.flatMap((column) => column.boxes)).toEqual([]);
  });
});
