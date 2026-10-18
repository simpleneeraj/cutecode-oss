import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const source = readFileSync(path.join(import.meta.dirname, "index.tsx"), "utf8");
const [frames, loaders] = source.split("const PRESET_LOADERS");
const importPaths = (text: string) => [...text.matchAll(/import\("(\.\/[^"]+)"\)/g)].map(([, importPath]) => importPath).sort();

describe("presets/index", () => {
  it("has a preload loader for every dynamic preset frame", () => {
    expect(importPaths(loaders)).toEqual(importPaths(frames));
  });
});
