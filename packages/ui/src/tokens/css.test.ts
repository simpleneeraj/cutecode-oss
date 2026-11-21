import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderThemeCss, renderTokensCss, toVariableName } from "./css";
import { densities, Density } from "./density";
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

describe("density", () => {
  const css = renderTokensCss();
  const regularRoot = ":root {\n  --control-height-small: 2.125rem;";
  const compactUnderFinePointer =
    "@media (pointer: fine) and (min-width: 48rem) {\n  :root {\n    --control-height-small: 1.75rem;";
  const regularOverride = '[data-density="regular"] {\n  --control-height-small: 2.125rem;';
  const compactOverride = '[data-density="compact"] {\n  --control-height-small: 1.75rem;';

  it("keeps 44pt touch sizes in regular", () => {
    const regular = densities[Density.Regular];
    expect([regular.controlHeightMedium, regular.fieldHeight, regular.rowHeight]).toEqual([
      "2.75rem",
      "2.75rem",
      "2.75rem",
    ]);
    expect(regular.bodySize).toBe("1.0625rem");
  });

  it("renders regular on the root, compact for a fine pointer, then the data-density overrides", () => {
    const positions = [regularRoot, compactUnderFinePointer, regularOverride, compactOverride].map((block) =>
      css.indexOf(block),
    );
    expect(positions.every((position) => position > 0)).toBe(true);
    expect(positions).toEqual(positions.toSorted((first, second) => first - second));
  });

  it("renders every density token in every block", () => {
    const variableNames = Object.keys(densities[Density.Regular]).map(toVariableName);
    const blocks = [regularRoot, compactUnderFinePointer, regularOverride, compactOverride].map(
      (block) => css.slice(css.indexOf(block)).split("}")[0],
    );
    blocks.forEach((block) => variableNames.forEach((name) => expect(block).toContain(`${name}: `)));
  });

  it("leaves density out of a single theme export", () => {
    const themeCss = renderThemeCss({ style: Style.Tactile, palette: Palette.Blue, font: FontPairing.System });
    expect(themeCss).not.toContain("--row-height");
  });
});
