import { tv } from "tailwind-variants";

export const calendarToolbarStyles = tv(
  {
    slots: {
      root: "flex min-h-11 flex-wrap items-center gap-x-3 gap-y-2.5",
      heading: "me-auto flex min-w-0 items-baseline gap-2",
      title: "truncate font-heading font-semibold text-title3 tracking-tight",
      subtitle: "truncate text-muted-foreground text-subheadline tabular-nums @max-md:hidden",
      stepper: "flex items-center gap-1",
      arrow: "rtl:-scale-x-100",
      fullLabel: "@max-xl:hidden",
      letter: "@xl:hidden",
    },
  },
  { twMerge: false },
);
