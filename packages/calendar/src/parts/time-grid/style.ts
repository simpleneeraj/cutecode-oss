import { tv } from "tailwind-variants";

export const timeGridStyles = tv(
  {
    slots: {
      root: "relative flex min-w-0 flex-col outline-none",
      sticky: "glass sticky top-0 z-30 flex flex-col",
      headerRow: "flex border-foreground/8 border-b pt-3 pb-2",
      corner: "flex shrink-0 items-end justify-around pb-0.5 font-semibold text-caption2 text-muted-foreground",
      headers: "grid min-w-0 flex-1",
      bodyRow: "relative flex",
      columns: "relative grid min-w-0 flex-1",
      faintNow: "pointer-events-none absolute inset-x-0 top-0 z-10",
      busy: "absolute inset-0 z-20 flex",
      empty: "py-1 text-center text-footnote text-muted-foreground",
    },
    variants: {
      hasSecondaryZone: {
        true: { corner: "w-26" },
        false: { corner: "w-14 @max-md:w-11" },
      },
    },
  },
  { twMerge: false },
);

export const dayHeaderStyles = tv(
  {
    slots: {
      root: "flex min-w-0 justify-center",
      day: "relative flex min-w-0 flex-col items-center gap-0.5 rounded-field font-semibold text-caption2 text-muted-foreground uppercase tracking-wide outline-none focus-visible:shadow-focus",
      spokenLabel: "sr-only",
      weekdayLong: "@max-lg:hidden",
      weekdayShort: "@lg:hidden",
      number:
        "grid h-8 min-w-8 place-items-center rounded-full px-1 text-title3 normal-case tabular-nums tracking-tight",
    },
    variants: {
      isPressable: {
        true: { day: "hit-area press cursor-pointer" },
      },
      isToday: {
        true: { number: "bg-foreground font-semibold text-background" },
      },
      isSelected: {
        true: {},
      },
      isWeekend: {
        true: {},
      },
    },
    compoundVariants: [
      { isToday: false, isSelected: true, class: { number: "bg-brand-soft font-medium text-brand-ink" } },
      { isToday: false, isSelected: false, isWeekend: true, class: { number: "font-medium text-muted-foreground" } },
      { isToday: false, isSelected: false, isWeekend: false, class: { number: "font-medium text-foreground" } },
    ],
  },
  { twMerge: false },
);

export const allDayStyles = tv(
  {
    slots: {
      root: "flex min-h-8 border-foreground/8 border-b py-1.5",
      label: "flex shrink-0 items-center justify-end pe-2.5 text-caption2 text-muted-foreground",
      lanes: "grid min-w-0 flex-1 auto-rows-min gap-y-0.5",
      item: "flex min-w-0 flex-col",
    },
    variants: {
      hasSecondaryZone: {
        true: { label: "w-26" },
        false: { label: "w-14 @max-md:w-11" },
      },
    },
  },
  { twMerge: false },
);

export const spanBarStyles = tv(
  {
    slots: {
      root: "hit-area press relative mx-0.5 flex h-6 min-w-0 items-center gap-1.5 overflow-hidden rounded-field px-2.5 text-start font-semibold text-caption1 outline-none focus-visible:z-10 focus-visible:shadow-focus",
      title: "min-w-0 truncate",
      lock: "size-3 shrink-0 opacity-70",
      status: "shrink-0 font-normal opacity-80",
      arrow: "size-3.25 shrink-0 opacity-70 rtl:-scale-x-100",
      arrowEnd: "ms-auto size-3.25 shrink-0 opacity-70 rtl:-scale-x-100",
    },
    variants: {
      continuesBefore: {
        true: { root: "ms-0 rounded-s-xs" },
      },
      continuesAfter: {
        true: { root: "me-0 rounded-e-xs" },
      },
      isStruck: {
        true: { title: "line-through" },
      },
      isHatched: {
        true: { root: "hatch" },
      },
      isPast: {
        true: { root: "opacity-70" },
      },
      isReadOnly: {
        true: { root: "cursor-default" },
        false: { root: "cursor-pointer" },
      },
    },
  },
  { twMerge: false },
);

export const gutterStyles = tv(
  {
    slots: {
      root: "flex shrink-0",
      zone: "relative flex-1",
      label:
        "absolute end-2 flex -translate-y-1/2 flex-col items-end whitespace-nowrap text-caption2 text-muted-foreground leading-tight tabular-nums @max-md:end-1",
      now: "absolute end-1 z-10 -translate-y-1/2 whitespace-nowrap rounded-control bg-glass-solid px-1 font-semibold text-caption2 text-destructive tabular-nums",
    },
    variants: {
      hasSecondaryZone: {
        true: { root: "w-26" },
        false: { root: "w-14 @max-md:w-11" },
      },
      isSecondary: {
        true: { label: "opacity-60" },
      },
    },
  },
  { twMerge: false },
);

export const dayColumnStyles = tv(
  {
    slots: {
      root: "group hour-lines relative min-w-0 border-foreground/8 border-s outline-none",
      offHours: "pointer-events-none absolute inset-x-0 bg-foreground/3",
      missing: "hatch pointer-events-none absolute inset-x-0 text-foreground/40",
      gap: "hatch pointer-events-none absolute inset-x-0 h-1.5 -translate-y-1/2 rounded-control text-foreground",
      focusRing:
        "pointer-events-none absolute inset-x-0.5 z-30 hidden rounded-field shadow-focus group-focus-visible:block",
    },
    variants: {
      isWeekend: {
        true: { root: "bg-foreground/2.5" },
      },
    },
  },
  { twMerge: false },
);

export const overflowStyles = tv(
  {
    slots: {
      trigger:
        "hit-area press absolute end-0.5 z-10 grid h-7.5 w-6.5 cursor-pointer place-items-center rounded-field bg-tone-ink font-bold text-caption1 text-foreground tabular-nums outline-none focus-visible:shadow-focus",
      popup: "w-72",
      list: "flex flex-col gap-1 pt-2",
      item: "press flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-field px-2 text-start outline-none hover:bg-muted focus-visible:shadow-focus",
      dot: "size-2 shrink-0 rounded-full",
      text: "flex min-w-0 flex-col",
      title: "truncate font-semibold text-subheadline",
      time: "truncate text-footnote text-muted-foreground tabular-nums",
    },
  },
  { twMerge: false },
);

export const foldPillStyles = tv(
  {
    slots: {
      row: "flex",
      cell: "flex min-w-0 flex-1 justify-center",
      pill: "hit-area press relative mx-2 my-1 flex h-6.5 w-full cursor-pointer items-center justify-center gap-1.5 rounded-control bg-foreground/5 font-semibold text-caption1 text-muted-foreground outline-none hover:bg-foreground/8 focus-visible:shadow-focus",
      icon: "size-3.5",
    },
  },
  { twMerge: false },
);
