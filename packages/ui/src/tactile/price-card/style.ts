import { tv } from "tailwind-variants";

export const priceCardStyles = tv(
  {
    slots: {
      root: "flex w-full flex-col gap-4 rounded-overlay squircle edge bg-card p-5.5 text-card-foreground md:p-7",
      header: "flex items-center justify-between gap-2",
      name: "font-semibold text-title3",
      amount: "flex flex-wrap items-baseline gap-2",
      price: "font-semibold text-price tabular-nums",
      period: "text-muted-foreground text-subheadline",
      note: "text-footnote text-muted-foreground",
      features: "flex flex-col gap-2.5 text-subheadline",
      feature: "flex items-start gap-2.5",
      featureIcon: "size-5 shrink-0 text-foreground",
    },
    variants: {
      isFeatured: {
        true: { root: "shadow-raised inset-ring-2 inset-ring-brand" },
        false: { root: "shadow-rest" },
      },
    },
    defaultVariants: {
      isFeatured: false,
    },
  },
  { twMerge: false },
);
