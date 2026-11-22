"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../lib/cn";

const buttonTones = {
  filled: "bg-primary text-primary-foreground hover:bg-primary/90 data-pressed:bg-primary/90",
  gray: "bg-secondary text-secondary-foreground hover:bg-secondary/80 data-pressed:bg-secondary/80",
  tinted: "bg-brand-soft text-brand-ink hover:bg-brand-soft/80 data-pressed:bg-brand-soft/80",
  plain: "text-brand-ink hover:bg-muted data-pressed:bg-muted",
  glass: "glass text-foreground shadow-glass",
  destructive: "bg-destructive-soft text-destructive-foreground hover:bg-destructive-soft/80 data-pressed:bg-destructive-soft/80",
};

const buttonVariants = cva(
  "hit-area press relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium text-density-body outline-none focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-64 aria-disabled:pointer-events-none aria-disabled:opacity-64 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-control-medium px-control-inset-medium",
        icon: "size-control-medium",
        "icon-lg": "size-control-large",
        "icon-sm": "size-control-small",
        "icon-xl": "size-11 sm:size-10 [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5",
        "icon-xs": "size-7 rounded-lg sm:size-6 [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-control-large px-control-inset-large",
        sm: "h-control-small gap-1.5 px-control-inset-small",
        xl: "h-11 px-4 text-lg sm:h-10 sm:text-base [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5",
        xs: "h-7 gap-1 rounded-lg px-2 text-sm sm:h-6 sm:text-xs [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5",
      },
      variant: {
        default: buttonTones.filled,
        filled: buttonTones.filled,
        secondary: buttonTones.gray,
        gray: buttonTones.gray,
        outline: "bg-card edge text-foreground shadow-rest hover:bg-accent data-pressed:bg-accent",
        tinted: buttonTones.tinted,
        plain: buttonTones.plain,
        ghost: "text-foreground hover:bg-muted data-pressed:bg-muted",
        link: "text-brand-ink underline-offset-4 hover:underline data-pressed:underline",
        glass: buttonTones.glass,
        destructive: buttonTones.destructive,
        "destructive-outline": "text-destructive-foreground hover:bg-destructive-soft data-pressed:bg-destructive-soft",
      },
    },
  },
);

type ButtonProps = useRender.ComponentProps<"button"> & {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
};

function Button({ className, variant, size, render, ...props }: ButtonProps) {
  const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] = render ? undefined : "button";

  const defaultProps = {
    className: cn(buttonVariants({ className, size, variant })),
    "data-slot": "button",
    type: typeValue,
  };

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  });
}

export { Button, buttonVariants };
