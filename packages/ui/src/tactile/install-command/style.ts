import { tv } from "tailwind-variants";

export const installCommandStyles = tv(
  {
    slots: {
      root: "flex w-full flex-col gap-2.5 rounded-surface squircle edge bg-card p-2.5 text-card-foreground shadow-rest",
      top: "flex items-center justify-between gap-2",
      line: "flex gap-2 px-3 pt-2.5 pb-3 font-mono text-density-footnote",
      prompt: "shrink-0 select-none text-muted-foreground",
      command: "min-w-0 flex-1 wrap-anywhere",
      item: "text-brand-ink",
      copyLabel: "inline-flex items-center gap-1",
      copyIcon: "size-4.5 sm:size-4",
    },
  },
  { twMerge: false },
);
