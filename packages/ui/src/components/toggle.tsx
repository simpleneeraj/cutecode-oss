"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

const toggleVariants = cva(
  "hit-area press relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-density-control font-medium text-density-body text-foreground outline-none hover:bg-muted focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-64 data-pressed:bg-brand-soft data-pressed:text-brand-ink in-data-[slot=toggle-group]:gap-1.5 in-data-[slot=toggle-group]:rounded-control-inner in-data-[slot=toggle-group]:text-muted-foreground in-data-[slot=toggle-group]:hover:bg-transparent in-data-[slot=toggle-group]:hover:text-foreground in-data-[slot=toggle-group]:data-pressed:bg-transparent in-data-[slot=toggle-group]:data-pressed:text-foreground [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-control-medium min-w-control-medium px-2 in-data-[slot=toggle-group]:h-field in-data-[slot=toggle-group]:min-w-field in-data-[slot=toggle-group]:px-2.5",
        lg: "h-control-large min-w-control-large px-2.5 in-data-[slot=toggle-group]:h-9.5 in-data-[slot=toggle-group]:min-w-9.5 in-data-[slot=toggle-group]:px-3 sm:in-data-[slot=toggle-group]:h-8.5 sm:in-data-[slot=toggle-group]:min-w-8.5",
        sm: "h-control-small min-w-control-small px-1.5 in-data-[slot=toggle-group]:h-7.5 in-data-[slot=toggle-group]:min-w-7.5 in-data-[slot=toggle-group]:px-2 sm:in-data-[slot=toggle-group]:h-6.5 sm:in-data-[slot=toggle-group]:min-w-6.5",
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
