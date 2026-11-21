import { tv } from "tailwind-variants";

enum BarWidth {
  Thin = "thin",
  Regular = "regular",
  Wide = "wide",
}

export const barWidths = [BarWidth.Thin, BarWidth.Regular, BarWidth.Wide];

export const ticketStyles = tv(
  {
    slots: {
      root: "relative flex w-full max-w-80 flex-col overflow-hidden rounded-surface edge text-foreground shadow-rest",
      main: "flex flex-col gap-2 p-5 pb-6",
      join: "relative h-0",
      perforation: "absolute inset-x-4 top-0 -translate-y-1/2 border-t-2 border-border border-dashed",
      leftNotch: "absolute top-0 -left-2.5 size-5 -translate-y-1/2 rounded-full bg-background",
      rightNotch: "absolute top-0 -right-2.5 size-5 -translate-y-1/2 rounded-full bg-background",
      stub: "flex items-end justify-between gap-4 bg-card p-5 pt-6",
      stubContent: "flex min-w-0 flex-col gap-1",
      barcode: "flex shrink-0 flex-col items-center gap-1",
      bars: "flex h-12 items-stretch gap-0.5",
      bar: "bg-foreground",
      code: "font-mono text-caption1 text-muted-foreground",
    },
    variants: {
      width: {
        [BarWidth.Thin]: { bar: "w-px" },
        [BarWidth.Regular]: { bar: "w-0.5" },
        [BarWidth.Wide]: { bar: "w-1" },
      },
    },
  },
  { twMerge: false },
);
