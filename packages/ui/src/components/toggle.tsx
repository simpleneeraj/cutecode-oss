"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

const toggleVariants = cva(
  "hit-area press relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-density-control font-medium text-density-subheadline text-foreground outline-none hover:bg-muted focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-40 data-pressed:bg-brand-soft data-pressed:text-brand-ink in-data-[slot=toggle-group]:rounded-control in-data-[slot=toggle-group]:font-semibold in-data-[slot=toggle-group]:text-footnote in-data-[slot=toggle-group]:hover:bg-transparent in-data-[slot=toggle-group]:data-pressed:bg-transparent in-data-[slot=toggle-group]:data-pressed:text-foreground in-data-[slot=toggle-group]:focus-visible:shadow-focus [&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-control-medium min-w-control-medium px-3 in-data-[slot=toggle-group]:h-8 in-data-[slot=toggle-group]:min-w-8",
        lg: "h-control-large min-w-control-large px-4 in-data-[slot=toggle-group]:h-10 in-data-[slot=toggle-group]:min-w-10",
        sm: "h-control-small min-w-control-small px-2.5 in-data-[slot=toggle-group]:h-7 in-data-[slot=toggle-group]:min-w-7 [&_svg:not([class*='size-'])]:size-4.25",
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
