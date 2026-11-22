import { tv } from "tailwind-variants";

import { WidgetSize } from "./props";

export const widgetCardStyles = tv(
  {
    base: "relative flex min-w-0 flex-col gap-2 rounded-3xl bg-card p-3.5 text-foreground shadow-raised edge",
    variants: {
      size: {
        [WidgetSize.Small]: "size-42.5 overflow-hidden",
        [WidgetSize.Medium]: "h-42.5 w-full overflow-hidden sm:w-91",
        [WidgetSize.Notch]: "mt-6.5 h-42.5 w-full rounded-se-none sm:w-91",
        [WidgetSize.Large]: "h-95.5 w-full overflow-hidden sm:w-91",
      },
    },
  },
  { twMerge: false },
);

export const widgetLineStyles = tv(
  {
    slots: {
      root: "flex min-w-0 gap-2 text-footnote",
      bar: "w-0.75 shrink-0 self-stretch rounded-full",
      text: "flex min-w-0 flex-col",
      title: "truncate font-semibold",
      detail: "truncate text-muted-foreground tabular-nums",
    },
  },
  { twMerge: false },
);

export const widgetDateStyles = tv(
  {
    slots: {
      root: "flex flex-col",
      weekday: "font-semibold text-brand-ink text-footnote uppercase tracking-wide",
      number: "font-semibold text-5xl leading-none tracking-tighter tabular-nums",
    },
  },
  { twMerge: false },
);

export const widgetPlaceholderStyles = tv(
  {
    slots: {
      root: "flex flex-1 flex-col gap-2",
      label: "h-3 w-1/2 rounded-md bg-foreground/7",
      number: "h-10 w-11 rounded-lg bg-foreground/7",
      line: "h-7.5 w-full rounded-lg bg-foreground/7 last:w-4/5",
      spoken: "sr-only",
    },
  },
  { twMerge: false },
);

export const widgetExampleStyles = tv(
  {
    slots: {
      root: "flex min-w-0 flex-col gap-4 p-4",
      stage: "wallpaper flex min-w-0 flex-wrap items-start gap-4 rounded-overlay p-4 sm:p-7",
    },
  },
  { twMerge: false },
);
