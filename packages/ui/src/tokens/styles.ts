import type { AppearanceValue } from "./appearance";

export enum Style {
  Tactile = "tactile",
}

export type StyleTokens = {
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
  pressShift: string;
  headingWeight: string;
  headingTracking: string;
};

export const styles = {
  [Style.Tactile]: {
    radiusControl: "9999px",
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
      light: "0 2px 6px rgba(0, 0, 0, 0.06), 0 18px 44px -10px rgba(0, 0, 0, 0.18)",
      dark: "0 0 0 1px rgba(255, 255, 255, 0.08), 0 20px 50px -10px rgba(0, 0, 0, 0.8)",
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
    focusRing: {
      light: "0 0 0 2px #ffffff, 0 0 0 4px var(--ring)",
      dark: "0 0 0 2px #000000, 0 0 0 4px var(--ring)",
    },
    surfaceBlur: "30px",
    surfaceSaturate: "180%",
    pressScale: "0.97",
    pressShift: "0px",
    headingWeight: "600",
    headingTracking: "-0.01em",
  },
} satisfies Record<Style, StyleTokens>;
