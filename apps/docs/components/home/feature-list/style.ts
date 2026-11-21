import { tv } from "tailwind-variants";

export const featureListStyles = tv(
  {
    slots: {
      root: "flex flex-col gap-2.5",
      point: "flex items-start gap-2.5 text-body text-foreground",
      icon: "mt-0.5 size-5 shrink-0 text-foreground",
    },
  },
  { twMerge: false },
);
