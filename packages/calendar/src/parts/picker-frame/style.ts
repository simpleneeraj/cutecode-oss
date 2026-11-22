import { tv } from "tailwind-variants";

import { FrameTone, RangeBand } from "./choices";

export const pickerFrameStyles = tv(
  {
    slots: {
      root: "flex w-full max-w-85 flex-col rounded-overlay px-1.5 pb-1.5 shadow-raised",
      header: "flex h-11 items-center justify-between px-3 font-semibold text-subheadline",
      headerIcon: "size-4.5",
      body: "flex flex-col gap-2.5 rounded-surface bg-card p-3 text-foreground",
      footer: "flex items-center gap-2",
      summary: "min-w-0 flex-1 text-footnote text-muted-foreground",
    },
    variants: {
      tone: {
        [FrameTone.Accent]: { root: "bg-brand", header: "text-on-fill" },
        [FrameTone.Neutral]: { root: "bg-tone-grey", header: "text-foreground" },
      },
      isInvalid: {
        true: { summary: "text-destructive-foreground" },
      },
    },
  },
  { twMerge: false },
);

export const monthNavStyles = tv(
  {
    slots: {
      root: "flex items-center justify-between gap-1.5",
      selects: "flex gap-1.5",
      trigger: "w-auto min-w-0 rounded-control bg-secondary font-semibold text-footnote inset-ring-0",
      arrow: "rtl:-scale-x-100",
    },
  },
  { twMerge: false },
);

export const dayGridStyles = tv(
  {
    slots: {
      root: "flex flex-col gap-0.5 outline-none",
      row: "grid grid-cols-7 text-center",
      weekday: "font-semibold text-caption2 text-muted-foreground leading-5",
      spoken: "sr-only",
      cell: "relative grid h-11 place-items-center",
      out: "relative grid h-11 place-items-center text-foreground/28 text-subheadline tabular-nums",
      day: "relative z-1 grid h-11 w-full cursor-pointer place-items-center rounded-full outline-none focus-visible:shadow-focus aria-disabled:cursor-default",
      number:
        "grid size-9 place-items-center rounded-full font-medium text-subheadline tabular-nums transition-colors duration-color",
    },
    variants: {
      band: {
        [RangeBand.None]: {},
        [RangeBand.Start]: {
          cell: "before:absolute before:inset-y-0.5 before:start-1/2 before:end-0 before:bg-brand-soft",
        },
        [RangeBand.Middle]: {
          cell: "before:absolute before:inset-x-0 before:inset-y-0.5 before:bg-brand-soft",
          number: "text-brand-ink",
        },
        [RangeBand.End]: {
          cell: "before:absolute before:inset-y-0.5 before:start-0 before:end-1/2 before:bg-brand-soft",
        },
      },
      isToday: {
        true: {},
      },
      isEndpoint: {
        true: { number: "bg-brand font-semibold text-on-fill" },
      },
      isDisabled: {
        true: { number: "text-foreground/22 line-through" },
      },
    },
    compoundVariants: [{ isToday: true, isEndpoint: false, class: { number: "inset-ring-2 inset-ring-foreground" } }],
  },
  { twMerge: false },
);
