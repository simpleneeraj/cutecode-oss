import { tv } from "tailwind-variants";

export const quickAddStyles = tv(
  {
    slots: {
      root: "flex min-w-0 flex-col gap-2.5",
      field:
        "flex min-h-12 items-center gap-2.5 rounded-full bg-card ps-3.5 pe-1.5 shadow-rest transition-shadow focus-within:shadow-focus",
      icon: "size-5 shrink-0 text-muted-foreground",
      input: "h-11 min-w-0 flex-1 bg-transparent text-body text-foreground outline-none placeholder:text-muted-foreground",
      chips: "flex min-h-7 flex-wrap gap-1.5",
      hint: "flex items-start gap-1.5 text-footnote text-muted-foreground",
      hintIcon: "mt-0.5 size-4 shrink-0",
    },
  },
  { twMerge: false },
);

export const chipStyles = tv(
  {
    slots: {
      root: "hit-area press relative flex min-h-7 max-w-full items-center gap-1.5 rounded-full px-3 font-semibold text-footnote outline-none transition-colors focus-visible:shadow-focus",
      name: "shrink-0 font-medium opacity-70",
      value: "truncate",
    },
    variants: {
      isAccent: {
        true: { root: "bg-brand-soft text-brand-ink" },
        false: { root: "bg-card text-foreground shadow-rest" },
      },
      isMissing: {
        true: { root: "border border-border border-dashed bg-transparent text-muted-foreground shadow-none" },
      },
      isOpen: {
        true: { root: "shadow-focus" },
      },
    },
  },
  { twMerge: false },
);

export const fixPanelStyles = tv(
  {
    slots: {
      root: "flex min-w-0 flex-col gap-2",
      title: "font-semibold text-footnote text-muted-foreground",
      strip: "-mx-4 flex min-w-0 snap-x gap-2 overflow-x-auto px-4 pb-1",
      form: "flex items-center gap-2",
      input: "min-w-0 flex-1",
    },
  },
  { twMerge: false },
);

export const fixOptionStyles = tv(
  {
    base: "press flex min-h-11 shrink-0 snap-start items-center rounded-full px-4 font-semibold text-subheadline outline-none transition-colors focus-visible:shadow-focus",
    variants: {
      isSelected: {
        true: "bg-brand-soft text-brand-ink",
        false: "bg-card text-foreground shadow-rest",
      },
    },
  },
  { twMerge: false },
);

export const quickAddDialogStyles = tv(
  {
    slots: {
      body: "px-6 pb-6",
    },
  },
  { twMerge: false },
);
