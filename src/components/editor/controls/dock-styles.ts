import { tv } from "tailwind-variants";

export const dockTrigger = tv({
  base: [
    "relative rounded-xl font-normal text-foreground transition-colors hover:bg-accent/60 data-popup-open:bg-accent",
    "max-sm:h-12 max-sm:w-auto max-sm:min-w-12 max-sm:flex-1 max-sm:flex-col max-sm:justify-center max-sm:gap-1 max-sm:px-1",
  ],
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

export const dockLabel = tv({
  base: "text-[10px] leading-none text-muted-foreground sm:hidden",
});

export const dockPopup = tv({
  base: "rounded-xl border-border/60 bg-popover/90 shadow-lg backdrop-blur-xl before:hidden",
});
