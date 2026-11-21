import { tv } from "tailwind-variants";

export const pricingTeaserStyles = tv(
  {
    slots: {
      root: "flex w-full max-w-300 scroll-mt-24 flex-col items-center gap-8",
      plans: "grid w-full max-w-185 items-start gap-5 md:grid-cols-2",
    },
  },
  { twMerge: false },
);
