import { tv } from "tailwind-variants";

import { EventTone } from "./constants";

export const eventRows = {
  start: [
    "row-start-1",
    "row-start-2",
    "row-start-3",
    "row-start-4",
    "row-start-5",
    "row-start-6",
    "row-start-7",
    "row-start-8",
    "row-start-9",
    "row-start-10",
  ],
  span: ["row-span-1", "row-span-2", "row-span-3"],
};

export const calendarEventStyles = tv(
  {
    base: "col-start-1 m-0.5 flex min-w-0 flex-col overflow-hidden rounded-field border-l-3 px-2 py-1 text-caption1",
    variants: {
      tone: {
        [EventTone.Accent]: "border-brand bg-brand-soft text-brand-ink",
        [EventTone.Neutral]: "border-foreground/28 bg-foreground/6 text-foreground",
      },
      isLifted: {
        true: "relative z-10 -rotate-2 shadow-raised",
      },
    },
  },
  { twMerge: false },
);

export const calendarMockStyles = tv(
  {
    slots: {
      shell: "wallpaper w-full rounded-overlay squircle p-3 md:p-5",
      calendar: "glass flex flex-col gap-4 rounded-surface squircle edge p-3 text-foreground shadow-glass md:p-4",
      bar: "flex items-center justify-between gap-3",
      month: "font-heading font-semibold text-title3",
      year: "font-normal text-muted-foreground",
      views: "flex rounded-control bg-secondary p-0.5",
      view: "flex h-7 items-center rounded-control px-3 font-semibold text-footnote text-muted-foreground",
      viewCurrent:
        "flex h-7 items-center rounded-control bg-segment-thumb px-3 font-semibold text-footnote text-foreground shadow-thumb",
      week: "hidden flex-col gap-2 md:flex",
      weekHead: "flex",
      spacer: "w-12 shrink-0",
      heads: "grid flex-1 grid-cols-5",
      head: "flex flex-col items-center gap-1 font-semibold text-caption2 text-muted-foreground uppercase tracking-wider",
      date: "grid size-8 place-items-center rounded-full text-body text-foreground normal-case tracking-normal",
      dateToday:
        "grid size-8 place-items-center rounded-full bg-foreground text-background text-body normal-case tracking-normal",
      grid: "flex",
      hours: "grid h-72 w-12 shrink-0 grid-rows-10 text-caption2 text-muted-foreground",
      hour: "row-span-2 -mt-1.5",
      columns: "grid flex-1 grid-cols-5",
      column: "grid h-72 grid-rows-10 border-border border-l",
      eventTitle: "truncate font-semibold",
      eventTime: "truncate opacity-80",
      now: "relative z-20 col-start-1 row-start-5 h-0.5 self-center bg-destructive",
      day: "flex flex-col gap-3 md:hidden",
      strip: "-mx-1 flex gap-1 overflow-x-auto overscroll-x-contain px-1",
      stripDay:
        "flex w-11 shrink-0 flex-col items-center gap-0.5 rounded-field py-1.5 font-semibold text-caption2 text-muted-foreground uppercase",
      stripToday:
        "flex w-11 shrink-0 flex-col items-center gap-0.5 rounded-field bg-foreground py-1.5 font-semibold text-background text-caption2 uppercase",
      stripDate: "text-body normal-case",
      dayColumns: "grid flex-1 grid-cols-1",
    },
  },
  { twMerge: false },
);
