import { tv } from "tailwind-variants";

export const toolbarStyles = tv(
  {
    slots: {
      root: "glass flex h-14 w-full items-center gap-5 rounded-control edge pr-1.5 pl-4.5 text-foreground shadow-glass",
      brand:
        "press relative inline-flex h-11 shrink-0 items-center gap-2.5 rounded-control font-semibold text-body outline-none focus-visible:shadow-focus",
      links: "mx-auto hidden items-center gap-0.5 md:flex",
      link: "press relative inline-flex h-11 items-center gap-1.5 rounded-control px-3.5 text-foreground/80 text-subheadline outline-none hover:bg-accent hover:text-foreground focus-visible:shadow-focus data-current:font-semibold data-current:text-foreground",
      actions: "ml-auto flex shrink-0 items-center gap-1.5 md:ml-0",
    },
  },
  { twMerge: false },
);
