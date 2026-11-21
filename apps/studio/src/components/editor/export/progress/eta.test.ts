import { describe, expect, it } from "vitest";
import { blendEstimate, estimateRemainingMs } from "./eta";

describe("estimateRemainingMs", () => {
  const first = { timeMs: 0, progress: 0.1 };

  it("returns null before any progress is made", () => {
    expect(estimateRemainingMs(first, first, 500)).toBeNull();
  });

  it("projects the rate over completed frames onto the remaining frames", () => {
    expect(estimateRemainingMs(first, { timeMs: 2000, progress: 0.3 }, 2000)).toBe(7000);
  });

  it("counts down while waiting for the next frame instead of growing", () => {
    const latest = { timeMs: 2000, progress: 0.3 };
    const atSample = estimateRemainingMs(first, latest, 2000)!;
    const later = estimateRemainingMs(first, latest, 3500)!;
    expect(later).toBe(atSample - 1500);
  });

  it("never goes negative", () => {
    expect(estimateRemainingMs(first, { timeMs: 1000, progress: 0.9 }, 60_000)).toBe(0);
  });
});

describe("blendEstimate", () => {
  it("takes the first estimate as is", () => {
    expect(blendEstimate(null, 9000, 500)).toBe(9000);
  });

  it("moves only part of the way toward a higher estimate", () => {
    expect(blendEstimate(10_000, 20_000, 500)).toBeCloseTo(9500 + 10_500 * 0.3);
  });

  it("follows the countdown when the estimate is steady", () => {
    expect(blendEstimate(10_000, 9500, 500)).toBe(9500);
  });
});
