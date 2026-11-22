import { tv } from "tailwind-variants";

export const calendarDocsStyles = tv(
  {
    slots: {
      root: "not-prose flex flex-col gap-3",
      toolbar: "flex flex-row items-center justify-end gap-2 text-footnote text-muted-foreground",
      frame: "relative mx-auto w-full max-h-dvh overflow-x-hidden overflow-y-auto overscroll-contain rounded-surface edge bg-background text-foreground",
      skeleton: "size-full bg-muted/40",
      codeStack: "flex flex-col",
    },
    variants: {
      size: {
        compact: { frame: "h-80" },
        regular: { frame: "h-120" },
        tall: { frame: "h-180" },
      },
      isNarrow: {
        true: { frame: "max-w-sm" },
        false: { frame: "max-w-full" },
      },
    },
  },
  { twMerge: false },
);
