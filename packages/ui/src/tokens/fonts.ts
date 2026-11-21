export enum FontPairing {
  System = "system",
}

export type FontStack = {
  fontSans: string;
  fontSerif: string;
  fontMono: string;
};

export const fontPairings = {
  [FontPairing.System]: {
    fontSans:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", "Segoe UI", system-ui, sans-serif',
    fontSerif: '"New York", ui-serif, "Instrument Serif", Georgia, serif',
    fontMono: 'ui-monospace, "SF Mono", "Geist Mono", Menlo, monospace',
  },
} satisfies Record<FontPairing, FontStack>;
