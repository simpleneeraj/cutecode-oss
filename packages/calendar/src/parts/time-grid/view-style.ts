import { tv } from "tailwind-variants";

export const timeGridViewStyles = tv(
  {
    slots: {
      root: "@container flex min-w-0 flex-col gap-3.5",
      surface: "glass flex min-w-0 flex-col overflow-clip rounded-overlay shadow-glass",
      empty: "text-center text-footnote text-muted-foreground",
    },
  },
  { twMerge: false },
);
