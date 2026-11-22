import { tv } from "tailwind-variants";

export const priceCardStyles = tv(
  {
    slots: {
      root: "flex w-full flex-col gap-4 rounded-overlay squircle edge bg-card p-5.5 text-card-foreground md:p-7",
      header: "flex items-center justify-between gap-2",
      name: "font-semibold text-lg leading-none",
      amount: "flex flex-wrap items-baseline gap-2",
      price: "font-semibold text-price tabular-nums",
      period: "text-density-subheadline text-muted-foreground",
      note: "text-density-footnote text-muted-foreground",
      features: "flex flex-col gap-2.5 text-density-subheadline",
      feature: "flex items-start gap-2.5",
      featureIcon: "size-4.5 shrink-0 text-foreground sm:size-4",
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
