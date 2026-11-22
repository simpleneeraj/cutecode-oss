import { tv } from "tailwind-variants";

export const smallWidgetStyles = tv(
  {
    slots: {
      lines: "flex min-w-0 flex-col gap-2",
      note: "text-footnote text-muted-foreground",
    },
  },
  { twMerge: false },
);
