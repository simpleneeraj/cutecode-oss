import { tv } from "tailwind-variants";

export const galleryStyles = tv({
  slots: {
    frame: "not-prose my-6 flex flex-col items-center gap-6 rounded-surface edge bg-background p-6 text-foreground sm:p-8",
    row: "flex w-full flex-wrap items-center justify-center gap-3",
    tile: "w-full max-w-64",
    status: "text-footnote text-muted-foreground",
  },
});
