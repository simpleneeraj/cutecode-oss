import { describe, it, expect } from "vitest";
import { createDefaultElement } from "@/store/editor/editor/state";
import { themes } from "./index";
import { isPristineCode, sampleUpdate } from "./samples";

describe("presets/themes/samples", () => {
  it("treats the seed code and every theme sample as pristine", () => {
    expect(isPristineCode(createDefaultElement().content)).toBe(true);
    expect(isPristineCode(themes.resend.sample?.code)).toBe(true);
  });

  it("treats edited code as not pristine", () => {
    expect(isPristineCode("console.log('mine');")).toBe(false);
    expect(isPristineCode(undefined)).toBe(false);
  });

  it("builds the content, language and file name patch from a sample", () => {
    const { sample } = themes.resend;
    expect(sampleUpdate(themes.resend)).toEqual({
      content: sample?.code,
      properties: { language: "TypeScript" },
      header: { properties: { title: { text: "send-welcome.ts", icon: sample?.icon } } },
    });
  });

  it("returns an empty patch for a theme without a sample", () => {
    expect(sampleUpdate(themes.mono)).toEqual({});
  });
});
