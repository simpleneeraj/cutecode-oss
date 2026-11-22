import type { AppearanceValue } from "./appearance";
import { FontPairing } from "./fonts";
import type { neutrals } from "./neutrals";

export enum Style {
  Tactile = "tactile",
  Glass = "glass",
  Pop = "pop",
  Clay = "clay",
  Paper = "paper",
  Minimal = "minimal",
}

type NeutralOverrides = Partial<Record<keyof typeof neutrals, AppearanceValue>>;

export type StyleTokens = NeutralOverrides & {
  radiusControl: string;
  radiusSurface: string;
  radiusOverlay: string;
  radiusField: string;
  radiusIcon: string;
  edgeWidth: string;
  edgeColor: AppearanceValue;
  edgeHighlight: AppearanceValue;
  elevationRest: AppearanceValue;
  elevationRaised: AppearanceValue;
  elevationPress: AppearanceValue;
  elevationIcon: AppearanceValue;
  elevationThumb: AppearanceValue;
  elevationGlass: AppearanceValue;
  focusRing: AppearanceValue;
  surfaceBlur: string;
  surfaceSaturate: string;
  pressScale: string;
  pressShiftX: string;
  pressShiftY: string;
  headingWeight: string;
  headingTracking: string;
};

const inkColors = {
  pop: { light: "#16130d", dark: "#f6efdf" },
  paper: { light: "#1c1b19", dark: "#e9e5db" },
} satisfies Record<string, AppearanceValue>;

const noShadow = "0 0 0 0 transparent";

const noSheen = { light: "none", dark: "none" } satisfies AppearanceValue;

const focusRings = {
  onWhite: {
    light: "0 0 0 1px var(--ring), 0 0 0 4px color-mix(in srgb, var(--ring) 24%, transparent)",
    dark: "0 0 0 1px var(--ring), 0 0 0 4px color-mix(in srgb, var(--ring) 24%, transparent)",
  },
  onCanvas: {
    light: "0 0 0 1px var(--ring), 0 0 0 4px color-mix(in srgb, var(--ring) 24%, transparent)",
    dark: "0 0 0 1px var(--ring), 0 0 0 4px color-mix(in srgb, var(--ring) 24%, transparent)",
  },
} satisfies Record<string, AppearanceValue>;

function offsetShadow(offset: string, ink: AppearanceValue): AppearanceValue {
  return { light: `${offset} ${ink.light}`, dark: `${offset} ${ink.dark}` };
}

