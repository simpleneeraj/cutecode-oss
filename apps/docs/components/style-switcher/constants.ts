import { FontPairing, Palette, Style } from "@cutecode/ui/provider";
import { MonitorIcon } from "@solar-icons/react/linear/monitor";
import { MoonIcon } from "@solar-icons/react/linear/moon";
import { SunIcon } from "@solar-icons/react/linear/sun";

export enum ThemePreference {
  Light = "light",
  Dark = "dark",
  System = "system",
}

export const styleSwitcher = {
  styleLabels: {
    [Style.Tactile]: "Tactile",
    [Style.Glass]: "Glass",
    [Style.Pop]: "Pop",
    [Style.Clay]: "Clay",
    [Style.Paper]: "Paper",
    [Style.Minimal]: "Minimal",
  } satisfies Record<Style, string>,
  paletteLabels: {
    [Palette.Blue]: "Blue",
    [Palette.Indigo]: "Indigo",
    [Palette.Purple]: "Purple",
    [Palette.Pink]: "Pink",
    [Palette.Orange]: "Orange",
    [Palette.Green]: "Green",
    [Palette.Teal]: "Teal",
    [Palette.Graphite]: "Graphite",
  } satisfies Record<Palette, string>,
  fontLabels: {
    [FontPairing.System]: "System",
    [FontPairing.Editorial]: "Editorial",
    [FontPairing.Grotesk]: "Grotesk",
    [FontPairing.Rounded]: "Rounded",
    [FontPairing.Pop]: "Pop",
    [FontPairing.Slab]: "Slab",
    [FontPairing.Geometric]: "Geometric",
    [FontPairing.Tech]: "Tech",
  } satisfies Record<FontPairing, string>,
  themeLabels: {
    [ThemePreference.Light]: "Light",
    [ThemePreference.Dark]: "Dark",
    [ThemePreference.System]: "System",
  } satisfies Record<ThemePreference, string>,
  themeIcons: {
    [ThemePreference.Light]: SunIcon,
    [ThemePreference.Dark]: MoonIcon,
    [ThemePreference.System]: MonitorIcon,
  },
};
