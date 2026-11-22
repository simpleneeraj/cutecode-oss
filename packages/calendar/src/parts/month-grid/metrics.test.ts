import { describe, expect, it } from "vitest";
import { fitChips, lineCapacity } from "./metrics";

describe("lineCapacity", () => {
  it("fits whole lines under the date", () => {
    expect(lineCapacity(120)).toBe(3);
    expect(lineCapacity(90)).toBe(2);
    expect(lineCapacity(20)).toBe(0);
  });
});

describe("fitChips", () => {
  it("keeps every chip when nothing is hidden", () => {
    expect(fitChips(["a", "b"], 0, 2)).toEqual({ keys: ["a", "b"], hiddenCount: 0 });
  });

  it("gives the last line to more when the day overflows", () => {
    expect(fitChips(["a", "b"], 1, 2)).toEqual({ keys: ["a"], hiddenCount: 2 });
  });

  it("keeps chips when only bars overflow and a line is free", () => {
    expect(fitChips(["a"], 1, 2)).toEqual({ keys: ["a"], hiddenCount: 1 });
  });
});