export const styles = {
  [Style.Tactile]: {
    radiusControl: "10px",
    radiusSurface: "22px",
    radiusOverlay: "28px",
    radiusField: "10px",
    radiusIcon: "22.37%",
    edgeWidth: "0px",
    edgeColor: { light: "rgba(0, 0, 0, 0.04)", dark: "rgba(255, 255, 255, 0.06)" },
    edgeHighlight: { light: "rgba(255, 255, 255, 0.9)", dark: "rgba(255, 255, 255, 0.14)" },
    elevationRest: {
      light: "0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)",
      dark: "0 0 0 1px rgba(255, 255, 255, 0.06)",
    },
    elevationRaised: {
      light: "0 1px 3px rgba(0, 0, 0, 0.06), 0 10px 24px -8px rgba(0, 0, 0, 0.14)",
      dark: "0 0 0 1px rgba(255, 255, 255, 0.08), 0 10px 24px -8px rgba(0, 0, 0, 0.55)",
    },
    elevationPress: {
      light: "0 1px 2px rgba(0, 0, 0, 0.04)",
      dark: "0 0 0 1px rgba(255, 255, 255, 0.06)",
    },
    elevationIcon: {
      light:
        "inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -2px 5px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.10), 0 8px 16px -8px rgba(0, 0, 0, 0.28)",
      dark: "inset 0 1px 0 rgba(255, 255, 255, 0.14), inset 0 -2px 5px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.6), 0 8px 16px -8px rgba(0, 0, 0, 0.9)",
    },
    elevationThumb: {
      light: "0 3px 8px rgba(0, 0, 0, 0.15), 0 3px 1px rgba(0, 0, 0, 0.06), 0 0 0 0.5px rgba(0, 0, 0, 0.04)",
      dark: "0 3px 8px rgba(0, 0, 0, 0.5), 0 3px 1px rgba(0, 0, 0, 0.2)",
    },
    elevationGlass: {
      light:
        "inset 0 1px 0 rgba(255, 255, 255, 0.85), inset 0 0 0 0.5px rgba(255, 255, 255, 0.6), 0 8px 30px -8px rgba(0, 0, 0, 0.18)",
      dark: "inset 0 1px 0 rgba(255, 255, 255, 0.14), inset 0 0 0 0.5px rgba(255, 255, 255, 0.10), 0 8px 30px -8px rgba(0, 0, 0, 0.7)",
    },
    focusRing: focusRings.onWhite,
    surfaceBlur: "30px",
    surfaceSaturate: "180%",
    pressScale: "0.97",
    pressShiftX: "0px",
    pressShiftY: "0px",
    headingWeight: "600",
    headingTracking: "-0.01em",
  },
  [Style.Glass]: {
    glass: { light: "rgba(255, 255, 255, 0.5)", dark: "rgba(40, 40, 44, 0.46)" },
    glassEdge: { light: "rgba(255, 255, 255, 0.95)", dark: "rgba(255, 255, 255, 0.2)" },
    radiusControl: "14px",
    radiusSurface: "26px",
    radiusOverlay: "30px",
    radiusField: "14px",
    radiusIcon: "22.37%",
    edgeWidth: "1px",
    edgeColor: { light: "rgba(255, 255, 255, 0.7)", dark: "rgba(255, 255, 255, 0.14)" },
    edgeHighlight: { light: "rgba(255, 255, 255, 0.95)", dark: "rgba(255, 255, 255, 0.28)" },
    elevationRest: {
      light:
        "inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px -6px rgba(0, 0, 0, 0.10)",
      dark: "inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.08), 0 8px 24px -6px rgba(0, 0, 0, 0.6)",
    },
    elevationRaised: {
      light:
        "inset 0 1px 0 rgba(255, 255, 255, 0.85), 0 2px 8px rgba(0, 0, 0, 0.05), 0 24px 56px -12px rgba(0, 0, 0, 0.20)",
      dark: "inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 0 0 1px rgba(255, 255, 255, 0.10), 0 24px 56px -12px rgba(0, 0, 0, 0.85)",
    },
    elevationPress: {
      light: "inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 3px rgba(0, 0, 0, 0.06)",
      dark: "inset 0 1px 0 rgba(255, 255, 255, 0.10), 0 0 0 1px rgba(255, 255, 255, 0.06)",
    },
    elevationIcon: {
      light:
        "inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 0 0 0.5px rgba(255, 255, 255, 0.6), 0 1px 2px rgba(0, 0, 0, 0.08), 0 8px 18px -8px rgba(0, 0, 0, 0.26)",
      dark: "inset 0 1px 0 rgba(255, 255, 255, 0.18), inset 0 0 0 0.5px rgba(255, 255, 255, 0.10), 0 1px 2px rgba(0, 0, 0, 0.6), 0 8px 18px -8px rgba(0, 0, 0, 0.9)",
    },
    elevationThumb: {
      light: "inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 3px 10px rgba(0, 0, 0, 0.14), 0 0 0 0.5px rgba(0, 0, 0, 0.04)",
      dark: "inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 3px 10px rgba(0, 0, 0, 0.5)",
    },
    elevationGlass: {
      light:
        "inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 0 rgba(255, 255, 255, 0.35), inset 0 0 0 0.5px rgba(255, 255, 255, 0.7), 0 10px 36px -10px rgba(0, 0, 0, 0.20)",
      dark: "inset 0 1px 0 rgba(255, 255, 255, 0.18), inset 0 -1px 0 rgba(255, 255, 255, 0.06), inset 0 0 0 0.5px rgba(255, 255, 255, 0.12), 0 10px 36px -10px rgba(0, 0, 0, 0.75)",
    },
    focusRing: focusRings.onWhite,
    surfaceBlur: "30px",
    surfaceSaturate: "180%",
    pressScale: "0.97",
    pressShiftX: "0px",
    pressShiftY: "0px",
    headingWeight: "600",
    headingTracking: "-0.015em",
  },
  [Style.Pop]: {
    background: { light: "#fbf4e4", dark: "#17150f" },
    card: { light: "#fffcf5", dark: "#221f18" },
    popover: { light: "#fffcf5", dark: "#2b271f" },
    secondary: { light: "#f1e7cf", dark: "#38332a" },
    muted: { light: "#efe5ce", dark: "#37322b" },
    mutedForeground: { light: "#5e5847", dark: "#b9b1a0" },
    accent: { light: "#f6eddb", dark: "#2b271f" },
    border: { light: "#d6ccb4", dark: "#4d473b" },
    segmentThumb: { light: "#fffcf5", dark: "#5c564a" },
    glass: { light: "#fffcf5", dark: "#221f18" },
    glassEdge: inkColors.pop,
    glassSolid: { light: "#fffcf5", dark: "#221f18" },
    glassSheen: noSheen,
    radiusControl: "14px",
    radiusSurface: "16px",
    radiusOverlay: "16px",
    radiusField: "14px",
    radiusIcon: "22.37%",
    edgeWidth: "2px",
    edgeColor: inkColors.pop,
    edgeHighlight: { light: "rgba(255, 255, 255, 0.7)", dark: "rgba(255, 255, 255, 0.12)" },
    elevationRest: offsetShadow("4px 4px 0", inkColors.pop),
    elevationRaised: offsetShadow("6px 6px 0", inkColors.pop),
    elevationPress: offsetShadow("1px 1px 0", inkColors.pop),
    elevationIcon: offsetShadow("3px 3px 0", inkColors.pop),
    elevationThumb: offsetShadow("2px 2px 0", inkColors.pop),
    elevationGlass: offsetShadow("4px 4px 0", inkColors.pop),
    focusRing: focusRings.onCanvas,
    surfaceBlur: "0px",
    surfaceSaturate: "100%",
    pressScale: "1",
    pressShiftX: "3px",
    pressShiftY: "3px",
    headingWeight: "800",
    headingTracking: "-0.02em",
  },
  [Style.Clay]: {
    radiusControl: "16px",
    radiusSurface: "24px",
    radiusOverlay: "30px",
    radiusField: "16px",
    radiusIcon: "28%",
    edgeWidth: "0px",
    edgeColor: { light: "rgba(0, 0, 0, 0)", dark: "rgba(255, 255, 255, 0)" },
    edgeHighlight: { light: "rgba(255, 255, 255, 0.9)", dark: "rgba(255, 255, 255, 0.10)" },
    elevationRest: {
      light:
        "inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -4px 8px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.05), 0 8px 18px -6px rgba(0, 0, 0, 0.14)",
      dark: "inset 0 2px 4px rgba(255, 255, 255, 0.08), inset 0 -4px 8px rgba(0, 0, 0, 0.45), 0 2px 4px rgba(0, 0, 0, 0.5), 0 8px 18px -6px rgba(0, 0, 0, 0.7)",
    },
    elevationRaised: {
      light:
        "inset 0 3px 6px rgba(255, 255, 255, 0.9), inset 0 -6px 12px rgba(0, 0, 0, 0.07), 0 4px 10px rgba(0, 0, 0, 0.06), 0 20px 44px -12px rgba(0, 0, 0, 0.22)",
      dark: "inset 0 3px 6px rgba(255, 255, 255, 0.10), inset 0 -6px 12px rgba(0, 0, 0, 0.5), 0 4px 10px rgba(0, 0, 0, 0.5), 0 20px 44px -12px rgba(0, 0, 0, 0.85)",
    },
    elevationPress: {
      light:
        "inset 0 3px 6px rgba(0, 0, 0, 0.10), inset 0 -1px 2px rgba(255, 255, 255, 0.7), 0 1px 2px rgba(0, 0, 0, 0.05)",
      dark: "inset 0 3px 6px rgba(0, 0, 0, 0.55), inset 0 -1px 2px rgba(255, 255, 255, 0.06), 0 1px 2px rgba(0, 0, 0, 0.5)",
    },
    elevationIcon: {
      light:
        "inset 0 2px 3px rgba(255, 255, 255, 0.95), inset 0 -3px 6px rgba(0, 0, 0, 0.08), 0 6px 14px -6px rgba(0, 0, 0, 0.26)",
      dark: "inset 0 2px 3px rgba(255, 255, 255, 0.12), inset 0 -3px 6px rgba(0, 0, 0, 0.5), 0 6px 14px -6px rgba(0, 0, 0, 0.9)",
    },
    elevationThumb: {
      light:
        "inset 0 2px 3px rgba(255, 255, 255, 0.95), inset 0 -2px 4px rgba(0, 0, 0, 0.06), 0 4px 10px rgba(0, 0, 0, 0.15)",
      dark: "inset 0 2px 3px rgba(255, 255, 255, 0.14), inset 0 -2px 4px rgba(0, 0, 0, 0.4), 0 4px 10px rgba(0, 0, 0, 0.6)",
    },
    elevationGlass: {
      light:
        "inset 0 2px 4px rgba(255, 255, 255, 0.85), inset 0 -4px 10px rgba(0, 0, 0, 0.05), 0 12px 32px -10px rgba(0, 0, 0, 0.20)",
      dark: "inset 0 2px 4px rgba(255, 255, 255, 0.10), inset 0 -4px 10px rgba(0, 0, 0, 0.45), 0 12px 32px -10px rgba(0, 0, 0, 0.8)",
    },
    focusRing: focusRings.onWhite,
    surfaceBlur: "24px",
    surfaceSaturate: "160%",
    pressScale: "0.97",
    pressShiftX: "0px",
    pressShiftY: "1px",
    headingWeight: "700",
    headingTracking: "-0.01em",
  },
  [Style.Paper]: {
    background: { light: "#f6f3ec", dark: "#141311" },
    card: { light: "#ffffff", dark: "#1f1e1b" },
    popover: { light: "#ffffff", dark: "#292724" },
    secondary: { light: "#e4dfd4", dark: "#36332e" },
    muted: { light: "#e7e2d8", dark: "#35322e" },
    mutedForeground: { light: "#5c5850", dark: "#b5afa4" },
    accent: { light: "#f5f2ec", dark: "#292724" },
    border: { light: "#cdc6b8", dark: "#47443e" },
    segmentThumb: { light: "#ffffff", dark: "#5e5a52" },
    glass: { light: "#ffffff", dark: "#1f1e1b" },
    glassEdge: inkColors.paper,
    glassSolid: { light: "#ffffff", dark: "#1f1e1b" },
    glassSheen: noSheen,
    radiusControl: "12px",
    radiusSurface: "16px",
    radiusOverlay: "18px",
    radiusField: "12px",
    radiusIcon: "22.37%",
    edgeWidth: "1px",
    edgeColor: inkColors.paper,
    edgeHighlight: { light: "rgba(255, 255, 255, 0)", dark: "rgba(255, 255, 255, 0)" },
    elevationRest: { light: noShadow, dark: noShadow },
    elevationRaised: offsetShadow("1px 1px 0", inkColors.paper),
    elevationPress: { light: noShadow, dark: noShadow },
    elevationIcon: { light: noShadow, dark: noShadow },
    elevationThumb: offsetShadow("0 0 0 1px", inkColors.paper),
    elevationGlass: offsetShadow("1px 1px 0", inkColors.paper),
    focusRing: focusRings.onCanvas,
    surfaceBlur: "0px",
    surfaceSaturate: "100%",
    pressScale: "0.98",
    pressShiftX: "0px",
    pressShiftY: "0px",
    headingWeight: "600",
    headingTracking: "-0.02em",
  },
  [Style.Minimal]: {
    radiusControl: "10px",
    radiusSurface: "12px",
    radiusOverlay: "14px",
    radiusField: "10px",
    radiusIcon: "22.37%",
    edgeWidth: "1px",
    edgeColor: { light: "rgba(0, 0, 0, 0.10)", dark: "rgba(255, 255, 255, 0.12)" },
    edgeHighlight: { light: "rgba(255, 255, 255, 0.6)", dark: "rgba(255, 255, 255, 0.08)" },
    elevationRest: {
      light: "0 1px 2px rgba(0, 0, 0, 0.04)",
      dark: "0 0 0 1px rgba(255, 255, 255, 0.06)",
    },
    elevationRaised: {
      light: "0 0 0 1px rgba(0, 0, 0, 0.04), 0 8px 24px -8px rgba(0, 0, 0, 0.14)",
      dark: "0 0 0 1px rgba(255, 255, 255, 0.08), 0 8px 24px -8px rgba(0, 0, 0, 0.7)",
    },
    elevationPress: { light: noShadow, dark: noShadow },
    elevationIcon: {
      light: "inset 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.08)",
      dark: "inset 0 0 0 0.5px rgba(255, 255, 255, 0.10), 0 1px 2px rgba(0, 0, 0, 0.5)",
    },
    elevationThumb: {
      light: "0 1px 3px rgba(0, 0, 0, 0.12), 0 0 0 0.5px rgba(0, 0, 0, 0.06)",
      dark: "0 1px 3px rgba(0, 0, 0, 0.5)",
    },
    elevationGlass: {
      light: "inset 0 0 0 0.5px rgba(0, 0, 0, 0.06), 0 4px 16px -4px rgba(0, 0, 0, 0.12)",
      dark: "inset 0 0 0 0.5px rgba(255, 255, 255, 0.10), 0 4px 16px -4px rgba(0, 0, 0, 0.7)",
    },
    focusRing: focusRings.onWhite,
    surfaceBlur: "20px",
    surfaceSaturate: "150%",
    pressScale: "0.98",
    pressShiftX: "0px",
    pressShiftY: "0px",
    headingWeight: "600",
    headingTracking: "-0.01em",
  },
} satisfies Record<Style, StyleTokens>;

export const suggestedFontPairings = {
  [Style.Tactile]: FontPairing.System,
  [Style.Glass]: FontPairing.System,
  [Style.Pop]: FontPairing.Pop,
  [Style.Clay]: FontPairing.Rounded,
  [Style.Paper]: FontPairing.Editorial,
  [Style.Minimal]: FontPairing.System,
} satisfies Record<Style, FontPairing>;
