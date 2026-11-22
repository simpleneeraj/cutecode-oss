import { tv } from "tailwind-variants";

export const buttonPairStyles = tv(
  {
    slots: {
      root: "inline-flex items-center gap-2",
      button:
        "press relative inline-flex h-control-large shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-control px-control-inset-large font-medium text-density-body outline-none focus-visible:shadow-focus",
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    },
  },
  { twMerge: false },
);
