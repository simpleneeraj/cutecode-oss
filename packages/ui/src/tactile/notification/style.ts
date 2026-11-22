import { tv } from "tailwind-variants";

export const notificationStyles = tv(
  {
    slots: {
      root: "glass flex w-90 max-w-full items-start gap-3 rounded-surface squircle edge p-3.5 text-foreground shadow-glass",
      text: "flex min-w-0 flex-1 flex-col text-density-subheadline",
      head: "flex items-baseline justify-between gap-2",
      title: "truncate font-medium",
      time: "shrink-0 text-density-footnote text-muted-foreground",
      body: "line-clamp-2 wrap-anywhere",
    },
  },
  { twMerge: false },
);
