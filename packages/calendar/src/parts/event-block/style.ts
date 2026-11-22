import { tv } from "tailwind-variants";

import { BlockCorners, BlockSize, BlockStatus } from "./appearance";

export const eventBlockStyles = tv(
  {
    slots: {
      root: "@container group relative flex size-full min-h-4.5 touch-manipulation select-none overflow-hidden text-start outline-none transition-opacity duration-fade focus-visible:z-10 focus-visible:shadow-focus",
      bar: "w-0.75 shrink-0",
      content: "flex min-w-0 flex-1 px-1.5 py-0.5 @max-5xs:px-1",
      heading: "flex min-w-0 items-start gap-1",
      title: "min-w-0 font-semibold text-caption1 @max-5xs:whitespace-nowrap",
      lock: "mt-0.5 size-3 shrink-0 opacity-70 @max-5xs:hidden",
      meta: "flex min-w-0 shrink-0 gap-1 text-caption1 tabular-nums @max-4xs:hidden",
      place: "truncate text-caption1 opacity-80 @max-4xs:hidden",
      pending: "absolute end-1.5 top-1.5 size-2 rounded-full border border-current opacity-60",
    },
    variants: {
      size: {
        [BlockSize.Short]: { content: "flex-row items-center gap-1.5", title: "line-clamp-1", place: "hidden" },
        [BlockSize.Tall]: { content: "flex-col gap-0.5 pt-1", title: "line-clamp-2" },
      },
      corners: {
        [BlockCorners.Round]: { root: "rounded-field" },
        [BlockCorners.SquareTop]: { root: "rounded-b-field" },
        [BlockCorners.SquareBottom]: { root: "rounded-t-field" },
        [BlockCorners.Square]: { root: "rounded-none" },
      },
      status: {
        [BlockStatus.Confirmed]: {},
        [BlockStatus.Tentative]: { root: "hatch" },
        [BlockStatus.Declined]: { title: "line-through" },
        [BlockStatus.Cancelled]: { title: "line-through" },
      },
      isPast: {
        true: { root: "opacity-70" },
      },
      isReadOnly: {
        true: { root: "cursor-default" },
        false: { root: "cursor-pointer" },
      },
    },
  },
  { twMerge: false },
);

export const eventMarkerStyles = tv(
  {
    slots: {
      root: "relative flex h-4.5 w-full -translate-y-1/2 cursor-pointer touch-manipulation select-none items-center gap-1 rounded-control text-start outline-none focus-visible:z-10 focus-visible:shadow-focus",
      dot: "size-2 shrink-0 rounded-full",
      line: "absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2",
      label:
        "relative z-1 flex min-w-0 items-center gap-1 rounded-control bg-card px-1.5 font-semibold text-caption1 text-foreground shadow-rest",
      title: "truncate",
      time: "shrink-0 font-normal opacity-80 tabular-nums",
    },
    variants: {
      isPast: {
        true: { root: "opacity-70" },
      },
    },
  },
  { twMerge: false },
);
