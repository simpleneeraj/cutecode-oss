import { tv } from "tailwind-variants";

export const installCommandStyles = tv(
  {
    slots: {
      root: "flex w-full flex-col items-start gap-2.5",
      row: "flex h-14 w-full items-center gap-3 rounded-control edge bg-card pr-1.5 pl-4.5 text-card-foreground shadow-rest",
      prompt: "shrink-0 font-mono text-footnote text-muted-foreground",
      command: "min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-footnote",
      copyLabel: "inline-flex items-center gap-1",
      copyIcon: "size-4",
    },
  },
  { twMerge: false },
);
