export enum Density {
  Regular = "regular",
  Compact = "compact",
}

export type DensityTokens = {
  controlHeightSmall: string;
  controlHeightMedium: string;
  controlHeightLarge: string;
  fieldHeight: string;
  rowHeight: string;
  controlInsetSmall: string;
  controlInsetMedium: string;
  controlInsetLarge: string;
  rowInset: string;
  radiusStep: string;
  bodySize: string;
  bodyLeading: string;
  bodyTracking: string;
  calloutSize: string;
  calloutLeading: string;
  calloutTracking: string;
  subheadlineSize: string;
  subheadlineLeading: string;
  subheadlineTracking: string;
  footnoteSize: string;
  footnoteLeading: string;
  footnoteTracking: string;
  captionSize: string;
  captionLeading: string;
  captionTracking: string;
};

export const densities = {
  [Density.Regular]: {
    controlHeightSmall: "2.125rem",
    controlHeightMedium: "2.75rem",
    controlHeightLarge: "3.125rem",
    fieldHeight: "2.75rem",
    rowHeight: "2.75rem",
    controlInsetSmall: "0.875rem",
    controlInsetMedium: "1.25rem",
    controlInsetLarge: "1.5rem",
    rowInset: "0.875rem",
    radiusStep: "0px",
    bodySize: "1.0625rem",
    bodyLeading: "1.375rem",
    bodyTracking: "-0.024em",
    calloutSize: "1rem",
    calloutLeading: "1.3125rem",
    calloutTracking: "-0.02em",
    subheadlineSize: "0.9375rem",
    subheadlineLeading: "1.25rem",
    subheadlineTracking: "-0.014em",
    footnoteSize: "0.8125rem",
    footnoteLeading: "1.125rem",
    footnoteTracking: "-0.004em",
    captionSize: "0.75rem",
    captionLeading: "1rem",
    captionTracking: "0em",
  },
  [Density.Compact]: {
    controlHeightSmall: "1.75rem",
    controlHeightMedium: "2rem",
    controlHeightLarge: "2.25rem",
    fieldHeight: "2rem",
    rowHeight: "2.25rem",
    controlInsetSmall: "0.625rem",
    controlInsetMedium: "0.875rem",
    controlInsetLarge: "1rem",
    rowInset: "0.625rem",
    radiusStep: "4px",
    bodySize: "0.9375rem",
    bodyLeading: "1.25rem",
    bodyTracking: "-0.014em",
    calloutSize: "0.875rem",
    calloutLeading: "1.1875rem",
    calloutTracking: "-0.01em",
    subheadlineSize: "0.8125rem",
    subheadlineLeading: "1.125rem",
    subheadlineTracking: "-0.004em",
    footnoteSize: "0.75rem",
    footnoteLeading: "1rem",
    footnoteTracking: "0em",
    captionSize: "0.6875rem",
    captionLeading: "0.8125rem",
    captionTracking: "0.01em",
  },
} satisfies Record<Density, DensityTokens>;
