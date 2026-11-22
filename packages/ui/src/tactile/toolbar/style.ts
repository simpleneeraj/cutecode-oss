import { tv } from "tailwind-variants";

export const toolbarStyles = tv(
  {
    slots: {
      root: "glass flex h-12 w-full items-center gap-3 rounded-2xl edge pr-2 pl-2.5 sm:h-11 text-foreground shadow-glass md:gap-5 md:pr-1.5 md:pl-3.5",
      brand:
        "press relative inline-flex h-control-medium shrink-0 items-center gap-2 rounded-control font-medium text-density-body outline-none focus-visible:shadow-focus",
      links: "mx-auto hidden items-center gap-1 md:flex",
      link: "press hit-area relative inline-flex h-control-medium items-center gap-1.5 rounded-control px-control-inset-medium font-medium text-density-body text-muted-foreground outline-none hover:bg-foreground/6 hover:text-foreground focus-visible:shadow-focus data-current:bg-foreground/8 data-current:text-foreground",
      actions: "ml-auto flex shrink-0 items-center gap-1.5 md:ml-0",
    },
  },
  { twMerge: false },
);
