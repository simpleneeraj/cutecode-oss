import { tv } from "tailwind-variants";

export const recurringExampleStyles = tv(
  {
    slots: {
      root: "flex min-w-0 flex-col gap-3.5",
      card: "glass flex flex-col rounded-overlay p-3.5 shadow-glass",
    },
  },
  { twMerge: false },
);
