import type { TokenValue } from "./appearance";

export enum Palette {
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
};

export const palettes = {
  [Palette.Blue]: {
    brand: { light: "#007aff", dark: "#0a84ff" },
    brandInk: { light: "#0066cc", dark: "#409cff" },
    brandSoft: { light: "#d6eaff", dark: "#18314b" },
    primary: "#0071e3",
    primaryForeground: "#ffffff",
    ring: { light: "#007aff", dark: "#0a84ff" },
  },
  [Palette.Indigo]: {
    brand: { light: "#5856d6", dark: "#5e5ce6" },
    brandInk: { light: "#3634a3", dark: "#9796ff" },
    brandSoft: { light: "#e4e4f8", dark: "#292946" },
    primary: "#5856d6",
    primaryForeground: "#ffffff",
    ring: { light: "#5856d6", dark: "#5e5ce6" },
  },
  [Palette.Purple]: {
    brand: { light: "#af52de", dark: "#bf5af2" },
    brandInk: { light: "#8944ab", dark: "#da8fff" },
    brandSoft: { light: "#f2e3fa", dark: "#3d2848" },
    primary: "#aa47dc",
    primaryForeground: "#ffffff",
    ring: { light: "#af52de", dark: "#bf5af2" },
  },
  [Palette.Pink]: {
    brand: { light: "#ff2d55", dark: "#ff375f" },
    brandInk: { light: "#b80c3c", dark: "#ff6482" },
    brandSoft: { light: "#ffdde4", dark: "#49212b" },
    primary: "#ed002d",
    primaryForeground: "#ffffff",
    ring: { light: "#ff2d55", dark: "#ff375f" },
  },
  [Palette.Orange]: {
    brand: { light: "#ff9500", dark: "#ff9f0a" },
    brandInk: { light: "#c93400", dark: "#ffb340" },
    brandSoft: { light: "#ffeed6", dark: "#49361a" },
    primary: "#ad6500",
    primaryForeground: "#ffffff",
    ring: { light: "#cd7700", dark: "#ff9f0a" },
  },
  [Palette.Green]: {
    brand: { light: "#34c759", dark: "#30d158" },
    brandInk: { light: "#1d7334", dark: "#30db5b" },
    brandSoft: { light: "#dff6e4", dark: "#20402a" },
    primary: "#24883d",
    primaryForeground: "#ffffff",
    ring: { light: "#2aa048", dark: "#30d158" },
  },
  [Palette.Teal]: {
    brand: { light: "#30b0c7", dark: "#40c8e0" },
    brandInk: { light: "#0071a4", dark: "#5de6ff" },
    brandSoft: { light: "#def2f6", dark: "#233e45" },
    primary: "#238192",
    primaryForeground: "#ffffff",
    ring: { light: "#2a99ae", dark: "#40c8e0" },
  },
  [Palette.Graphite]: {
    brand: { light: "#8e8e93", dark: "#98989d" },
    brandInk: { light: "#6b6b6f", dark: "#aeaeb2" },
    brandSoft: { light: "#ededee", dark: "#353537" },
    primary: "#76767c",
    primaryForeground: "#ffffff",
    ring: { light: "#8b8b91", dark: "#98989d" },
  },
} satisfies Record<Palette, PaletteTokens>;
