import { tv } from "tailwind-variants";

export const notificationStyles = tv(
  {
    slots: {
      root: "glass flex w-90 max-w-full items-start gap-3 rounded-surface edge p-3.5 text-foreground shadow-glass",
      text: "flex min-w-0 flex-1 flex-col text-subheadline",
      head: "flex items-baseline justify-between gap-2",
      title: "truncate font-semibold",
      time: "shrink-0 text-footnote text-muted-foreground",
      body: "line-clamp-3",
    },
  },
  { twMerge: false },
);
