import { describe, expect, it } from "vitest";
import { instantAt, testZones } from "../../testing";
import { daySpan } from "../../time";
import { nowMinute } from "./position";

const zone = testZones.losAngeles;

describe("nowMinute", () => {
  it("counts minutes since midnight on a normal day", () => {
    expect(nowMinute(instantAt("2026-11-18", "12:00", zone), daySpan("2026-11-18", zone))).toBe(720);
  });

  it("follows elapsed time on the 25 hour fall day", () => {
    expect(nowMinute(instantAt("2026-11-01", "12:00", zone), daySpan("2026-11-01", zone))).toBe(780);
  });

  it("hides outside the day and before the clock is known", () => {
    const day = daySpan("2026-11-18", zone);
    expect(nowMinute(instantAt("2026-11-19", "00:00", zone), day)).toBeNull();
    expect(nowMinute(null, day)).toBeNull();
  });
});
