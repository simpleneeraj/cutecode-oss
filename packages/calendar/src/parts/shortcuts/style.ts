import { tv } from "tailwind-variants";

export const shortcutSheetStyles = tv(
  {
    slots: {
      body: "flex flex-col gap-5 px-6 pb-6",
      group: "flex flex-col gap-1",
      title: "font-medium text-footnote text-muted-foreground",
      rows: "flex flex-col",
      row: "flex min-h-10 min-w-0 items-center justify-between gap-4 border-border/60 border-b last:border-b-0",
      label: "min-w-0 text-subheadline",
      keys: "shrink-0",
    },
  },
  { twMerge: false },
);
