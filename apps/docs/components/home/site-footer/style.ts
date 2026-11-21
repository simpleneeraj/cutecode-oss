import { tv } from "tailwind-variants";

export const siteFooterStyles = tv(
  {
    slots: {
      root: "flex w-full max-w-280 flex-col gap-10 border-border border-t pt-10 pb-10 md:pb-12",
      top: "flex flex-col gap-10 md:flex-row md:justify-between",
      brand: "flex max-w-80 flex-col gap-3",
      tagline: "text-pretty text-muted-foreground text-subheadline",
      columns: "grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 md:gap-x-16",
      column: "flex flex-col",
      heading: "pb-1 font-semibold text-footnote text-foreground",
      link: "relative hit-area inline-flex h-9 items-center self-start rounded-field text-muted-foreground text-subheadline outline-none transition-colors duration-color hover:text-foreground focus-visible:text-foreground focus-visible:shadow-focus",
      bottom: "flex flex-col gap-1 text-footnote text-muted-foreground md:flex-row md:justify-between",
    },
  },
  { twMerge: false },
);
