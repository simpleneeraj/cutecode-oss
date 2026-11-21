import { tv } from "tailwind-variants";

export const homeTabBarStyles = tv(
  {
    slots: {
      root: "pointer-events-auto flex max-w-full",
    },
  },
  { twMerge: false },
);
