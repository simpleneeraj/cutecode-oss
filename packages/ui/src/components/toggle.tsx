"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

const toggleVariants = cva(
  "hit-area press relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-control font-medium text-subheadline text-foreground outline-none hover:bg-muted focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-40 data-pressed:bg-brand-soft data-pressed:text-brand-ink in-data-[slot=toggle-group]:hover:bg-transparent in-data-[slot=toggle-group]:data-pressed:bg-segment-thumb in-data-[slot=toggle-group]:data-pressed:text-foreground in-data-[slot=toggle-group]:data-pressed:shadow-thumb in-data-[slot=toggle-group]:focus-visible:shadow-focus [&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-11 min-w-11 px-3 in-data-[slot=toggle-group]:h-9.5 in-data-[slot=toggle-group]:min-w-9.5",
        lg: "h-12.5 min-w-12.5 px-4 in-data-[slot=toggle-group]:h-11 in-data-[slot=toggle-group]:min-w-11",
        sm: "h-8.5 min-w-8.5 px-2.5 in-data-[slot=toggle-group]:h-7.5 in-data-[slot=toggle-group]:min-w-7.5 [&_svg:not([class*='size-'])]:size-4.25",
      },
      variant: {
        default: "",
        outline: "bg-secondary in-data-[slot=toggle-group]:bg-transparent",
      },
    },
  },
);

function Toggle({ className, variant, size, ...props }: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return <TogglePrimitive className={cn(toggleVariants({ className, size, variant }))} data-slot="toggle" {...props} />;
}

export { Toggle, toggleVariants, TogglePrimitive };
