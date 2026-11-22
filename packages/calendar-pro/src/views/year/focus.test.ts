import { KeyCommand } from "@cutecode/calendar/types";
import { describe, expect, it } from "vitest";

import { isInYear, PageKey, stepByCommand, stepByKey } from "./focus";

describe("stepByCommand", () => {
  it.each([
    [KeyCommand.PreviousDay, "2026-11-17"],
    [KeyCommand.NextDay, "2026-11-19"],
    [KeyCommand.PreviousHour, "2026-11-11"],
    [KeyCommand.NextHour, "2026-11-25"],
    [KeyCommand.PreviousWeek, "2026-11-11"],
    [KeyCommand.NextWeek, "2026-11-25"],
  ])("moves %s to %s", (command, date) => {
    expect(stepByCommand("2026-11-18", command)).toBe(date);
  });

  it("crosses month and year edges", () => {
    expect(stepByCommand("2026-11-30", KeyCommand.NextDay)).toBe("2026-12-01");
    expect(stepByCommand("2026-12-28", KeyCommand.NextHour)).toBe("2027-01-04");
  });

  it("ignores commands that do not move", () => {
    expect(stepByCommand("2026-11-18", KeyCommand.OpenEvent)).toBeNull();
  });
});

describe("stepByKey", () => {
  it.each([
    [PageKey.Home, "2026-03-31", "2026-03-01"],
    [PageKey.End, "2026-02-10", "2026-02-28"],
    [PageKey.End, "2028-02-10", "2028-02-29"],
    [PageKey.PageUp, "2026-03-31", "2026-02-28"],
    [PageKey.PageDown, "2026-01-31", "2026-02-28"],
  ])("moves %s from %s to %s", (key, from, to) => {
    expect(stepByKey(from, key)).toBe(to);
  });

  it("ignores other keys", () => {
    expect(stepByKey("2026-11-18", "a")).toBeNull();
  });
});

describe("isInYear", () => {
  it("keeps days of the shown year", () => {
    expect(isInYear("2026-01-01", "2026-01-01")).toBe(true);
    expect(isInYear("2026-12-31", "2026-01-01")).toBe(true);
    expect(isInYear("2027-01-01", "2026-01-01")).toBe(false);
    expect(isInYear("2025-12-31", "2026-01-01")).toBe(false);
  });
});
