import { tv } from "tailwind-variants";

import { HeatLevel } from "../../heat/aggregate";

const heatFills = {
  [HeatLevel.None]: "bg-heat-none",
  [HeatLevel.Low]: "bg-heat-low",
  [HeatLevel.Medium]: "bg-heat-medium",
  [HeatLevel.High]: "bg-heat-high",
  [HeatLevel.Peak]: "bg-heat-peak",
};

export const heatMonthStyles = tv(
  {
    slots: {
      root: "flex w-full min-w-0 max-w-105 flex-col gap-3.5 rounded-overlay bg-card p-4 text-foreground shadow-raised edge",
      head: "flex min-h-8.5 items-center gap-2",
      summary: "me-auto flex flex-col",
      summaryLabel: "text-footnote text-muted-foreground",
      summaryValue: "font-semibold text-2xl tracking-tight tabular-nums",
      summarySkeleton: "h-7 w-24 rounded-lg bg-foreground/7",
      steps: "flex gap-1",
      arrow: "size-4.5 rtl:-scale-x-100",
      grid: "flex flex-col gap-1.5 outline-none",
      row: "grid grid-cols-7 gap-1.5",
      weekday: "text-center font-semibold text-caption2 text-muted-foreground tracking-wide",
      skeleton: "min-h-12 rounded-xl bg-foreground/7",
      outside: "flex min-h-12 items-end justify-center p-1 font-medium text-caption1 text-foreground/28 tabular-nums",
      foot: "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-footnote text-muted-foreground",
      legend: "flex items-center gap-1 text-caption1",
      swatches: "flex items-center gap-1",
      spoken: "sr-only",
    },
  },
  { twMerge: false },
);

export const heatTileStyles = tv(
  {
    slots: {
      root: "hit-area press relative flex min-h-12 cursor-pointer flex-col items-center justify-end rounded-xl p-1 font-semibold outline-none transition-colors focus-visible:shadow-focus",
      badge:
        "absolute inset-x-0 top-0.75 mx-auto h-4.25 w-fit min-w-5.5 rounded-md px-1.25 text-center font-bold text-caption2 leading-4.25 tabular-nums",
      number: "font-medium text-caption1 tabular-nums",
    },
    variants: {
      level: {
        [HeatLevel.None]: { root: heatFills[HeatLevel.None] },
        [HeatLevel.Low]: { root: heatFills[HeatLevel.Low] },
        [HeatLevel.Medium]: { root: heatFills[HeatLevel.Medium] },
        [HeatLevel.High]: { root: heatFills[HeatLevel.High] },
        [HeatLevel.Peak]: { root: heatFills[HeatLevel.Peak] },
      },
      today: {
        true: { root: "ring-2 ring-foreground ring-inset" },
      },
      selected: {
        true: { root: "bg-foreground shadow-rest", badge: "bg-brand text-on-fill", number: "text-background" },
        false: { badge: "bg-card text-brand-ink shadow-rest", number: "text-muted-foreground" },
      },
    },
    compoundVariants: [{ level: [HeatLevel.High, HeatLevel.Peak], selected: false, class: { number: "text-on-fill" } }],
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

export const heatExampleStyles = tv(
  {
    slots: {
      root: "flex min-w-0 flex-col gap-4 p-4",
      controls: "-mx-4 flex gap-2 overflow-x-auto px-4",
      stage: "wallpaper flex min-w-0 justify-center rounded-overlay p-4 sm:p-7",
    },
  },
  { twMerge: false },
);
