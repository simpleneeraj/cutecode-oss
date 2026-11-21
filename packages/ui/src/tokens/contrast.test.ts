import { describe, expect, it } from "vitest";
import { Appearance, readValue } from "./appearance";
import { toVariableName } from "./css";
import { neutrals } from "./neutrals";
import { Palette, palettes, type PaletteTokens } from "./palettes";
import { Style, styles } from "./styles";

type ColorName = keyof typeof neutrals | keyof PaletteTokens;

type ContrastPair = {
  foreground: ColorName;
  background: ColorName;
  minimum: number;
};

const minimumContrast = {
  text: 4.5,
  nonText: 3,
};

const hexColorPattern = /^#[0-9a-f]{6}$/i;

const translucentColorPattern = /^rgba\(/;

const aliasPattern = /^var\((--[a-z-]+)\)$/;

function pairEach(foregrounds: ColorName[], backgrounds: ColorName[], minimum: number): ContrastPair[] {
  return foregrounds.flatMap((foreground) => backgrounds.map((background) => ({ foreground, background, minimum })));
}

const contrastPairs = [
  ...pairEach(
    ["foreground", "mutedForeground"],
    ["background", "card", "popover", "secondary", "muted"],
    minimumContrast.text,
  ),
  ...pairEach(["brandInk"], ["background", "card", "brandSoft"], minimumContrast.text),
  ...pairEach(["foreground"], ["segmentThumb"], minimumContrast.text),
  ...pairEach(["destructiveForeground"], ["pink"], minimumContrast.text),
  ...pairEach(["primaryForeground"], ["primary"], minimumContrast.text),
  ...pairEach(["orangeInk"], ["orange"], minimumContrast.text),
  ...pairEach(["purpleInk"], ["purple"], minimumContrast.text),
  ...pairEach(["yellowInk"], ["yellow"], minimumContrast.text),
  ...pairEach(["greenInk"], ["green"], minimumContrast.text),
  ...pairEach(["pinkInk"], ["pink"], minimumContrast.text),
  ...pairEach(["tealInk"], ["teal"], minimumContrast.text),
  ...pairEach(["indigoInk"], ["indigo"], minimumContrast.text),
  ...pairEach(["blueInk"], ["blue"], minimumContrast.text),
  ...pairEach(
    ["successForeground", "warningForeground", "destructiveForeground"],
    ["card", "background"],
    minimumContrast.text,
  ),
  ...pairEach(["input", "ring"], ["background", "card"], minimumContrast.nonText),
  ...pairEach(
    ["onFill"],
    ["grayFill", "orangeFill", "purpleFill", "yellowFill", "greenFill", "pinkFill", "tealFill", "indigoFill", "blueFill"],
    minimumContrast.nonText,
  ),
];

const themes = Object.values(Palette).flatMap((palette) =>
  Object.values(Style).flatMap((style) =>
    Object.values(Appearance).map((appearance) => ({ palette, style, appearance })),
  ),
);

function readVariables(palette: Palette, style: Style, appearance: Appearance) {
  const tokens = { ...neutrals, ...palettes[palette], ...styles[style] };
  return new Map(Object.entries(tokens).map(([key, value]) => [toVariableName(key), readValue(value, appearance)]));
}

function resolveColor(variables: Map<string, string>, name: string): string {
  const value = variables.get(name) ?? "";
  const alias = aliasPattern.exec(value);
  if (alias) {
    return resolveColor(variables, alias[1]);
  }
  return value;
}

function readLuminance(hexColor: string) {
  const [red, green, blue] = [1, 3, 5].map((start) => {
    const channel = Number.parseInt(hexColor.slice(start, start + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function measureContrast(firstColor: string, secondColor: string) {
  const [lighter, darker] = [readLuminance(firstColor), readLuminance(secondColor)].sort(
    (first, second) => second - first,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

describe.each(themes)("$palette palette, $style style, $appearance", ({ palette, style, appearance }) => {
  const variables = readVariables(palette, style, appearance);

  it.for(contrastPairs)("$foreground on $background", ({ foreground, background, minimum }, context) => {
    const foregroundColor = resolveColor(variables, toVariableName(foreground));
    const backgroundColor = resolveColor(variables, toVariableName(background));
    const isTranslucent = [foregroundColor, backgroundColor].some((color) => translucentColorPattern.test(color));
    if (isTranslucent) {
      context.skip();
    }
    expect(foregroundColor).toMatch(hexColorPattern);
    expect(backgroundColor).toMatch(hexColorPattern);
    expect(measureContrast(foregroundColor, backgroundColor)).toBeGreaterThanOrEqual(minimum);
  });
});
