import { tv } from "tailwind-variants";

export const homeSectionStyles = tv(
  {
    slots: {
      root: "flex w-full scroll-mt-24 flex-col gap-8 py-12 md:gap-11 md:py-16",
      feature: "grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-14",
    },
  },
  { twMerge: false },
);
