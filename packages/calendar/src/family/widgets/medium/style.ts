import { tv } from "tailwind-variants";

export const mediumWidgetStyles = tv(
  {
    slots: {
      row: "flex h-full min-w-0 gap-3.5",
      tile: "flex w-34 shrink-0 flex-col justify-between rounded-2xl bg-linear-to-br from-brand-soft to-brand/24 p-3 text-brand-ink",
      tileDate: "font-bold text-title3 tracking-tight tabular-nums",
      tileText: "flex flex-col font-medium text-footnote",
      list: "flex min-w-0 flex-1 flex-col gap-2.5 pt-0.5",
      heading: "font-semibold text-subheadline",
      note: "text-footnote text-muted-foreground",
      more: "font-semibold text-caption1 text-muted-foreground tabular-nums",
    },
  },
  { twMerge: false },
);
