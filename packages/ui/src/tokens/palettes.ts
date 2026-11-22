import type { TokenValue } from "./appearance";

export enum Palette {
  Neutral = "neutral",
  Blue = "blue",
  Indigo = "indigo",
  Purple = "purple",
  Pink = "pink",
  Orange = "orange",
  Green = "green",
  Teal = "teal",
  Graphite = "graphite",
}

export type PaletteTokens = {
  brand: TokenValue;
  brandInk: TokenValue;
  brandSoft: TokenValue;
  primary: TokenValue;
  primaryForeground: TokenValue;
  ring: TokenValue;
  toneAccent: TokenValue;
  toneAccentInk: TokenValue;
  toneAccentBar: TokenValue;
};

export const palettes = {
  [Palette.Neutral]: {
    brand: { light: "#262626", dark: "#636366" },
    brandInk: { light: "#171717", dark: "#e5e5e5" },
    brandSoft: { light: "#f0f0f0", dark: "#2c2c2e" },
    primary: { light: "#262626", dark: "#f5f5f5" },
    primaryForeground: { light: "#fafafa", dark: "#262626" },
    ring: { light: "#737373", dark: "#a3a3a3" },
    toneAccent: { light: "var(--primary)", dark: "var(--primary)" },
    toneAccentInk: { light: "var(--primary-foreground)", dark: "var(--primary-foreground)" },
    toneAccentBar: { light: "var(--primary)", dark: "var(--primary)" },
  },
  [Palette.Blue]: {
    brand: { light: "#007aff", dark: "#0a84ff" },
    brandInk: { light: "#0066cc", dark: "#409cff" },
    brandSoft: { light: "#d6eaff", dark: "#18314b" },
    primary: "#0071e3",
    primaryForeground: "#ffffff",
    ring: { light: "#007aff", dark: "#0a84ff" },
    toneAccent: { light: "var(--brand-soft)", dark: "var(--brand-soft)" },
    toneAccentInk: { light: "var(--brand-ink)", dark: "var(--brand-ink)" },
    toneAccentBar: { light: "var(--brand)", dark: "var(--brand)" },
  },
  [Palette.Indigo]: {
    brand: { light: "#5856d6", dark: "#5e5ce6" },
    brandInk: { light: "#3634a3", dark: "#9796ff" },
    brandSoft: { light: "#e4e4f8", dark: "#292946" },
    primary: "#5856d6",
    primaryForeground: "#ffffff",
    ring: { light: "#5856d6", dark: "#5e5ce6" },
    toneAccent: { light: "var(--brand-soft)", dark: "var(--brand-soft)" },
    toneAccentInk: { light: "var(--brand-ink)", dark: "var(--brand-ink)" },
    toneAccentBar: { light: "var(--brand)", dark: "var(--brand)" },
  },
  [Palette.Purple]: {
    brand: { light: "#af52de", dark: "#bf5af2" },
    brandInk: { light: "#8944ab", dark: "#da8fff" },
    brandSoft: { light: "#f2e3fa", dark: "#3d2848" },
    primary: "#aa47dc",
    primaryForeground: "#ffffff",
    ring: { light: "#af52de", dark: "#bf5af2" },
    toneAccent: { light: "var(--brand-soft)", dark: "var(--brand-soft)" },
    toneAccentInk: { light: "var(--brand-ink)", dark: "var(--brand-ink)" },
    toneAccentBar: { light: "var(--brand)", dark: "var(--brand)" },
  },
  [Palette.Pink]: {
    brand: { light: "#ff2d55", dark: "#ff375f" },
    brandInk: { light: "#b80c3c", dark: "#ff6482" },
    brandSoft: { light: "#ffdde4", dark: "#49212b" },
    primary: "#ed002d",
    primaryForeground: "#ffffff",
    ring: { light: "#ff2d55", dark: "#ff375f" },
    toneAccent: { light: "var(--brand-soft)", dark: "var(--brand-soft)" },
    toneAccentInk: { light: "var(--brand-ink)", dark: "var(--brand-ink)" },
    toneAccentBar: { light: "var(--brand)", dark: "var(--brand)" },
  },
  [Palette.Orange]: {
    brand: { light: "#ff9500", dark: "#ff9f0a" },
    brandInk: { light: "#c93400", dark: "#ffb340" },
    brandSoft: { light: "#ffeed6", dark: "#49361a" },
    primary: "#ad6500",
    primaryForeground: "#ffffff",
    ring: { light: "#cd7700", dark: "#ff9f0a" },
    toneAccent: { light: "var(--brand-soft)", dark: "var(--brand-soft)" },
    toneAccentInk: { light: "var(--brand-ink)", dark: "var(--brand-ink)" },
    toneAccentBar: { light: "var(--brand)", dark: "var(--brand)" },
  },
  [Palette.Green]: {
    brand: { light: "#34c759", dark: "#30d158" },
    brandInk: { light: "#1d7334", dark: "#30db5b" },
    brandSoft: { light: "#dff6e4", dark: "#20402a" },
    primary: "#24883d",
    primaryForeground: "#ffffff",
    ring: { light: "#2aa048", dark: "#30d158" },
    toneAccent: { light: "var(--brand-soft)", dark: "var(--brand-soft)" },
    toneAccentInk: { light: "var(--brand-ink)", dark: "var(--brand-ink)" },
    toneAccentBar: { light: "var(--brand)", dark: "var(--brand)" },
  },
  [Palette.Teal]: {
    brand: { light: "#30b0c7", dark: "#40c8e0" },
    brandInk: { light: "#0071a4", dark: "#5de6ff" },
    brandSoft: { light: "#def2f6", dark: "#233e45" },
    primary: "#238192",
    primaryForeground: "#ffffff",
    ring: { light: "#2a99ae", dark: "#40c8e0" },
    toneAccent: { light: "var(--brand-soft)", dark: "var(--brand-soft)" },
    toneAccentInk: { light: "var(--brand-ink)", dark: "var(--brand-ink)" },
    toneAccentBar: { light: "var(--brand)", dark: "var(--brand)" },
  },
  [Palette.Graphite]: {
    brand: { light: "#8e8e93", dark: "#98989d" },
    brandInk: { light: "#6b6b6f", dark: "#aeaeb2" },
    brandSoft: { light: "#ededee", dark: "#353537" },
    primary: "#76767c",
    primaryForeground: "#ffffff",
    ring: { light: "#8b8b91", dark: "#98989d" },
    toneAccent: { light: "var(--primary)", dark: "var(--primary)" },
    toneAccentInk: { light: "var(--primary-foreground)", dark: "var(--primary-foreground)" },
    toneAccentBar: { light: "var(--primary)", dark: "var(--primary)" },
  },
} satisfies Record<Palette, PaletteTokens>;
