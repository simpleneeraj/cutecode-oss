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
  destructive: "bg-pink text-destructive-foreground hover:bg-pink/80 data-pressed:bg-pink/80",
};

const buttonVariants = cva(
  "hit-area press relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-control font-semibold text-body outline-none focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-40 [&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-11 px-5",
        icon: "size-11",
        "icon-lg": "size-12.5",
        "icon-sm": "size-8.5 [&_svg:not([class*='size-'])]:size-4.25",
        "icon-xl": "size-14 [&_svg:not([class*='size-'])]:size-6",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-12.5 px-6",
        sm: "h-8.5 gap-1 px-3.5 text-subheadline [&_svg:not([class*='size-'])]:size-4.25",
        xl: "h-14 px-7 [&_svg:not([class*='size-'])]:size-6",
        xs: "h-7 gap-1 px-3 text-footnote [&_svg:not([class*='size-'])]:size-4",
      },
      variant: {
        default: buttonTones.filled,
        filled: buttonTones.filled,
        secondary: buttonTones.gray,
        gray: buttonTones.gray,
        outline: "bg-card text-foreground shadow-rest hover:bg-accent data-pressed:bg-accent",
        tinted: buttonTones.tinted,
        plain: buttonTones.plain,
        ghost: "text-foreground hover:bg-muted data-pressed:bg-muted",
        link: "text-brand-ink underline-offset-4 hover:underline data-pressed:underline",
        glass: buttonTones.glass,
        destructive: buttonTones.destructive,
        "destructive-outline": "text-destructive-foreground hover:bg-pink data-pressed:bg-pink",
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
