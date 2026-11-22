import { tv } from "tailwind-variants";

import { WeekStripLook } from "./model";

export const weekStripStyles = tv(
  {
    slots: {
      root: "flex w-full flex-col outline-none",
      head: "hidden",
      row: "grid grid-cols-7 gap-0.5",
      weekday: "",
      cell: "relative flex",
      day: "relative isolate flex cursor-pointer flex-col items-center justify-center gap-0.5 outline-none focus-visible:shadow-focus aria-disabled:cursor-default aria-disabled:opacity-35",
      thumb: "absolute inset-0 -z-10",
      label: "font-semibold text-caption2",
      number: "relative grid place-items-center font-medium tabular-nums transition-colors duration-fade",
      spoken: "sr-only",
    },
    variants: {
      look: {
        [WeekStripLook.Soft]: {
          root: "rounded-surface bg-foreground/5 p-1",
          day: "min-h-14 flex-1 rounded-2xl",
          number: "text-body",
          thumb: "rounded-2xl bg-card shadow-thumb",
        },
        [WeekStripLook.Island]: {
          root: "gap-2 rounded-overlay bg-island px-3.5 py-3 text-island-ink shadow-raised",
          head: "flex items-center justify-between px-1.5 text-footnote text-island-ink/60",
          weekday: "text-center text-caption1 text-island-ink/70",
          cell: "justify-center",
          day: "size-9 rounded-full pointer-coarse:size-11",
          label: "sr-only",
          number: "text-subheadline",
          thumb: "rounded-full bg-island-ink",
        },
      },
      isSelected: {
        true: {},
      },
      isWeekend: {
        true: {},
      },
    },
    compoundVariants: [
      {
        look: WeekStripLook.Soft,
        isSelected: true,
        class: { label: "text-foreground", number: "font-semibold text-foreground" },
      },
      { look: WeekStripLook.Soft, isSelected: false, class: { label: "text-muted-foreground" } },
      { look: WeekStripLook.Soft, isSelected: false, isWeekend: false, class: { number: "text-foreground" } },
      { look: WeekStripLook.Soft, isSelected: false, isWeekend: true, class: { number: "text-muted-foreground" } },
      { look: WeekStripLook.Island, isSelected: true, class: { number: "font-bold text-island" } },
      { look: WeekStripLook.Island, isSelected: false, isWeekend: true, class: { number: "text-island-ink/45" } },
    ],
  },
  { twMerge: false },
);

export const islandPillStyles = tv(
  {
    slots: {
      root: "flex h-9.5 w-full max-w-65 items-center gap-2 rounded-full bg-island ps-3.5 pe-2 font-semibold text-footnote text-island-ink shadow-raised",
      weekday: "shrink-0",
      text: "flex min-w-0 flex-1 items-baseline gap-1.5 text-island-ink/70",
      title: "truncate",
      when: "shrink-0 font-medium text-caption1 text-island-ink/60",
      badge:
        "grid h-5.5 min-w-6 shrink-0 place-items-center rounded-full bg-island-ink px-1.5 text-caption1 text-island tabular-nums",
    },
  },
  { twMerge: false },
);
