import { renderThemeCss } from "../tokens/css";
import { FontPairing, fontPairings } from "../tokens/fonts";
import { Palette } from "../tokens/palettes";
import { Style, suggestedFontPairings } from "../tokens/styles";

export { FontPairing, fontPairings, Palette, renderThemeCss, Style, suggestedFontPairings };

export type StyleSettings = {
  style: Style;
  palette: Palette;
  font: FontPairing;
};

export const defaultStyleSettings = {
  style: Style.Tactile,
  palette: Palette.Blue,
  font: FontPairing.System,
} satisfies StyleSettings;

export const styleSettingsCookie = {
  name: "cutecode-style",
  separator: ".",
  maxAgeSeconds: 60 * 60 * 24 * 365,
};

type StyleSettingsCandidates = Partial<Record<keyof StyleSettings, unknown>>;

function pickValue<Value extends string>(values: Value[], candidate: unknown, fallback: Value) {
  return values.find((value) => value === candidate) ?? fallback;
}

export function pickStyleSettings(candidates: StyleSettingsCandidates, fallback: StyleSettings): StyleSettings {
  return {
    style: pickValue(Object.values(Style), candidates.style, fallback.style),
    palette: pickValue(Object.values(Palette), candidates.palette, fallback.palette),
    font: pickValue(Object.values(FontPairing), candidates.font, fallback.font),
  };
}

export function readStyleSettings(cookieValue: string | undefined): StyleSettings {
  const [style, palette, font] = (cookieValue ?? "").split(styleSettingsCookie.separator);
  return pickStyleSettings({ style, palette, font }, defaultStyleSettings);
}

export function serializeStyleSettings(settings: StyleSettings) {
  return [settings.style, settings.palette, settings.font].join(styleSettingsCookie.separator);
}
