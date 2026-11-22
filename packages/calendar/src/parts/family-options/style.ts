import { tv } from "tailwind-variants";

export const stateSwitchStyles = tv(
  {
    slots: {
      strip: "-mx-4 flex max-w-dvw shrink-0 overflow-x-auto px-4",
    },
  },
  { twMerge: false },
);

export const familyExampleStyles = tv(
  {
    slots: {
      root: "flex min-h-dvh w-full flex-col items-center gap-5 wallpaper px-4 py-6 text-foreground",
      stage: "flex w-full max-w-md flex-col items-center gap-4",
      result: "text-footnote text-muted-foreground tabular-nums",
    },
  },
  { twMerge: false },
);
