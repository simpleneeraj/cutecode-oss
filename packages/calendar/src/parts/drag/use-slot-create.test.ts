import { describe, expect, it } from "vitest";

import { isTap } from "./use-slot-create";

describe("isTap", () => {
  it("accepts a touch that stays put", () => {
    expect(isTap({ x: 10, y: 10 }, { x: 12, y: 13 })).toBe(true);
  });

  it("refuses a swipe across the day", () => {
    expect(isTap({ x: 10, y: 10 }, { x: 80, y: 12 })).toBe(false);
  });
});
