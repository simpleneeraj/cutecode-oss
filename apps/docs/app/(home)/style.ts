import { tv } from "tailwind-variants";

export const homePageStyles = tv(
  {
    slots: {
      root: "flex w-full flex-1 flex-col items-center px-4 pt-3 pb-32 md:px-6 md:pt-4 md:pb-0",
      main: "flex w-full max-w-330 flex-col items-center gap-24 pb-24 md:gap-32 md:pb-32",
      dock: "fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-safe md:hidden",
    },
  },
  { twMerge: false },
);
