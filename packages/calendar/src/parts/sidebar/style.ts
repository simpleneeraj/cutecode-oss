import { tv } from "tailwind-variants";

export const sidebarStyles = tv(
  {
    slots: {
      root: "relative flex min-w-0 flex-col gap-4.5",
      search: "relative flex items-center gap-1.5",
      field: "min-w-0 flex-1",
      upNext: "glass flex flex-col gap-1 rounded-surface p-3 shadow-glass",
      upNextLabel: "flex items-center gap-1.5 font-semibold text-caption1 text-muted-foreground",
      upNextIcon: "size-3.5",
      upNextTitle: "truncate font-semibold text-footnote text-foreground",
      upNextDetail: "truncate text-footnote text-muted-foreground",
    },
  },
  { twMerge: false },
);

export const resultsStyles = tv(
  {
    slots: {
      root: "flex flex-col gap-0.5",
      heading: "px-1.5 pt-1 pb-1 font-semibold text-caption1 text-muted-foreground",
      item: "press flex min-h-11 w-full min-w-0 cursor-pointer items-center gap-2.5 rounded-field px-2 text-start outline-none hover:bg-foreground/5 focus-visible:shadow-focus",
      dot: "size-2 shrink-0 rounded-full",
      text: "flex min-w-0 flex-col",
      title: "truncate font-semibold text-subheadline",
      when: "truncate text-footnote text-muted-foreground tabular-nums",
      empty: "px-1.5 py-3 text-footnote text-muted-foreground",
    },
  },
  { twMerge: false },
);

export const miniMonthStyles = tv(
  {
    slots: {
      root: "flex flex-col gap-2",
      head: "flex items-center justify-between ps-1",
      title: "font-semibold text-subheadline",
      steps: "flex gap-0.5",
      arrow: "rtl:-scale-x-100",
      grid: "grid grid-cols-7 gap-y-0.5 text-center",
      weekday: "pb-1 font-semibold text-caption2 text-muted-foreground",
      day: "relative grid h-8 cursor-pointer place-items-center outline-none focus-visible:z-1 focus-visible:shadow-focus pointer-coarse:h-11",
      number: "grid size-6.5 place-items-center rounded-full font-medium text-caption1 tabular-nums",
      busy: "absolute bottom-0.5 size-0.75 rounded-full bg-foreground/35",
    },
    variants: {
      inMonth: {
        false: { number: "text-foreground/30" },
      },
      inBand: {
        true: { day: "bg-foreground/6" },
        false: { day: "rounded-full" },
      },
      isBandStart: {
        true: { day: "rounded-s-full" },
      },
      isBandEnd: {
        true: { day: "rounded-e-full" },
      },
      isSelected: {
        true: {},
      },
      isToday: {
        true: { number: "bg-foreground font-semibold text-background" },
      },
    },
    compoundVariants: [{ isToday: false, isSelected: true, class: { number: "bg-brand-soft text-brand-ink" } }],
  },
  { twMerge: false },
);

export const togglesStyles = tv(
  {
    slots: {
      root: "flex flex-col gap-0.5",
      heading: "px-1.5 pt-2 pb-1 font-semibold text-caption1 text-muted-foreground",
      row: "flex min-h-11 w-full min-w-0 cursor-pointer items-center gap-2.5 rounded-field px-2 font-normal hover:bg-foreground/5",
      swatch: "size-2.5 shrink-0 rounded-full",
      name: "min-w-0 flex-1 truncate text-subheadline",
      lock: "size-3.75 shrink-0 text-muted-foreground",
      spoken: "sr-only",
    },
    variants: {
      isHidden: {
        true: { name: "text-muted-foreground", swatch: "opacity-40" },
      },
    },
  },
  { twMerge: false },
);
