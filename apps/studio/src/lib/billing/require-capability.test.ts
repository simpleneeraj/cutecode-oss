import { describe, it, expect } from "vitest";
import { Plan, ShareVisibility } from "@/db/enums";
import { requireCapability, requireShareVisibility } from "./require-capability";

describe("billing/require-capability", () => {
  it("passes when the plan has the capability", () => {
    expect(() => requireCapability(Plan.PRO, "premiumFonts")).not.toThrow();
    expect(() => requireCapability(Plan.PREMIUM, "fullAnalytics")).not.toThrow();
  });

  it("throws FORBIDDEN when the plan lacks the capability", () => {
    expect(() => requireCapability(Plan.FREE, "premiumThemes")).toThrow(expect.objectContaining({ code: "FORBIDDEN" }));
    expect(() => requireCapability(Plan.PRO, "fullAnalytics")).toThrow(expect.objectContaining({ code: "FORBIDDEN" }));
  });

  it("allows public and unlisted shares on every plan", () => {
    for (const plan of [Plan.FREE, Plan.PRO, Plan.PREMIUM]) {
      expect(() => requireShareVisibility(plan, ShareVisibility.PUBLIC)).not.toThrow();
      expect(() => requireShareVisibility(plan, ShareVisibility.UNLISTED)).not.toThrow();
      expect(() => requireShareVisibility(plan, undefined)).not.toThrow();
    }
  });

  it("allows passcode and private shares only on PREMIUM", () => {
    for (const visibility of [ShareVisibility.PASSCODE, ShareVisibility.PRIVATE]) {
      expect(() => requireShareVisibility(Plan.FREE, visibility)).toThrow(expect.objectContaining({ code: "FORBIDDEN" }));
      expect(() => requireShareVisibility(Plan.PRO, visibility)).toThrow(expect.objectContaining({ code: "FORBIDDEN" }));
      expect(() => requireShareVisibility(Plan.PREMIUM, visibility)).not.toThrow();
    }
  });
});
