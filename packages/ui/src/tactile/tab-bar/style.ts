import { tv } from "tailwind-variants";

export const tabBarStyles = tv(
  {
    slots: {
      root: "glass inline-flex max-w-full items-center rounded-control p-1 edge text-foreground shadow-glass",
      tab: "press relative flex h-14 min-w-16 flex-auto flex-col items-center justify-center gap-0.5 rounded-control px-2 font-medium text-caption1 text-foreground outline-none focus-visible:shadow-focus data-current:bg-brand-soft data-current:text-brand-ink sm:min-w-19",
      icon: "size-6.5 shrink-0",
      label: "max-w-full truncate",
    },
  },
  { twMerge: false },
);
