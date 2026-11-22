import { tv } from "tailwind-variants";

export const agendaListStyles = tv(
  {
    slots: {
      scroller: "relative h-160 max-h-dvh overflow-y-auto overscroll-contain outline-none focus-visible:shadow-focus",
      track: "relative w-full",
      slot: "inset-x-0 top-0",
      rowInset: "flex px-3",
      empty: "flex min-h-96 flex-col justify-center",
    },
    variants: {
      isSticky: {
        true: { slot: "sticky z-2" },
        false: { slot: "absolute" },
      },
    },
  },
  { twMerge: false },
);

export const agendaHeaderStyles = tv(
  {
    slots: {
      root: "glass flex h-11 items-center gap-2.5 border-foreground/8 border-b px-5",
      title: "font-semibold text-subheadline",
      subtitle: "text-footnote text-muted-foreground",
      today: "ms-auto rounded-control bg-brand-soft px-2 py-0.5 font-semibold text-brand-ink text-caption1",
    },
  },
  { twMerge: false },
);

export const agendaRowStyles = tv(
  {
    slots: {
      root: "press flex h-15 w-full min-w-0 cursor-pointer items-center gap-3 rounded-field px-2 text-start outline-none transition-opacity duration-fade hover:bg-foreground/4 focus-visible:shadow-focus",
      time: "flex w-19 shrink-0 flex-col font-semibold text-footnote tabular-nums",
      timeEnd: "font-normal text-caption1 text-muted-foreground",
      bar: "w-0.75 shrink-0 self-stretch rounded-full my-2.5",
      text: "flex min-w-0 flex-1 flex-col",
      title: "truncate font-semibold text-subheadline",
      meta: "truncate text-footnote text-muted-foreground",
      lock: "size-3.5 shrink-0 text-muted-foreground",
    },
    variants: {
      isPast: {
        true: { root: "opacity-50" },
      },
      isStruck: {
        true: { title: "line-through" },
      },
    },
  },
  { twMerge: false },
);
