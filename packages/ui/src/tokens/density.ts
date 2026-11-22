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
    controlHeightSmall: "2rem",
    controlHeightMedium: "2.25rem",
    controlHeightLarge: "2.5rem",
    fieldHeight: "2.125rem",
    rowHeight: "2rem",
    controlInsetSmall: "0.625rem",
    controlInsetMedium: "0.75rem",
    controlInsetLarge: "0.875rem",
    rowInset: "0.5rem",
    radiusStep: "0px",
    bodySize: "1rem",
    bodyLeading: "1.5rem",
    bodyTracking: "-0.011em",
    calloutSize: "0.9375rem",
    calloutLeading: "1.375rem",
    calloutTracking: "-0.009em",
    subheadlineSize: "0.875rem",
    subheadlineLeading: "1.25rem",
    subheadlineTracking: "-0.006em",
    footnoteSize: "0.8125rem",
    footnoteLeading: "1.125rem",
    footnoteTracking: "-0.003em",
    captionSize: "0.75rem",
    captionLeading: "1rem",
    captionTracking: "0em",
  },
  [Density.Compact]: {
    controlHeightSmall: "1.75rem",
    controlHeightMedium: "2rem",
    controlHeightLarge: "2.25rem",
    fieldHeight: "1.875rem",
    rowHeight: "1.75rem",
    controlInsetSmall: "0.5625rem",
    controlInsetMedium: "0.6875rem",
    controlInsetLarge: "0.8125rem",
    rowInset: "0.5rem",
    radiusStep: "0px",
    bodySize: "0.875rem",
    bodyLeading: "1.25rem",
    bodyTracking: "-0.006em",
    calloutSize: "0.8125rem",
    calloutLeading: "1.125rem",
    calloutTracking: "-0.003em",
    subheadlineSize: "0.8125rem",
    subheadlineLeading: "1.125rem",
    subheadlineTracking: "-0.003em",
    footnoteSize: "0.75rem",
    footnoteLeading: "1rem",
    footnoteTracking: "0em",
    captionSize: "0.6875rem",
    captionLeading: "0.875rem",
    captionTracking: "0.01em",
  },
} satisfies Record<Density, DensityTokens>;
