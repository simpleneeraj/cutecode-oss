import { describe, expect, it } from "vitest";

import { formatBadgeValue, RollDirection, readRollDirection } from "./tally";

describe("formatBadgeValue", () => {
  it("shows the number up to 99", () => {
    expect(formatBadgeValue(7)).toBe("7");
    expect(formatBadgeValue(99)).toBe("99");
  });

  it("caps larger numbers", () => {
    expect(formatBadgeValue(100)).toBe("99+");
  });
});

describe("readRollDirection", () => {
  it("rolls up when the count grows", () => {
    expect(readRollDirection(3, 4)).toBe(RollDirection.Up);
  });

  it("rolls down when the count shrinks", () => {
    expect(readRollDirection(4, 3)).toBe(RollDirection.Down);
  });
});
