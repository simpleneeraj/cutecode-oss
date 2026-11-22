import { tv } from "tailwind-variants";

export const viewSwitchStyles = tv(
  {
    slots: {
      root: "flex min-h-0 flex-1 flex-col",
      view: "flex min-h-0 flex-1 flex-col",
    },
  },
  { twMerge: false },
);
