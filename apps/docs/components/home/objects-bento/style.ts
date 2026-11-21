import { tv } from "tailwind-variants";

import { TileSpan } from "./constants";

export const objectTileStyles = tv(
  {
    slots: {
      root: "flex min-w-0 flex-col gap-3 rounded-surface squircle edge bg-card p-1.5 pb-4 text-card-foreground shadow-rest transition duration-snappy ease-snappy hover:-translate-y-0.5 hover:shadow-raised motion-reduce:hover:translate-y-0",
      stage:
        "wallpaper relative flex min-h-60 flex-1 items-center justify-center rounded-surface squircle px-4 pt-12 pb-6",
      hint: "absolute top-3 left-3 flex",
      text: "flex flex-col gap-0.5 px-3",
      name: "font-semibold text-body text-foreground",
      line: "text-pretty text-muted-foreground text-subheadline",
    },
    variants: {
      span: {
        [TileSpan.Three]: { root: "col-span-2 md:col-span-1 lg:col-span-3" },
        [TileSpan.Four]: { root: "col-span-2 md:col-span-1 lg:col-span-4" },
        [TileSpan.Half]: { root: "col-span-1 lg:col-span-4" },
        [TileSpan.Five]: { root: "col-span-2 md:col-span-1 lg:col-span-5" },
        [TileSpan.Seven]: { root: "col-span-2 md:col-span-1 lg:col-span-7" },
      },
    },
  },
  { twMerge: false },
);

export const objectsBentoStyles = tv(
  {
    slots: {
      grid: "grid w-full grid-cols-2 gap-3 md:gap-4 lg:grid-cols-12",
      folders: "grid w-full max-w-90 grid-cols-2 gap-6",
      deck: "flex w-full justify-center",
      stack: "flex w-full justify-center",
      icons: "grid grid-cols-2 gap-x-4 gap-y-3",
      iconCell: "flex flex-col items-center gap-1.5 font-medium text-caption1 text-foreground",
      note: "flex w-full max-w-49 justify-center",
      ticket: "flex w-full max-w-67",
      chrome: "flex flex-col items-center gap-4",
      window: "flex w-full max-w-56",
      noteBody: "flex flex-col gap-2.5 pb-1",
      noteLine: "h-2 rounded-control bg-muted last:w-2/3",
      also: "flex flex-col items-start gap-3 rounded-surface squircle bg-secondary p-5 md:flex-row md:items-center md:justify-between md:px-6",
      alsoText: "text-pretty text-muted-foreground text-subheadline",
      alsoStrong: "font-semibold text-foreground",
    },
  },
  { twMerge: false },
);
