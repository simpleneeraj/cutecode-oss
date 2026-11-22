import { tv } from "tailwind-variants";

export const zoneBannerStyles = tv(
  {
    slots: {
      root: "glass flex flex-wrap items-center gap-3 rounded-surface py-2.5 ps-3.5 pe-3 shadow-glass",
      icon: "size-5 shrink-0 text-muted-foreground",
      text: "flex min-w-40 flex-1 flex-col",
      title: "font-semibold text-footnote",
      description: "text-footnote text-muted-foreground",
      actions: "flex shrink-0 flex-wrap gap-1.5",
    },
  },
  { twMerge: false },
);
