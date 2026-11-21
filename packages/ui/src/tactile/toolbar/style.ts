import { tv } from "tailwind-variants";

export const toolbarStyles = tv(
  {
    slots: {
      root: "glass flex h-13 w-full items-center gap-3 rounded-control edge pr-1 pl-3 text-foreground shadow-glass md:gap-5 md:pr-1.5 md:pl-3.5",
      brand:
        "press relative inline-flex h-11 shrink-0 items-center gap-2 rounded-control font-semibold text-body outline-none focus-visible:shadow-focus",
      links: "mx-auto hidden items-center gap-1 md:flex",
      link: "press hit-area relative inline-flex h-control-medium items-center gap-1.5 rounded-control px-control-inset-small text-density-subheadline text-foreground/80 outline-none hover:bg-accent hover:text-foreground focus-visible:shadow-focus data-current:font-semibold data-current:text-foreground",
      actions: "ml-auto flex shrink-0 items-center gap-1.5 md:ml-0",
    },
  },
  { twMerge: false },
);
