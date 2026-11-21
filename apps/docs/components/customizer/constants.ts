import { FontPairing, Palette, Style } from "@cutecode/ui/provider";
import { MonitorIcon } from "@solar-icons/react/linear/monitor";
import { MoonIcon } from "@solar-icons/react/linear/moon";
import { SunIcon } from "@solar-icons/react/linear/sun";
import type { Transition } from "motion/react";

export enum ThemePreference {
  Light = "light",
  Dark = "dark",
  System = "system",
}

export enum CustomizerOverlay {
  Closed = "closed",
  Sheet = "sheet",
  Drawer = "drawer",
}

export const customizer = {
  title: "Customize",
  description: "Pick how CuteUI looks on every page of this site.",
  phoneQuery: "(max-width: 767px)",
  themeBuilderHref: "/themes",
  fontSampleText: "Quick brown fox jumps over the lazy dog.",
  swapShift: 4,
  styleOptions: {
    [Style.Tactile]: { name: "Tactile", feel: "Soft objects that lift and press" },
    [Style.Glass]: { name: "Glass", feel: "Frosted layers with a bright rim" },
    [Style.Pop]: { name: "Pop", feel: "Bold ink and offset shadows" },
    [Style.Clay]: { name: "Clay", feel: "Puffy shapes that press in" },
    [Style.Paper]: { name: "Paper", feel: "Flat ink lines" },
    [Style.Minimal]: { name: "Minimal", feel: "Quiet hairlines, no fuss" },
  } satisfies Record<Style, { name: string; feel: string }>,
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

export const customizerMotion = {
  swap: { duration: 0.14, ease: "easeOut" },
  pop: { type: "spring", stiffness: 640, damping: 30, mass: 0.6 },
  fade: { duration: 0.12, ease: "easeOut" },
  reveal: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
} satisfies Record<string, Transition>;
