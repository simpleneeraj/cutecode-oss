import { tv } from "tailwind-variants";

export const largeWidgetStyles = tv(
  {
    slots: {
      head: "flex items-baseline justify-between gap-2",
      title: "font-semibold text-body",
      count: "font-semibold text-brand-ink text-footnote tabular-nums",
      grid: "flex flex-col",
      row: "grid grid-cols-7 text-center",
      weekday: "font-semibold text-caption2 text-muted-foreground leading-5.5",
      separator: "my-0.5 h-px bg-border",
      lines: "flex min-w-0 flex-col gap-2.5",
      note: "text-footnote text-muted-foreground",
    },
  },
  { twMerge: false },
);

export const glanceDayStyles = tv(
  {
    base: "mx-auto grid size-5.5 place-items-center rounded-full font-medium text-caption2 tabular-nums",
    variants: {
      inMonth: {
        false: "opacity-30",
      },
      busy: {
        true: "underline decoration-2 decoration-brand/70 underline-offset-3",
      },
      today: {
        true: "bg-foreground font-bold text-background no-underline",
      },
    },
  },
  { twMerge: false },
);
