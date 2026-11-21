import { describe, expect, it } from "vitest";
import { frameCountOf, withTimeout } from "./timing";

describe("frameCountOf", () => {
  it("counts frames for a clip", () => {
    expect(frameCountOf(6000, 24)).toBe(144);
  });

  it("totals a three slide reel", () => {
    expect([6000, 6000, 6000].reduce((sum, ms) => sum + frameCountOf(ms, 24), 0)).toBe(432);
  });

  it("always yields at least one frame", () => {
    expect(frameCountOf(0, 24)).toBe(1);
  });
});

describe("withTimeout", () => {
  it("resolves with the value when it settles in time", async () => {
    await expect(withTimeout(Promise.resolve(7), 50, "late")).resolves.toBe(7);
  });

  it("rejects instead of hanging when the promise never settles", async () => {
    await expect(withTimeout(new Promise(() => {}), 10, "late")).rejects.toThrow("late");
  });
});
