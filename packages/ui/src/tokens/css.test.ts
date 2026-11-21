import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { renderThemeCss, renderTokensCss } from "./css";
import { tokensFile } from "./file";
import { FontPairing } from "./fonts";
import { Palette } from "./palettes";
import { Style } from "./styles";

it("tokens.css matches the generator output", () => {
  expect(readFileSync(tokensFile, "utf8")).toBe(renderTokensCss());
});

it("renders one combination as root and dark variables", () => {
  const css = renderThemeCss({ style: Style.Pop, palette: Palette.Teal, font: FontPairing.Pop });
  expect(css.startsWith(":root {")).toBe(true);
  expect(css).toContain("\n.dark {");
  expect(css).toContain("  --radius-control: 14px;");
  expect(css).toContain("  --edge-width: 2px;");
  expect(css).toContain('  --font-heading: "Archivo Black"');
  expect(css).not.toContain("[data-");
});

it("renders the default combination as the head of tokens.css", () => {
  const css = renderThemeCss({ style: Style.Tactile, palette: Palette.Blue, font: FontPairing.System });
  expect(renderTokensCss()).toContain(css.trimEnd());
});
