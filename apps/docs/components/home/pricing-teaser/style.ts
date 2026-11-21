import { tv } from "tailwind-variants";

export const pricingTeaserStyles = tv(
  {
    slots: {
      plans: "grid w-full max-w-185 items-stretch gap-3 self-center md:grid-cols-2 md:gap-4",
    },
  },
  { twMerge: false },
);
