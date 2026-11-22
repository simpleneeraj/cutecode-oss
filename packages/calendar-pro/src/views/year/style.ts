import { tv } from "tailwind-variants";

import { HeatLevel } from "../../heat/aggregate";

const heatFills = {
  [HeatLevel.None]: "bg-heat-none",
  [HeatLevel.Low]: "bg-heat-low",
  [HeatLevel.Medium]: "bg-heat-medium",
  [HeatLevel.High]: "bg-heat-high",
  [HeatLevel.Peak]: "bg-heat-peak",
};

export const yearViewStyles = tv(
  {
    slots: {
      root: "@container flex min-w-0 flex-col gap-3.5",
      surface: "glass flex min-w-0 flex-col rounded-overlay shadow-glass",
      months: "grid grid-cols-2 gap-x-4.5 gap-y-5 px-4 py-2 @md:gap-x-8 @md:gap-y-7 @md:px-7 @md:pt-6 @md:pb-4 @3xl:grid-cols-3 @5xl:grid-cols-4",
      list: "relative my-2",
      item: "absolute inset-x-4 top-0 grid grid-cols-2 gap-x-4.5 pb-5",
      foot: "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 pb-4 text-footnote text-muted-foreground @md:px-7 @md:pb-5.5",
      readout: "font-semibold text-foreground tabular-nums",
    },
  },
  { twMerge: false },
);

export const yearMonthStyles = tv(
  {
    slots: {
      root: "flex min-w-0 flex-col gap-2",
      title: "font-semibold text-subheadline",
      grid: "flex flex-col gap-0.75 outline-none",
      header: "sr-only",
      row: "grid grid-cols-7 gap-0.75",
      blank: "aspect-square",
    },
    variants: {
      isCurrent: {
        true: { title: "text-brand-ink" },
        false: { title: "text-foreground" },
      },
    },
  },
  { twMerge: false },
);

export const heatCellStyles = tv(
  {
    base: "aspect-square cursor-pointer rounded-sm outline-none transition-shadow focus-visible:shadow-focus",
    variants: {
      level: heatFills,
      isToday: {
        true: "ring-2 ring-foreground ring-offset-1 ring-offset-card",
      },
    },
  },
  { twMerge: false },
);

export const heatLegendStyles = tv(
  {
    slots: {
      root: "flex items-center gap-1 text-caption1 text-muted-foreground",
      swatches: "flex items-center gap-1",
    },
  },
  { twMerge: false },
);

export const heatSwatchStyles = tv(
  {
    base: "size-3 rounded-xs",
    variants: {
      level: heatFills,
    },
  },
  { twMerge: false },
);
