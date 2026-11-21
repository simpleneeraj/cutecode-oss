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
            "relative inline-flex w-full rounded-field edge bg-card text-body text-foreground inset-ring inset-ring-input transition-shadow has-focus-visible:shadow-focus has-aria-invalid:inset-ring-2 has-aria-invalid:inset-ring-destructive-foreground has-disabled:opacity-40",
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
              "field-sizing-content min-h-24 w-full rounded-inherit bg-transparent px-3.5 py-3 outline-none placeholder:text-muted-foreground",
              size === "sm" && "min-h-20 px-3 py-2.5",
              size === "lg" && "min-h-28 px-4 py-3.5",
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
