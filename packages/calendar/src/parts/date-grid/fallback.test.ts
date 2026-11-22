import { describe, expect, it } from "vitest";

import { fallbackDateOf } from "./fallback";

const november = ["2026-11-01", "2026-11-02", "2026-11-18"];

describe("fallbackDateOf", () => {
  it("takes the first preferred date that is shown", () => {
    expect(fallbackDateOf(november, ["2026-12-04", null, "2026-11-18", "2026-11-02"])).toBe("2026-11-18");
  });

  it("falls back to the first shown date", () => {
    expect(fallbackDateOf(november, [null, "2026-10-31"])).toBe("2026-11-01");
  });

  it("returns an empty date for an empty grid", () => {
    expect(fallbackDateOf([], ["2026-11-18"])).toBe("");
  });
});
