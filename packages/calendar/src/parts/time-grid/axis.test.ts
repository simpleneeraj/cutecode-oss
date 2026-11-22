import { describe, expect, it } from "vitest";
import { testZones } from "../../testing";
import { daySpan } from "../../time";
import {
  AxisSide,
  buildAxis,
  gapRows,
  hourWindow,
  minuteAtOffset,
  missingRows,
  offsetAt,
  sideOf,
  visibleAxis,
  wholeHours,
  type DayTrack,
} from "./axis";

const zone = testZones.losAngeles;
const closed = { earlier: false, later: false };
const office = { start: "08:00", end: "20:00" };

function trackAt(tracks: DayTrack[], index: number): DayTrack {
  const track = tracks[index];
  if (!track) {
    throw new Error("No track");
  }
  return track;
}

describe("buildAxis", () => {
  it("has 24 rows on a normal day", () => {
    const axis = buildAxis([daySpan("2026-11-18", zone)], zone);
    expect(axis.rows).toHaveLength(24);
  });

  it("shows 1 AM twice on the 25 hour fall day", () => {
    const axis = buildAxis([daySpan("2026-11-01", zone)], zone);
    expect(axis.rows).toHaveLength(25);
    expect(axis.rows.filter((row) => row.wallMinute === 60).map((row) => row.repeat)).toEqual([0, 1]);
  });

  it("skips 2 AM on the spring day and marks the gap", () => {
    const axis = buildAxis([daySpan("2026-03-08", zone)], zone);
    const visible = visibleAxis(axis, hourWindow(undefined, closed));
    expect(axis.rows.some((row) => row.wallMinute === 120)).toBe(false);
    expect(gapRows(trackAt(axis.tracks, 0), visible)).toEqual([2]);
  });

  it("keeps a week aligned and hatches the missing spring hour", () => {
    const axis = buildAxis([daySpan("2026-03-07", zone), daySpan("2026-03-08", zone)], zone);
    const visible = visibleAxis(axis, hourWindow(undefined, closed));
    expect(axis.rows).toHaveLength(24);
    expect(missingRows(trackAt(axis.tracks, 0), visible)).toEqual([]);
    expect(missingRows(trackAt(axis.tracks, 1), visible)).toEqual([2]);
  });
});

describe("offsetAt", () => {
  const axis = buildAxis([daySpan("2026-11-18", zone)], zone);
  const track = trackAt(axis.tracks, 0);

  it("measures rows from midnight when nothing folds", () => {
    const visible = visibleAxis(axis, hourWindow(undefined, closed));
    expect(offsetAt(track, 630, visible)).toBe(10.5);
  });

  it("starts at the shown hours and clamps folded minutes", () => {
    const visible = visibleAxis(axis, hourWindow(office, closed));
    expect(visible.rows).toHaveLength(12);
    expect(offsetAt(track, 540, visible)).toBe(1);
    expect(offsetAt(track, 390, visible)).toBe(0);
    expect(offsetAt(track, 1290, visible)).toBe(12);
    expect(sideOf(track, 390, visible)).toBe(AxisSide.Before);
    expect(sideOf(track, 1290, visible)).toBe(AxisSide.After);
  });

  it("opens the earlier hours on request", () => {
    const visible = visibleAxis(axis, hourWindow(office, { earlier: true, later: false }));
    expect(offsetAt(track, 390, visible)).toBe(6.5);
  });

  it("follows real elapsed time after the repeated hour", () => {
    const fall = buildAxis([daySpan("2026-11-01", zone)], zone);
    const visible = visibleAxis(fall, hourWindow(undefined, closed));
    expect(offsetAt(trackAt(fall.tracks, 0), 180, visible)).toBe(3);
  });
});

describe("wholeHours", () => {
  it("widens a half hour window to whole rows", () => {
    expect(wholeHours({ start: "06:30", end: "18:30" })).toEqual({ start: "06:00", end: "19:00" });
  });

  it("keeps a window that is already whole", () => {
    expect(wholeHours({ start: "00:00", end: "24:00" })).toEqual({ start: "00:00", end: "24:00" });
  });
});

describe("minuteAtOffset", () => {
  const axis = buildAxis([daySpan("2026-11-18", zone)], zone);
  const track = trackAt(axis.tracks, 0);
  const visible = visibleAxis(axis, hourWindow(office, closed));

  it("reads the minute under an offset inside the shown hours", () => {
    expect(minuteAtOffset(track, 2.25, visible)).toBe(615);
  });

  it("clamps above the first and below the last shown row", () => {
    expect(minuteAtOffset(track, -3, visible)).toBe(480);
    expect(minuteAtOffset(track, 40, visible)).toBe(1200);
  });

  it("inverts offsetAt", () => {
    expect(minuteAtOffset(track, offsetAt(track, 745, visible), visible)).toBe(745);
  });

  it("skips the missing spring hour", () => {
    const spring = buildAxis([daySpan("2026-03-08", zone)], zone);
    const whole = visibleAxis(spring, hourWindow(undefined, closed));
    expect(minuteAtOffset(trackAt(spring.tracks, 0), 2.5, whole)).toBe(150);
  });
});
