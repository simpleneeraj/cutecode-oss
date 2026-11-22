import { tv } from "tailwind-variants";

export const tabletStyles = tv(
  {
    slots: {
      root: "flex min-w-0 flex-col gap-3.5",
      main: "flex min-w-0 flex-col gap-3",
      trigger: "self-start",
      week: "min-w-0",
      sheet: "max-w-80",
    },
  },
  { twMerge: false },
);

export const tabletExampleStyles = tv(
  {
    slots: {
      calendars: "flex flex-col gap-1",
      calendar: "flex min-h-11 items-center gap-2.5 text-body",
      tick: "size-4.5 shrink-0 rounded-field",
    },
  },
  { twMerge: false },
);
