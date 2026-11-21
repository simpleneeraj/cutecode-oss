import { tv } from "tailwind-variants";

export const homeLayoutStyles = tv(
  {
    slots: {
      root: "pb-26 md:pb-0",
      dock: "pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-safe md:hidden",
    },
  },
  { twMerge: false },
);

export const homePageStyles = tv(
  {
    slots: {
      root: "flex w-full flex-1 flex-col items-center px-4 md:px-6",
      sections: "flex w-full max-w-280 flex-col",
    },
  },
  { twMerge: false },
);
