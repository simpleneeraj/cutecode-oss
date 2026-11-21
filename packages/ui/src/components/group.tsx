"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../lib/cn";
import { Separator } from "./separator";

const groupVariants = cva(
  "flex w-fit *:focus-visible:z-1 has-[>[data-slot=group]]:gap-2 *:has-focus-visible:z-1",
  {
    defaultVariants: {
      orientation: "horizontal",
    },
    variants: {
      orientation: {
        horizontal:
          "*:data-slot:has-[~[data-slot]]:rounded-e-none *:[[data-slot]~[data-slot]]:rounded-s-none",
        vertical:
          "flex-col *:data-slot:has-[~[data-slot]]:rounded-b-none *:[[data-slot]~[data-slot]]:rounded-t-none",
      },
    },
  },
);

function Group({
  className,
  orientation,
  children,
  ...props
}: {
  className?: string;
  orientation?: VariantProps<typeof groupVariants>["orientation"];
  children: React.ReactNode;
} & React.ComponentProps<"div">) {
  return (
    <div
      className={cn(groupVariants({ orientation }), className)}
      data-orientation={orientation}
      data-slot="group"
      role="group"
      {...props}
    >
      {children}
    </div>
  );
}

function GroupText({ className, render, ...props }: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn(
      "relative inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-field bg-muted px-3.5 text-body text-muted-foreground outline-none [&_svg:not([class*='size-'])]:size-5 [&_svg]:shrink-0",
      className,
    ),
    "data-slot": "group-text",
  };
  return useRender({
    defaultTagName: "div",
    props: mergeProps(defaultProps, props),
    render,
  });
}

function GroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: {
  className?: string;
} & React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn(
        "pointer-events-none relative z-2 bg-border",
        className,
      )}
      orientation={orientation}
      {...props}
    />
  );
}

export {
  Group,
  Group as ButtonGroup,
  GroupText,
  GroupText as ButtonGroupText,
  GroupSeparator,
  GroupSeparator as ButtonGroupSeparator,
  groupVariants,
};
