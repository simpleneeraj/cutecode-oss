import { tv } from "tailwind-variants";

export const tabBarStyles = tv(
  {
    slots: {
      root: "glass inline-flex max-w-full items-center gap-0.5 rounded-control p-1 edge text-foreground shadow-glass",
      tab: "press relative flex h-12 min-w-16 flex-auto flex-col items-center justify-center gap-0.5 rounded-control px-2 font-medium text-density-caption sm:h-10 text-foreground outline-none focus-visible:shadow-focus data-current:bg-foreground/7 data-current:text-brand-ink",
      icon: "size-5.5 shrink-0 sm:size-5",
      label: "max-w-full truncate",
    },
  },
  { twMerge: false },
);
