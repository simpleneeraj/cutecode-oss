import { tv } from "tailwind-variants";

export const folderStyles = tv(
  {
    slots: {
      root: "flex w-full flex-col items-center gap-2.5",
      body: "relative aspect-5/4 w-full",
      tab: "absolute top-0 left-1/12 h-1/6 w-1/3 rounded-t-field bg-muted",
      back: "absolute inset-x-0 top-1/12 bottom-0 rounded-surface bg-muted",
      front: "glass absolute inset-x-0 bottom-0 flex h-3/5 items-end overflow-hidden rounded-surface edge p-3 shadow-glass",
      tint: "absolute inset-0 opacity-80",
      frontContent: "relative flex w-full items-end justify-between gap-2",
      title: "text-center font-semibold text-body text-foreground",
      count: "text-center text-footnote text-muted-foreground",
    },
  },
  { twMerge: false },
);
