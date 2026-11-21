import { describe, expect, it } from "vitest";
import { Appearance, readValue } from "./appearance";
import { toVariableName } from "./css";
import { neutrals } from "./neutrals";
import { Palette, palettes, type PaletteTokens } from "./palettes";
import { Style, styles } from "./styles";

type ColorName = keyof typeof neutrals | keyof PaletteTokens;

type ContrastPair = {
  foreground: ColorName;
  layers: ColorName[];
  surface: string;
  minimum: number;
};

type Channels = [red: number, green: number, blue: number];

const minimumContrast = {
  text: 4.5,
  nonText: 3,
  fill: 1.15,
};

const hexColorPattern = /^#[0-9a-f]{6}$/i;

const translucentColorPattern = /^rgba\((\d+), (\d+), (\d+), ([\d.]+)\)$/;

const aliasPattern = /^var\((--[a-z-]+)\)$/;

const gradientTopStopPattern = /^linear-gradient\(\d+deg, (rgba\([^)]+\))/;

const noLayer = "none";

function pairLayered(foregrounds: ColorName[], stacks: ColorName[][], minimum: number): ContrastPair[] {
  return foregrounds.flatMap((foreground) =>
    stacks.map((layers) => ({ foreground, layers, surface: layers.toReversed().join(" over "), minimum })),
  );
}

function pairEach(foregrounds: ColorName[], backgrounds: ColorName[], minimum: number): ContrastPair[] {
  return pairLayered(
    foregrounds,
    backgrounds.map((background) => [background]),
    minimum,
  );
}

const contrastPairs = [
  ...pairEach(
    ["foreground", "mutedForeground"],
    ["background", "card", "popover", "secondary", "muted", "accent"],
    minimumContrast.text,
  ),
  ...pairLayered(
    ["foreground", "mutedForeground"],
    [
      ["wallpaperTop", "glow"],
      ["wallpaperBottom"],
      ["wallpaperTop", "glow", "glass"],
      ["wallpaperBottom", "glass"],
      ["wallpaperTop", "glow", "glass", "glassSheen"],
      ["wallpaperBottom", "glass", "glassSheen"],
    ],
    minimumContrast.text,
  ),
  ...pairEach(["destructiveForeground"], ["destructiveSoft"], minimumContrast.text),
  ...pairEach(["noteInk"], ["note"], minimumContrast.text),
  ...pairEach(["syntaxType", "syntaxString", "syntaxComment"], ["card"], minimumContrast.text),
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
  ...pairEach(["secondary", "muted", "border"], ["card", "popover"], minimumContrast.fill),
  ...pairEach(
    ["onFill"],
    [
      "grayFill",
      "orangeFill",
      "purpleFill",
      "yellowFill",
      "greenFill",
      "pinkFill",
      "tealFill",
      "indigoFill",
      "blueFill",
    ],
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

function readLayerColor(variables: Map<string, string>, name: string) {
  const color = resolveColor(variables, name);
  return gradientTopStopPattern.exec(color)?.[1] ?? color;
}

function readHexChannels(hexColor: string): Channels {
  const [red, green, blue] = [1, 3, 5].map((start) => Number.parseInt(hexColor.slice(start, start + 2), 16));
  return [red, green, blue];
}

function blendLayer(below: Channels, color: string): Channels {
  const translucent = translucentColorPattern.exec(color);
  if (!translucent) {
    return readHexChannels(color);
  }
  const alpha = Number(translucent[4]);
  const [red, green, blue] = below.map(
    (channel, index) => Number(translucent[index + 1]) * alpha + channel * (1 - alpha),
  );
  return [red, green, blue];
}

function composeLayers(colors: string[]) {
  const [base, ...above] = colors;
  return above.reduce(blendLayer, readHexChannels(base));
}

function readLuminance(channels: Channels) {
  const [red, green, blue] = channels.map((value) => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function measureContrast(foreground: Channels, background: Channels) {
  const [lighter, darker] = [readLuminance(foreground), readLuminance(background)].sort(
    (first, second) => second - first,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

describe.each(themes)("$palette palette, $style style, $appearance", ({ palette, style, appearance }) => {
  const variables = readVariables(palette, style, appearance);

  it.for(contrastPairs)("$foreground on $surface", ({ foreground, layers, minimum }, context) => {
    const foregroundColor = resolveColor(variables, toVariableName(foreground));
    const layerColors = layers
      .map((layer) => readLayerColor(variables, toVariableName(layer)))
      .filter((color) => color !== noLayer);
    const isTranslucent = [foregroundColor, layerColors[0]].some((color) => translucentColorPattern.test(color));
    if (isTranslucent) {
      context.skip();
    }
    expect(foregroundColor).toMatch(hexColorPattern);
    layerColors.forEach((color) =>
      expect(color).toMatch(color.startsWith("#") ? hexColorPattern : translucentColorPattern),
    );
    expect(measureContrast(readHexChannels(foregroundColor), composeLayers(layerColors))).toBeGreaterThanOrEqual(
      minimum,
    );
  });
});
