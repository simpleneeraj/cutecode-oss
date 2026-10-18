import { describe, it, expect } from "vitest";
import { sponsorTotal } from "./brand-presets";

describe("sponsorTotal", () => {
  it("adds the build fee to the discounted monthly fee", () => {
    expect(sponsorTotal("preset", 1)).toBe(198);
    expect(sponsorTotal("preset", 3)).toBe(281);
    expect(sponsorTotal("preset", 12)).toBe(590);
    expect(sponsorTotal("featured", 1)).toBe(248);
    expect(sponsorTotal("featured", 3)).toBe(416);
    expect(sponsorTotal("featured", 12)).toBe(1040);
    expect(sponsorTotal("title", 1)).toBe(398);
    expect(sponsorTotal("title", 3)).toBe(821);
    expect(sponsorTotal("title", 12)).toBe(2390);
  });
});
