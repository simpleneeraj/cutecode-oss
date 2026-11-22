import { tv } from "tailwind-variants";

export const moneyStyles = tv(
  {
    slots: {
      root: "flex w-full min-w-0 max-w-105 flex-col gap-3.5 rounded-overlay bg-card p-4 text-foreground shadow-raised edge",
      nav: "flex min-h-8.5 items-center gap-2",
      month: "flex-1 text-center font-semibold text-title3",
      arrow: "size-4.5 rtl:-scale-x-100",
      totals: "flex items-start justify-between gap-2",
      total: "flex flex-col",
      totalEnd: "flex flex-col text-end",
      totalLabel: "text-footnote text-muted-foreground",
      totalValue: "font-semibold text-2xl tracking-tight tabular-nums",
      filters: "-mx-4 flex gap-1.5 overflow-x-auto px-4",
      chip: "hit-area press flex min-h-8.5 shrink-0 items-center rounded-full bg-foreground/5 px-3 font-semibold text-footnote text-muted-foreground outline-none focus-visible:shadow-focus aria-pressed:bg-foreground aria-pressed:text-background",
      grid: "flex flex-col gap-1.25 outline-none",
      row: "grid grid-cols-7 gap-1.25",
      weekday: "text-center font-semibold text-caption2 text-muted-foreground tracking-wide",
      dayTitle: "font-semibold text-body",
      list: "flex flex-col",
      spoken: "sr-only",
    },
  },
  { twMerge: false },
);

export const moneyDayStyles = tv(
  {
    slots: {
      root: "hit-area press relative flex min-h-14.5 flex-col items-center gap-1 rounded-xl pt-1.5 font-semibold text-subheadline tabular-nums outline-none transition-colors focus-visible:shadow-focus",
      glyph: "grid size-5.5 place-items-center rounded-md",
      glyphIcon: "size-3.25",
      more: "absolute end-1 bottom-1 font-bold text-caption2 text-muted-foreground",
    },
    variants: {
      inMonth: {
        true: { root: "cursor-pointer bg-foreground/4" },
        false: { root: "text-foreground/28" },
      },
      today: {
        true: { root: "ring-2 ring-foreground ring-inset" },
      },
      selected: {
        true: {
          root: "bg-brand-soft text-brand-ink ring-2 ring-brand ring-inset",
          glyph: "bg-brand text-on-fill",
        },
        false: {
          glyph: "bg-linear-to-b from-icon-top to-icon-bottom text-foreground shadow-press ring-1 ring-border",
        },
      },
    },
  },
  { twMerge: false },
);

export const paymentRowStyles = tv(
  {
    slots: {
      root: "flex min-h-13 items-center gap-3 px-1 py-1.5 text-body",
      glyph:
        "grid size-7.5 shrink-0 place-items-center rounded-lg bg-linear-to-b from-icon-top to-icon-bottom text-foreground shadow-icon",
      glyphIcon: "size-4.25",
      text: "flex min-w-0 flex-1 flex-col",
      title: "truncate",
      detail: "truncate text-footnote text-muted-foreground",
      amount: "font-semibold tabular-nums",
      empty: "flex flex-col items-center gap-1 rounded-2xl bg-foreground/4 px-4 py-5.5 text-center",
      emptyTitle: "font-semibold text-subheadline",
      emptyText: "text-footnote text-muted-foreground",
    },
  },
  { twMerge: false },
);

export const moneyExampleStyles = tv(
  {
    slots: {
      root: "flex min-w-0 flex-col gap-4 p-4",
      stage: "wallpaper flex min-w-0 justify-center rounded-overlay p-4 sm:p-7",
    },
  },
  { twMerge: false },
);
