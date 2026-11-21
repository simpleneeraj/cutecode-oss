import { describe, it, expect } from "vitest";
import { MOODS, SNIPPETS, findSnippet, snippetPatch } from "./index";

describe("presets/snippets", () => {
  it("gives every snippet a unique id", () => {
    const ids = SNIPPETS.map(({ id }) => id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("fills every language variant of every snippet", () => {
    for (const { variants } of SNIPPETS) {
      for (const { fileName, code } of Object.values(variants)) {
        expect(fileName).not.toBe("");
        expect(code.trim()).not.toBe("");
      }
    }
  });

  it("keeps every variant 7 to 9 lines and at most 48 characters wide", () => {
    for (const { id, variants } of SNIPPETS) {
      for (const [language, { code }] of Object.entries(variants)) {
        const lines = code.split("\n");
        const widest = Math.max(...lines.map((line) => line.length));
        expect({ id, language, lines: lines.length >= 7 && lines.length <= 9, widest: widest <= 48 }).toEqual({
          id,
          language,
          lines: true,
          widest: true,
        });
      }
    }
  });

  it("gives every mood the same number of snippets", () => {
    const counts = MOODS.map((mood) => SNIPPETS.filter((snippet) => snippet.mood === mood).length);
    expect(new Set(counts).size).toBe(1);
  });

  it("puts every snippet in a listed mood", () => {
    expect(SNIPPETS.every(({ mood }) => MOODS.includes(mood))).toBe(true);
  });

  it("finds the snippet from any of its variants", () => {
    for (const snippet of SNIPPETS) {
      for (const { code } of Object.values(snippet.variants)) {
        expect(findSnippet(code)).toBe(snippet);
      }
    }
    expect(findSnippet("console.log('mine');")).toBeUndefined();
  });

  it("falls back to TypeScript for other languages", () => {
    const [snippet] = SNIPPETS;
    expect(snippetPatch(snippet!, "Ruby")).toMatchObject({
      content: snippet!.variants.TypeScript.code,
      properties: { language: "TypeScript", isSampleCode: false },
    });
  });
});
