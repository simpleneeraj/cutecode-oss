"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";

import { cn } from "../lib/cn";

type InputProps = Omit<InputPrimitive.Props & React.RefAttributes<HTMLInputElement>, "size"> & {
  size?: "sm" | "default" | "lg" | number;
  unstyled?: boolean;
  nativeInput?: boolean;
};

const inputControlClassName =
  "relative inline-flex w-full rounded-density-field edge bg-card text-density-body text-foreground inset-ring inset-ring-input transition-shadow in-data-[slot=toolbar]:rounded-control has-focus-visible:shadow-focus has-aria-invalid:inset-ring-2 has-aria-invalid:inset-ring-destructive-foreground has-autofill:bg-foreground/4 has-disabled:opacity-40";

function Input({ className, size = "default", unstyled = false, nativeInput = false, style, ...props }: InputProps) {
  const inputClassName = cn(
    "autofill-steady h-field w-full min-w-0 rounded-inherit bg-transparent px-row-inset outline-none placeholder:text-muted-foreground",
    size === "lg" && "h-control-large px-control-inset-small",
    props.type === "search" &&
      "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
    props.type === "file" &&
      "text-muted-foreground file:me-3 file:bg-transparent file:font-semibold file:text-foreground file:text-density-subheadline",
  );

  return (
    <span
      className={
        cn(
          !unstyled && inputControlClassName,
          !unstyled && props.type === "search" && "rounded-control bg-muted inset-ring-0",
          className,
        ) || undefined
      }
      data-size={size}
      data-slot="input-control"
    >
      {nativeInput ? (
        <input
          className={inputClassName}
          data-slot="input"
          size={typeof size === "number" ? size : undefined}
          style={typeof style === "function" ? undefined : style}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      ) : (
        <InputPrimitive
          className={inputClassName}
          data-slot="input"
          size={typeof size === "number" ? size : undefined}
          style={style}
          {...props}
        />
      )}
    </span>
  );
}

export { Input, type InputProps, InputPrimitive };
