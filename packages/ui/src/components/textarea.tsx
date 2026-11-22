"use client";

import { Field as FieldPrimitive } from "@base-ui/react/field";
import { mergeProps } from "@base-ui/react/merge-props";
import type * as React from "react";

import { cn } from "../lib/cn";

type TextareaProps = React.ComponentProps<"textarea"> & {
  size?: "sm" | "default" | "lg" | number;
  unstyled?: boolean;
};

function Textarea({ className, size = "default", unstyled = false, ...props }: TextareaProps) {
  return (
    <span
      className={
        cn(
          !unstyled &&
            "relative inline-grid w-full rounded-density-field edge bg-card text-density-body text-foreground inset-ring inset-ring-input transition-shadow has-focus-visible:shadow-focus has-aria-invalid:inset-ring-destructive/36 has-focus-visible:has-aria-invalid:inset-ring-destructive/64 has-disabled:opacity-64",
          className,
        ) || undefined
      }
      data-size={size}
      data-slot="textarea-control"
    >
      <FieldPrimitive.Control
        render={(defaultProps) => (
          <textarea
            className={cn(
              "field-sizing-content min-h-20.5 w-full rounded-inherit bg-transparent px-control-inset-medium py-1.5 outline-none placeholder:text-muted-foreground/72 sm:min-h-17.5",
              size === "sm" && "min-h-19.5 px-control-inset-small py-1 sm:min-h-16.5",
              size === "lg" && "min-h-21.5 py-2 sm:min-h-18.5",
            )}
            data-slot="textarea"
            {...mergeProps(defaultProps, props)}
          />
        )}
      />
    </span>
  );
}

export { Textarea, type TextareaProps, FieldPrimitive };
