import { tv } from "tailwind-variants";

export const dockTrigger = tv({
  base: "relative rounded-xl font-normal text-foreground transition-colors hover:bg-accent/60 data-popup-open:bg-accent",
  variants: {
    shape: {
      icon: "size-9",
      label: "h-9 gap-1 px-2.5",
    },
  },
  defaultVariants: {
    shape: "icon",
  },
});

export const dockPopup = tv({
  base: "rounded-xl border-border/60 bg-popover/90 shadow-lg backdrop-blur-xl before:hidden",
});
