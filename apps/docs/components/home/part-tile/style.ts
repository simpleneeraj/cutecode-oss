import { tv } from "tailwind-variants";

export const partTileStyles = tv(
  {
    slots: {
      root: "flex min-w-0 flex-col justify-between gap-5 overflow-hidden rounded-surface edge bg-card p-6 text-card-foreground shadow-rest",
      demo: "flex min-h-64 items-center justify-center",
      caption: "flex flex-col gap-0.5",
      title: "font-semibold text-body",
      description: "text-muted-foreground text-subheadline",
    },
  },
  { twMerge: false },
);
