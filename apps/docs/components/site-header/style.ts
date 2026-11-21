import { tv } from "tailwind-variants";

export const siteHeaderStyles = tv(
  {
    slots: {
      root: "pointer-events-none sticky top-0 z-40 flex w-full justify-center px-4 pt-2 md:px-6 md:pt-3",
      bar: "glass pointer-events-auto flex h-13 w-full max-w-280 items-center gap-2 rounded-control edge pr-1.5 pl-3 text-foreground shadow-glass",
      brandLink: "inline-flex h-11 shrink-0 items-center rounded-control px-1 outline-none focus-visible:shadow-focus",
      brand: "inline-flex items-center gap-2 font-semibold text-body text-foreground",
      links: "hidden flex-1 items-center justify-center gap-0.5 lg:flex",
      link: "inline-flex h-11 items-center rounded-control px-3 font-medium text-muted-foreground text-subheadline outline-none transition-colors duration-color hover:text-foreground focus-visible:shadow-focus data-current:font-semibold data-current:text-brand-ink",
      actions: "ml-auto flex items-center gap-1.5",
      wide: "hidden items-center gap-1.5 md:flex",
      narrow: "flex lg:hidden",
      drawerLinks: "flex flex-col",
      drawerLink:
        "flex h-11 items-center rounded-field px-3 font-medium text-body text-foreground outline-none transition-colors duration-color hover:bg-muted focus-visible:shadow-focus data-current:bg-brand-soft data-current:text-brand-ink",
      drawerFooter: "flex-col",
    },
  },
  { twMerge: false },
);
