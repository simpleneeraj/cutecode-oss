import { instantAt, testZones } from "@cutecode/calendar/testing";
import { describe, expect, it } from "vitest";

import { isZoneMismatch, placeOf, zoneBannerCopy } from "./copy";

const now = instantAt("2026-11-18", "10:00");

describe("zone banner copy", () => {
  it("names zones by their place", () => {
    expect(placeOf(testZones.newYork)).toBe("New York");
    expect(placeOf("America/Argentina/Buenos_Aires")).toBe("Buenos Aires");
    expect(placeOf("UTC")).toBe("UTC");
  });

  it("offers the device zone and keeps the calendar zone", () => {
    expect(zoneBannerCopy(testZones.newYork, testZones.losAngeles)).toEqual({
      title: "Your device is in New York",
      description: "This calendar shows Los Angeles time.",
      use: "Use New York",
      keep: "Keep",
    });
  });
});

describe("zone banner mismatch", () => {
  it("shows only when the device and calendar clocks differ", () => {
    expect(isZoneMismatch(testZones.newYork, testZones.losAngeles, now)).toBe(true);
    expect(isZoneMismatch("US/Pacific", testZones.losAngeles, now)).toBe(false);
  });

  it("stays hidden before the device zone is known or when a zone is invalid", () => {
    expect(isZoneMismatch(null, testZones.losAngeles, now)).toBe(false);
    expect(isZoneMismatch("Mars/Olympus", testZones.losAngeles, now)).toBe(false);
  });
});
