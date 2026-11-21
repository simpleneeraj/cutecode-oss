import { tv } from "tailwind-variants";

export const pocketCardStyles = tv(
  {
    slots: {
      root: "relative flex w-65 max-w-full flex-col rounded-surface pb-8.5 edge shadow-rest",
      face: "flex flex-col gap-2 rounded-surface edge bg-card px-4 pt-4 pb-3.5 text-card-foreground shadow-rest",
      title: "font-semibold text-title3",
      meta: "text-subheadline text-muted-foreground",
      chips: "flex flex-wrap gap-1.5 pt-0.5",
      caption: "absolute inset-x-0 bottom-2 truncate px-4 text-center font-semibold text-caption1",
    },
  },
  { twMerge: false },
);
