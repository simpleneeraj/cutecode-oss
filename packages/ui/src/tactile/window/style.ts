import { tv } from "tailwind-variants";

export const windowStyles = tv(
  {
    slots: {
      root: "flex w-full flex-col overflow-hidden rounded-surface edge bg-card text-card-foreground shadow-raised",
      bar: "relative flex h-13 shrink-0 items-center px-4.5",
      lights: "flex items-center gap-2",
      closeLight: "size-3 rounded-full bg-traffic-red",
      minimizeLight: "size-3 rounded-full bg-traffic-yellow",
      zoomLight: "size-3 rounded-full bg-traffic-green",
      title: "absolute inset-x-20 truncate text-center font-semibold text-footnote text-muted-foreground",
      body: "px-6 pt-2 pb-6",
    },
  },
  { twMerge: false },
);
