import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { renderTokensCss, tokensFile } from "./css";

it("tokens.css matches the generator output", () => {
  expect(readFileSync(tokensFile, "utf8")).toBe(renderTokensCss());
});
