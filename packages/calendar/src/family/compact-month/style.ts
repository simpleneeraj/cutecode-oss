import { tv } from "tailwind-variants";

import { TileKind } from "./model";

export const compactMonthStyles = tv(
  {
    slots: {
      root: "relative flex w-full max-w-105 flex-col gap-3.5 rounded-overlay bg-card p-4 text-foreground shadow-raised edge",
      head: "flex min-h-8.5 items-center gap-2",
      title: "me-auto font-semibold text-title3",
      steps: "flex gap-0.5",
      arrow: "rtl:-scale-x-100",
      toggleIcon: "size-4.5",
      body: "relative min-h-50",
      empty: "glass absolute inset-0 z-10 grid place-items-center rounded-surface shadow-glass",
    },
  },
  { twMerge: false },
);

export const filterChipStyles = tv(
  {
    slots: {
      strip: "-mx-4 flex gap-1.5 overflow-x-auto px-4",
      chip: "press hit-area flex min-h-8.5 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 font-semibold text-footnote outline-none transition-colors duration-color focus-visible:shadow-focus",
      count: "rounded-full px-1.5 font-semibold text-caption1 tabular-nums",
      skeleton: "h-8.5 w-20 shrink-0 rounded-full",
    },
    variants: {
      isPressed: {
        true: { chip: "bg-foreground text-background", count: "bg-background/22 text-background" },
        false: { chip: "bg-foreground/5 text-muted-foreground", count: "bg-card text-muted-foreground" },
      },
    },
  },
  { twMerge: false },
);

export const tileGridStyles = tv(
  {
    slots: {
      root: "flex flex-col gap-1 outline-none sm:gap-1.5",
      row: "grid grid-cols-7 gap-1 sm:gap-1.5",
      weekday: "pb-0.5 text-center font-semibold text-caption2 text-muted-foreground uppercase tracking-wide",
      spoken: "sr-only",
      cell: "flex min-w-0",
      tile: "relative flex min-h-13 w-full min-w-0 flex-col items-start gap-0.5 overflow-hidden rounded-xl p-1.5 text-start font-semibold text-footnote tabular-nums outline-none transition-colors duration-color focus-visible:shadow-focus",
      lines: "flex w-full flex-col gap-0.5",
      line: "block h-0.75 rounded-full first:w-full nth-2:w-7/10 nth-3:w-9/20",
      skeleton: "h-2.5 w-3.5 rounded-sm",
    },
    variants: {
      kind: {
        [TileKind.Outside]: { tile: "text-foreground/28" },
        [TileKind.Free]: { tile: "cursor-pointer bg-foreground/4" },
        [TileKind.Busy]: { tile: "cursor-pointer bg-foreground/9" },
        [TileKind.Selected]: {
          tile: "cursor-pointer bg-foreground text-background shadow-rest",
          line: "bg-background/60",
        },
      },
      isAccent: {
        true: {},
      },
      isToday: {
        true: {},
      },
    },
    compoundVariants: [
      { kind: TileKind.Busy, isToday: false, class: { tile: "inset-ring-1 inset-ring-foreground/10" } },
      { kind: TileKind.Busy, isAccent: true, class: { line: "bg-brand" } },
      { kind: TileKind.Busy, isAccent: false, class: { line: "bg-foreground/28" } },
      { kind: [TileKind.Free, TileKind.Busy], isToday: true, class: { tile: "inset-ring-2 inset-ring-foreground" } },
    ],
  },
  { twMerge: false },
);

export const monthListStyles = tv(
  {
    slots: {
      root: "flex flex-col gap-1",
      day: "press flex min-h-11 w-full cursor-pointer gap-3 rounded-surface px-2 py-2 text-start outline-none transition-colors duration-color hover:bg-foreground/4 focus-visible:shadow-focus aria-pressed:bg-foreground/6",
      date: "flex w-9 shrink-0 flex-col items-center",
      weekday: "font-semibold text-caption2 text-muted-foreground uppercase",
      number: "font-semibold text-body tabular-nums",
      spoken: "sr-only",
      events: "flex min-w-0 flex-1 flex-col gap-1.5 py-0.5",
      event: "flex min-w-0 items-center gap-2",
      bar: "h-7 w-0.75 shrink-0 rounded-full",
      text: "flex min-w-0 flex-col",
      title: "truncate font-semibold text-footnote",
      when: "truncate text-caption1 text-muted-foreground tabular-nums",
    },
  },
  { twMerge: false },
);
