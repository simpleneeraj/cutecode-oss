import { tv } from "tailwind-variants";

export const bannerStyles = tv(
  {
    slots: {
      root: "glass flex items-center gap-3 rounded-surface px-3.5 py-2.5 shadow-glass",
      icon: "size-5 shrink-0 text-muted-foreground",
      text: "flex min-w-0 flex-1 flex-col",
      title: "font-semibold text-footnote",
      description: "text-footnote text-muted-foreground",
    },
  },
  { twMerge: false },
);

export const conflictStyles = tv(
  {
    slots: {
      body: "flex flex-col gap-2 px-6 pb-2",
      version: "flex min-h-15 flex-col justify-center gap-0.5 rounded-field bg-foreground/4 px-3.5 py-2.5",
      label: "font-semibold text-footnote text-muted-foreground",
      title: "truncate font-semibold text-subheadline",
      when: "truncate text-footnote text-muted-foreground tabular-nums",
      actions: "flex gap-2 px-6 pt-3 pb-6 sm:justify-end",
      action: "flex-1 sm:flex-none",
    },
  },
  { twMerge: false },
);

export const readOnlyHintStyles = tv(
  {
    slots: {
      root: "flex items-center gap-1.5 rounded-field bg-foreground/4 px-2.5 py-1.5 font-semibold text-footnote",
      icon: "size-3.5 shrink-0 text-muted-foreground",
    },
  },
  { twMerge: false },
);

export const stateExampleStyles = tv(
  {
    slots: {
      root: "flex min-w-0 flex-col gap-3",
      controls: "flex flex-wrap items-center gap-3",
    },
  },
  { twMerge: false },
);
