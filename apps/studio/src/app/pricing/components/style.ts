import { tv } from "tailwind-variants";

export const pricingPageStyles = tv({
  slots: {
    main: "flex-1 bg-background px-4 py-10 md:px-8 md:py-16",
    content: "mx-auto flex max-w-5xl flex-col gap-12",
    hero: "mx-auto flex max-w-xl flex-col gap-2 text-center",
    title: "text-balance font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl",
    subtitle: "text-pretty text-density-body text-muted-foreground",
    section: "grid gap-5 border-t pt-12 md:grid-cols-3 md:gap-4",
    sectionTitle: "font-heading text-title3 font-semibold tracking-tight text-foreground",
    faq: "md:col-span-2",
  },
});

export const planGridStyles = tv({
  slots: {
    root: "flex flex-col gap-6",
    grid: "grid items-stretch gap-3 md:grid-cols-3 md:gap-4",
    item: "flex",
    detail: "flex min-h-lh flex-wrap items-center gap-2 text-density-footnote text-muted-foreground",
    listPrice: "line-through tabular-nums",
  },
  variants: {
    isFeatured: {
      true: { item: "order-first md:order-none" },
    },
  },
});

export const sponsorStyles = tv({
  slots: {
    intro: "flex flex-col gap-2",
    body: "text-pretty text-density-subheadline text-muted-foreground",
    content: "flex flex-col gap-4 md:col-span-2",
    tiers: "grid gap-3 sm:grid-cols-3",
    tier: "gap-2 p-4",
    badge: "size-10 rounded-icon squircle",
    name: "text-density-subheadline text-muted-foreground",
    price: "font-heading text-title3 font-semibold tabular-nums text-foreground",
    period: "text-density-footnote font-normal text-muted-foreground",
    perks: "flex flex-col gap-1 text-density-footnote text-muted-foreground",
    action: "h-control-medium self-start px-control-inset-medium text-density-body",
  },
});
