import { tv } from "tailwind-variants";

import { TaskStatus } from "./task";

export const taskAgendaStyles = tv(
  {
    slots: {
      root: "relative flex w-full min-w-0 max-w-100 flex-col gap-3.5 rounded-overlay bg-card p-4 text-foreground shadow-raised edge",
      head: "flex min-h-8.5 flex-col",
      date: "text-footnote text-muted-foreground",
      title: "font-semibold text-2xl tracking-tight",
      filter: "w-full",
      filterItem: "flex-1",
      body: "flex min-h-0 flex-col gap-1",
      skeletons: "flex flex-col gap-3.5 py-1",
      skeleton: "h-4.5 rounded-lg bg-foreground/7 first:w-4/5 nth-2:w-3/5 nth-3:w-7/10",
      spoken: "sr-only",
      empty: "flex flex-col items-center gap-1 rounded-2xl bg-foreground/4 px-4 py-5.5 text-center",
      emptyTitle: "font-semibold text-subheadline",
      emptyText: "text-footnote text-muted-foreground",
    },
  },
  { twMerge: false },
);

export const weekStripStyles = tv(
  {
    slots: {
      root: "rounded-3xl bg-foreground/5 p-1",
      row: "grid grid-cols-7 gap-0.5",
      day: "hit-area press relative isolate flex min-h-14 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-2xl font-semibold text-caption2 text-muted-foreground outline-none focus-visible:shadow-focus aria-selected:text-foreground",
      thumb: "-z-10 absolute inset-0 rounded-2xl bg-card shadow-thumb",
      number: "font-medium text-body tabular-nums",
    },
    variants: {
      isWeekend: {
        true: { number: "text-muted-foreground" },
        false: { number: "text-foreground" },
      },
      isSelected: {
        true: { number: "font-semibold text-foreground" },
      },
    },
  },
  { twMerge: false },
);

export const taskGroupStyles = tv(
  {
    slots: {
      root: "flex flex-col",
      toggle:
        "hit-area press flex min-h-10 items-center gap-1.5 rounded-field text-start font-semibold text-body outline-none focus-visible:shadow-focus",
      chevron: "size-4 shrink-0",
      count: "font-medium text-footnote text-muted-foreground tabular-nums",
      list: "flex flex-col overflow-hidden",
    },
  },
  { twMerge: false },
);

export const taskRowStyles = tv(
  {
    slots: {
      root: "press flex min-h-11 w-full items-center gap-3 rounded-field ps-5.5 pe-1 text-start text-body outline-none focus-visible:shadow-focus",
      box: "grid size-5.5 shrink-0 place-items-center rounded-md ring-2 ring-foreground/20 ring-inset transition-colors",
      check: "size-3.5",
      title: "min-w-0 flex-1 truncate",
      time: "text-footnote text-muted-foreground tabular-nums",
      glyph:
        "grid size-6.5 shrink-0 place-items-center rounded-lg bg-linear-to-b from-icon-top to-icon-bottom text-foreground shadow-icon",
      glyphIcon: "size-3.75",
      spoken: "sr-only",
    },
    variants: {
      status: {
        [TaskStatus.Todo]: {},
        [TaskStatus.Done]: { box: "bg-foreground text-background ring-0", title: "text-muted-foreground line-through" },
        [TaskStatus.Pending]: { box: "border-2 border-foreground/26 border-dashed ring-0" },
      },
    },
  },
  { twMerge: false },
);

export const agendaBarStyles = tv(
  {
    slots: {
      root: "flex items-center gap-2.5",
      add: "ms-auto size-13.5 shrink-0 rounded-full shadow-raised",
      addIcon: "size-6.5",
    },
  },
  { twMerge: false },
);

export const taskExampleStyles = tv(
  {
    slots: {
      root: "flex min-w-0 flex-col gap-4 p-4",
      stage: "wallpaper flex min-w-0 justify-center rounded-overlay p-4 sm:p-7",
    },
  },
  { twMerge: false },
);
