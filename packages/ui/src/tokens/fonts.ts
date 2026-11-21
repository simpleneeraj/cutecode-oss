export enum FontPairing {
  System = "system",
  Editorial = "editorial",
  Grotesk = "grotesk",
  Rounded = "rounded",
  Pop = "pop",
  Slab = "slab",
  Geometric = "geometric",
  Tech = "tech",
}

export type FontStack = {
  fontHeading: string;
  fontSans: string;
  fontSerif: string;
  fontMono: string;
};

const fallbacks = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  serif: '"New York", ui-serif, Georgia, serif',
  mono: 'ui-monospace, "SF Mono", Menlo, monospace',
};

export const fontPairings = {
  [FontPairing.System]: {
    fontHeading:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Segoe UI", system-ui, sans-serif',
    fontSans:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", "Segoe UI", system-ui, sans-serif',
    fontSerif: '"New York", ui-serif, "Instrument Serif", Georgia, serif',
    fontMono: 'ui-monospace, "SF Mono", "Geist Mono", Menlo, monospace',
  },
  [FontPairing.Editorial]: {
    fontHeading: `"Fraunces", "Iowan Old Style", "Palatino Linotype", Palatino, ${fallbacks.serif}`,
    fontSans: `"Source Sans 3", "Source Sans Pro", ${fallbacks.sans}`,
    fontSerif: `"Fraunces", "Iowan Old Style", "Palatino Linotype", Palatino, ${fallbacks.serif}`,
    fontMono: `"IBM Plex Mono", ${fallbacks.mono}`,
  },
  [FontPairing.Grotesk]: {
    fontHeading: `"Space Grotesk", "Inter", ${fallbacks.sans}`,
    fontSans: `"Inter", ${fallbacks.sans}`,
    fontSerif: `"Instrument Serif", ${fallbacks.serif}`,
    fontMono: `"JetBrains Mono", ${fallbacks.mono}`,
  },
  [FontPairing.Rounded]: {
    fontHeading: `"Nunito", ui-rounded, "SF Pro Rounded", ${fallbacks.sans}`,
    fontSans: `"Nunito Sans", "Nunito", ${fallbacks.sans}`,
    fontSerif: `"Fraunces", ${fallbacks.serif}`,
    fontMono: `"Fira Code", ${fallbacks.mono}`,
  },
  [FontPairing.Pop]: {
    fontHeading: `"Archivo Black", "Archivo", "Arial Black", ${fallbacks.sans}`,
    fontSans: `"Archivo", "Helvetica Neue", ${fallbacks.sans}`,
    fontSerif: `"Zilla Slab", "Roboto Slab", Rockwell, ${fallbacks.serif}`,
    fontMono: `"Space Mono", ${fallbacks.mono}`,
  },
  [FontPairing.Slab]: {
    fontHeading: `"Zilla Slab", "Roboto Slab", Rockwell, "Rockwell Nova", ${fallbacks.serif}`,
    fontSans: `"Inter", ${fallbacks.sans}`,
    fontSerif: `"Zilla Slab", "Roboto Slab", Rockwell, "Rockwell Nova", ${fallbacks.serif}`,
    fontMono: `"IBM Plex Mono", ${fallbacks.mono}`,
  },
  [FontPairing.Geometric]: {
    fontHeading: `"Outfit", "DM Sans", Futura, "Century Gothic", ${fallbacks.sans}`,
    fontSans: `"DM Sans", ${fallbacks.sans}`,
    fontSerif: `"DM Serif Display", ${fallbacks.serif}`,
    fontMono: `"DM Mono", ${fallbacks.mono}`,
  },
  [FontPairing.Tech]: {
    fontHeading: `"JetBrains Mono", ${fallbacks.mono}`,
    fontSans: `"IBM Plex Sans", ${fallbacks.sans}`,
    fontSerif: `"IBM Plex Serif", ${fallbacks.serif}`,
    fontMono: `"JetBrains Mono", ${fallbacks.mono}`,
  },
} satisfies Record<FontPairing, FontStack>;
