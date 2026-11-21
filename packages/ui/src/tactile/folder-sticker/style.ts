import { tv } from "tailwind-variants";

export const folderStickerStyles = tv(
  {
    slots: {
      root: "absolute top-1/3 right-1/12 z-20 rotate-8",
      clip: "absolute -top-4 right-1 size-6.5 rotate-18 text-muted-foreground",
    },
  },
  { twMerge: false },
);
