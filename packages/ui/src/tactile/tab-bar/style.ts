import { tv } from "tailwind-variants";

export const tabBarStyles = tv(
  {
    slots: {
      root: "glass inline-flex max-w-full items-center gap-0.5 rounded-control p-1.25 edge text-foreground shadow-glass",
      tab: "press relative flex h-13.5 min-w-16.5 flex-auto flex-col items-center justify-center gap-px rounded-control px-2 font-semibold text-caption2 text-foreground outline-none focus-visible:shadow-focus data-current:bg-foreground/7 data-current:text-brand-ink",
      icon: "size-6 shrink-0",
      label: "max-w-full truncate",
    },
  },
  { twMerge: false },
);
