import { tv } from "tailwind-variants";

export const neckPaths = {
  primary: "M0 0C6 0 9 13 12 13V31C9 31 6 44 0 44Z",
  secondary: "M24 0C18 0 15 13 12 13V31C15 31 18 44 24 44Z",
};

export const buttonPairStyles = tv(
  {
    slots: {
      root: "inline-flex items-center",
      button:
        "press relative z-10 inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-control px-5 font-semibold text-subheadline outline-none focus-visible:shadow-focus",
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      neck: "-mx-3 h-11 w-6 shrink-0",
      primaryNeck: "fill-primary",
      secondaryNeck: "fill-secondary",
    },
  },
  { twMerge: false },
);
