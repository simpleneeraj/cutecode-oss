import { tv } from "tailwind-variants";

export const sectionHeadingStyles = tv(
  {
    slots: {
      root: "flex max-w-180 flex-col gap-2.5",
      title: "text-balance font-semibold text-3xl tracking-tight md:text-4xl",
      accent: "font-normal font-serif",
      description: "text-pretty text-lg text-muted-foreground",
    },
    variants: {
      isCentered: {
        true: { root: "items-center self-center text-center" },
      },
    },
  },
  { twMerge: false },
);
