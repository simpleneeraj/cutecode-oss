import { tv } from "tailwind-variants";

export const headingStyles = tv(
  {
    slots: {
      root: "group/heading flex flex-row items-center gap-1.5",
      heading: "scroll-m-28",
      anchor:
        "not-prose press relative hit-area inline-flex size-7 shrink-0 items-center justify-center rounded-control text-muted-foreground opacity-0 transition-opacity duration-fade hover:bg-muted hover:text-foreground focus-visible:opacity-100 group-hover/heading:opacity-100 pointer-coarse:opacity-100",
      icon: "size-4",
      status: "sr-only",
    },
  },
  { twMerge: false },
);

export const codeBlockStyles = tv(
  {
    slots: {
      copy: "press relative hit-area inline-flex h-7 items-center rounded-control px-2.5 text-footnote font-semibold text-muted-foreground hover:bg-muted hover:text-foreground",
      iconCopy:
        "press relative hit-area inline-flex size-6 items-center justify-center rounded-control text-muted-foreground hover:bg-muted hover:text-foreground",
      icon: "size-4 shrink-0 text-muted-foreground",
    },
  },
  { twMerge: false },
);
