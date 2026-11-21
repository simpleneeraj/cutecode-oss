import { describe, expect, it } from "vitest";
import { dstTransitions2026, instantAt, testZones } from "../testing";
import { daySpan } from "../time";
import {
  defaultDragSettings,
  edgeScrollVelocity,
  slotInstant,
  slotPointAt,
  snapMinute,
  snapMinuteDown,
  snapMinuteUp,
} from "./snap";

const zone = testZones.losAngeles;

describe("defaultDragSettings", () => {
  it("snaps 15, creates on 30, lasts 60 and keeps 15 at least", () => {
    expect(defaultDragSettings).toEqual({
      snapMinutes: 15,
      createSnapMinutes: 30,
      defaultDurationMinutes: 60,
      minimumDurationMinutes: 15,
    });
  });
});

describe("snapMinute", () => {
  it("rounds to the nearest step", () => {
    expect(snapMinute(607, 15)).toBe(600);
    expect(snapMinute(608, 15)).toBe(615);
    expect(snapMinute(622.4, 15)).toBe(615);
    expect(snapMinute(600, 15)).toBe(600);
  });

  it("floors and ceils on demand", () => {
    expect(snapMinuteDown(629, 30)).toBe(600);
    expect(snapMinuteUp(601, 30)).toBe(630);
    expect(snapMinuteUp(630, 30)).toBe(630);
    expect(snapMinuteDown(-1, 15)).toBe(-15);
  });

  it("leaves the minute alone without a step", () => {
    expect(snapMinute(607, 0)).toBe(607);
    expect(snapMinuteDown(607, -5)).toBe(607);
    expect(snapMinuteUp(607, 0)).toBe(607);
  });
});

describe("slotInstant", () => {
  it("maps a slot to its wall clock on a normal day", () => {
    expect(slotInstant({ date: "2026-11-18", minute: 600, columnKey: "day" }, zone)).toBe(
      instantAt("2026-11-18", "10:00"),
    );
  });

  it("follows elapsed time on DST days", () => {
    expect(slotInstant({ date: "2026-11-01", minute: 600, columnKey: "day" }, zone)).toBe(
      instantAt("2026-11-01", "09:00"),
    );
    expect(slotInstant({ date: "2026-03-08", minute: 600, columnKey: "day" }, zone)).toBe(
      instantAt("2026-03-08", "11:00"),
    );
  });

  it("rolls past the end of the day into the next", () => {
    expect(slotInstant({ date: "2026-11-18", minute: 1470, columnKey: "day" }, zone)).toBe(
      instantAt("2026-11-19", "00:30"),
    );
  });

  it("works in quarter hour and Southern zones", () => {
    for (const timeZone of [testZones.kathmandu, testZones.chatham, testZones.santiago]) {
      expect(slotInstant({ date: "2026-11-18", minute: 615, columnKey: "day" }, timeZone)).toBe(
        instantAt("2026-11-18", "10:15", timeZone),
      );
    }
  });
});

describe("slotPointAt", () => {
  it("is the inverse of slotInstant on every DST day", () => {
    for (const transition of dstTransitions2026) {
      const lastMinute = daySpan(transition.date, transition.timeZone).minutes - 15;
      for (const minute of [0, 90, 150, 600, lastMinute]) {
        const point = { date: transition.date, minute, columnKey: "day", resourceId: "room-a" };
        expect(slotPointAt(slotInstant(point, transition.timeZone), transition.timeZone, point)).toEqual(point);
      }
    }
  });

  it("moves to the next date at midnight and keeps the column", () => {
    const point = { date: "2026-11-18", minute: 0, columnKey: "wed", resourceId: "room-b" };
    expect(slotPointAt(instantAt("2026-11-19", "00:45"), zone, point)).toEqual({
      date: "2026-11-19",
      minute: 45,
      columnKey: "wed",
      resourceId: "room-b",
    });
  });
});

describe("edgeScrollVelocity", () => {
  it("is still outside the edge", () => {
    expect(edgeScrollVelocity(48, 48, 20)).toBe(0);
    expect(edgeScrollVelocity(200, 48, 20)).toBe(0);
  });

  it("is fastest at or past the edge", () => {
    expect(edgeScrollVelocity(0, 48, 20)).toBe(20);
    expect(edgeScrollVelocity(-10, 48, 20)).toBe(20);
  });

  it("ramps linearly inside the edge", () => {
    expect(edgeScrollVelocity(24, 48, 20)).toBe(10);
    expect(edgeScrollVelocity(36, 48, 20)).toBe(5);
  });

  it("is still without an edge", () => {
    expect(edgeScrollVelocity(0, 0, 20)).toBe(0);
  });
});
