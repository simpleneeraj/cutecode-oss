import { describe, expect, it } from "vitest";
import { testZones } from "../testing";
import { formatDateTime, isDateTime, parseDateTime } from "./iso";

describe("iso date times", () => {
  it("parses offsets and Z", () => {
    expect(parseDateTime("2026-11-18T10:00:00-08:00", testZones.utc)).toBe(Date.UTC(2026, 10, 18, 18));
    expect(parseDateTime("2026-11-18T18:00:00Z", testZones.tokyo)).toBe(Date.UTC(2026, 10, 18, 18));
    expect(parseDateTime("2026-11-18T10:00:00.250+05:45", testZones.utc)).toBe(Date.UTC(2026, 10, 18, 4, 15, 0, 250));
  });

  it("reads a floating time in the given zone", () => {
    expect(parseDateTime("2026-11-18T10:00", testZones.losAngeles)).toBe(Date.UTC(2026, 10, 18, 18));
    expect(parseDateTime("2026-11-18T10:00:30.500", testZones.kathmandu)).toBe(Date.UTC(2026, 10, 18, 4, 15, 30, 500));
    expect(parseDateTime("2026-03-08T02:30", testZones.losAngeles)).toBe(Date.UTC(2026, 2, 8, 10, 30));
    expect(parseDateTime("2026-11-01T01:30", testZones.losAngeles)).toBe(Date.UTC(2026, 10, 1, 8, 30));
  });

  it("rejects bad input", () => {
    expect(isDateTime("2026-02-30T10:00:00Z")).toBe(false);
    expect(isDateTime("2026-11-18T10:00:00-08:00")).toBe(true);
    expect(isDateTime("2026-11-18")).toBe(false);
    expect(() => parseDateTime("soon", testZones.utc)).toThrow(RangeError);
  });

  it("formats with the zone offset", () => {
    const instant = Date.UTC(2026, 10, 18, 18);
    expect(formatDateTime(instant, testZones.losAngeles)).toBe("2026-11-18T10:00:00-08:00");
    expect(formatDateTime(instant, testZones.chatham)).toBe("2026-11-19T07:45:00+13:45");
    expect(formatDateTime(instant, testZones.utc)).toBe("2026-11-18T18:00:00Z");
  });

  it("round trips across the fall repeat hour", () => {
    const second = Date.UTC(2026, 10, 1, 9, 30);
    const text = formatDateTime(second, testZones.losAngeles);
    expect(text).toBe("2026-11-01T01:30:00-08:00");
    expect(parseDateTime(text, testZones.losAngeles)).toBe(second);
  });
});
