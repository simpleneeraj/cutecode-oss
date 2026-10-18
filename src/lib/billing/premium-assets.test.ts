import { describe, it, expect } from "vitest";
import { Plan } from "@/db/enums";
import { assertPremiumAssetsAllowed, stripPremiumAssets } from "./premium-assets";

const elements = {
  a: { properties: { theme: "holi" }, style: { fontFamily: "Cascadia Code" } },
  b: { properties: { theme: "mono" }, style: { fontFamily: "DM Mono" } },
};

describe("billing/premium-assets", () => {
  it("rejects premium themes and fonts on FREE", () => {
    expect(() => assertPremiumAssetsAllowed(Plan.FREE, elements)).toThrow(expect.objectContaining({ code: "FORBIDDEN" }));
    expect(() => assertPremiumAssetsAllowed(Plan.FREE, { b: elements.b })).not.toThrow();
  });

  it("allows premium themes and fonts on PRO and PREMIUM", () => {
    expect(() => assertPremiumAssetsAllowed(Plan.PRO, elements)).not.toThrow();
    expect(() => assertPremiumAssetsAllowed(Plan.PREMIUM, elements)).not.toThrow();
  });

  it("strips premium themes and fonts for FREE remixes", () => {
    expect(stripPremiumAssets(Plan.FREE, elements)).toEqual({
      a: { properties: { theme: "mono" }, style: { fontFamily: "DM Mono" } },
      b: elements.b,
    });
    expect(stripPremiumAssets(Plan.PRO, elements)).toEqual(elements);
  });
});
