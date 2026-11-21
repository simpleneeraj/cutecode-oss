import { tv } from "tailwind-variants";

export const siteFooterStyles = tv(
  {
    slots: {
      root: "flex w-full max-w-300 flex-col gap-4 border-border border-t pt-7 pb-10 text-footnote text-muted-foreground md:flex-row md:items-center md:justify-between",
      brand: "font-semibold text-foreground text-subheadline",
      links: "flex flex-wrap gap-x-5",
      link: "inline-flex h-11 items-center hover:text-foreground focus-visible:text-foreground",
    },
  },
  { twMerge: false },
);
