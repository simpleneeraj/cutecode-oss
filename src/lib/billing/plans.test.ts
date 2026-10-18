import { describe, it, expect } from "vitest";
import { PLANS, PLAN_ORDER, isPlanAtLeast, can, limit } from "./plans";
import { Plan } from "@/db/schema";

describe("billing/plans", () => {
  it("exposes FREE, PRO and PREMIUM", () => {
    expect(Object.keys(PLANS).sort()).toEqual(["FREE", "PREMIUM", "PRO"]);
  });

  it("ranks FREE < PRO < PREMIUM", () => {
    expect(PLAN_ORDER).toEqual({ FREE: 0, PRO: 1, PREMIUM: 2 });
    expect(isPlanAtLeast(Plan.PRO, Plan.FREE)).toBe(true);
    expect(isPlanAtLeast(Plan.PRO, Plan.PREMIUM)).toBe(false);
    expect(isPlanAtLeast(Plan.PREMIUM, Plan.PRO)).toBe(true);
    expect(isPlanAtLeast(Plan.FREE, Plan.PRO)).toBe(false);
  });

  it("prices PRO at $5/$48 and PREMIUM at $12/$120", () => {
    expect(PLANS.FREE.prices).toEqual({ monthly: 0, yearly: 0 });
    expect(PLANS.PRO.prices).toEqual({ monthly: 5, yearly: 48 });
    expect(PLANS.PREMIUM.prices).toEqual({ monthly: 12, yearly: 120 });
  });

  it("gates themes, fonts and watermark removal at PRO", () => {
    expect(can(Plan.FREE, "premiumThemes")).toBe(false);
    expect(can(Plan.PRO, "premiumThemes")).toBe(true);
    expect(can(Plan.PREMIUM, "premiumThemes")).toBe(true);
    expect(can(Plan.FREE, "premiumFonts")).toBe(false);
    expect(can(Plan.PRO, "premiumFonts")).toBe(true);
    expect(can(Plan.PREMIUM, "premiumFonts")).toBe(true);
    expect(can(Plan.FREE, "watermarkRemoval")).toBe(false);
    expect(can(Plan.PRO, "watermarkRemoval")).toBe(true);
  });

  it("keeps HD video, private shares, full analytics and brand kits for PREMIUM", () => {
    for (const capability of ["hdVideo", "privateShares", "fullAnalytics", "brandKits"] as const) {
      expect(can(Plan.FREE, capability)).toBe(false);
      expect(can(Plan.PRO, capability)).toBe(false);
      expect(can(Plan.PREMIUM, capability)).toBe(true);
    }
  });

  it("scales export by plan", () => {
    expect(limit(Plan.FREE, "maxExportScale")).toBe(2);
    expect(limit(Plan.PRO, "maxExportScale")).toBe(3);
    expect(limit(Plan.PREMIUM, "maxExportScale")).toBe(4);
  });

  it("limits daily publishes per plan", () => {
    expect(limit(Plan.FREE, "dailyPublishes")).toBe(3);
    expect(limit(Plan.PRO, "dailyPublishes")).toBe(30);
    expect(limit(Plan.PREMIUM, "dailyPublishes")).toBe(100);
  });

  it("caps live snippets only on FREE", () => {
    expect(limit(Plan.FREE, "maxLiveSnippets")).toBe(25);
    expect(limit(Plan.PRO, "maxLiveSnippets")).toBe(Infinity);
    expect(limit(Plan.PREMIUM, "maxLiveSnippets")).toBe(Infinity);
  });

  it("caps slides per reel by plan", () => {
    expect(limit(Plan.FREE, "maxSlides")).toBe(3);
    expect(limit(Plan.PRO, "maxSlides")).toBe(10);
    expect(limit(Plan.PREMIUM, "maxSlides")).toBe(25);
  });

  it("treats a zero numeric capability as unavailable", () => {
    expect(can(Plan.PREMIUM, "apiMonthlyRenders")).toBe(false);
    expect(can(Plan.FREE, "maxExportScale")).toBe(true);
  });
});
