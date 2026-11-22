import { tv } from "tailwind-variants";

import { SkeletonLayout } from "./shapes";

export const calendarSkeletonStyles = tv(
  {
    slots: {
      root: "grid min-h-0 flex-1 gap-2 p-2",
      item: "flex gap-2",
      header: "",
      body: "flex-1",
    },
    variants: {
      layout: {
        [SkeletonLayout.Columns]: {
          root: "auto-cols-fr grid-flow-col",
          item: "flex-col",
          header: "h-8",
          body: "min-h-96",
        },
        [SkeletonLayout.Cells]: {
          root: "grid-cols-7 grid-rows-6",
          item: "flex-col",
          header: "hidden",
          body: "min-h-16",
        },
        [SkeletonLayout.Months]: {
          root: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
          item: "flex-col",
          header: "h-5 w-1/2",
          body: "aspect-square",
        },
        [SkeletonLayout.Rows]: {
          root: "grid-cols-1",
          item: "flex-row items-center",
          header: "size-11 shrink-0",
          body: "h-14",
        },
      },
    },
  },
  { twMerge: false },
);
