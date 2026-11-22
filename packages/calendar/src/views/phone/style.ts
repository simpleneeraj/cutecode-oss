import { tv } from "tailwind-variants";

export const phoneStyles = tv(
  {
    slots: {
      root: "@container relative flex min-h-dvh min-w-0 flex-col bg-background text-foreground",
      header: "sticky top-0 z-40 flex flex-col gap-2.5 bg-background px-4 pt-safe-compact pb-2.5",
      headingRow: "flex min-w-0 items-center gap-3",
      heading: "flex min-w-0 flex-1 flex-col",
      controls: "flex items-center justify-between gap-2",
      arrow: "rtl:-scale-x-100",
      overview: "relative flex min-h-dvh min-w-0 flex-col gap-3 bg-background px-4 pt-safe-compact text-foreground",
      title: "truncate font-bold font-heading text-3xl tracking-tight",
      subtitle: "truncate text-muted-foreground text-subheadline tabular-nums",
      banners: "flex flex-col gap-2 px-4 pb-2",
      body: "flex min-w-0 flex-1 flex-col pe-3",
      empty: "py-2 text-center text-footnote text-muted-foreground",
      footer: "pointer-events-none sticky bottom-0 z-40 flex flex-col items-end gap-3 px-4 pb-safe",
      tabs: "pointer-events-auto self-center",
    },
  },
  { twMerge: false },
);

export const landscapeStyles = tv(
  {
    slots: {
      root: "relative flex min-h-dvh min-w-0 flex-col gap-2 bg-background px-safe pt-2 text-foreground",
      footer: "pointer-events-none sticky bottom-0 z-40 flex justify-end pb-safe",
    },
  },
  { twMerge: false },
);

export const swipeStyles = tv(
  {
    slots: {
      root: "flex min-w-0 touch-pan-y flex-col",
    },
  },
  { twMerge: false },
);

export const addButtonStyles = tv(
  {
    slots: {
      root: "pointer-events-auto rounded-full shadow-raised",
      icon: "size-6.5",
    },
  },
  { twMerge: false },
);

export const dayStripStyles = tv(
  {
    slots: {
      root: "glass grid grid-cols-7 gap-0.5 rounded-surface p-1 shadow-glass",
      day: "hit-area press relative flex min-h-14 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-field font-semibold text-caption2 text-muted-foreground outline-none focus-visible:shadow-focus aria-pressed:bg-card aria-pressed:text-foreground aria-pressed:shadow-thumb",
      number: "grid size-7.5 place-items-center rounded-full font-medium text-body text-foreground tabular-nums",
      spoken: "sr-only",
    },
    variants: {
      isToday: {
        true: { number: "bg-foreground font-semibold text-background" },
      },
    },
  },
  { twMerge: false },
);

export const timelineStyles = tv(
  {
    slots: {
      root: "relative flex min-w-0 flex-col outline-none",
      pinch: "flex min-w-0 flex-col",
      allDay: "flex min-w-0 gap-1.5 overflow-x-auto px-4 pb-2",
    },
  },
  { twMerge: false },
);
