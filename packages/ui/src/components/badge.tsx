"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

const badgeVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-control font-semibold outline-none focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-40 [&_svg:not([class*='size-'])]:size-3.25 [&_svg]:pointer-events-none [&_svg]:shrink-0 [button&,a&]:hit-area [button&,a&]:press [button&,a&]:cursor-pointer",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-6 min-w-6 px-2.5 text-caption1",
        lg: "h-8 min-w-8 gap-1.5 px-3.5 text-subheadline",
        sm: "h-5 min-w-5 px-2 text-caption1",
      },
      variant: {
        default: "bg-primary text-primary-foreground [button&,a&]:hover:bg-primary/90",
        destructive: "bg-destructive text-on-fill [button&,a&]:hover:bg-destructive/90",
        error: "bg-pink text-destructive-foreground",
        info: "bg-blue text-blue-ink",
        outline: "bg-card text-foreground shadow-rest [button&,a&]:hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground [button&,a&]:hover:bg-secondary/80",
        success: "bg-green text-green-ink",
        warning: "bg-orange text-orange-ink",
      },
    },
  },
);

type BadgeProps = useRender.ComponentProps<"span"> & {
  variant?: VariantProps<typeof badgeVariants>["variant"];
  size?: VariantProps<typeof badgeVariants>["size"];
};

function Badge({ className, variant, size, render, ...props }: BadgeProps) {
  const defaultProps = {
    className: cn(badgeVariants({ className, size, variant })),
    "data-slot": "badge",
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}

export { Badge, badgeVariants };
