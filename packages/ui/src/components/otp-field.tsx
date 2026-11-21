"use client";

import { cn } from "../lib/cn";
import type * as React from "react";
import { Separator } from "./separator";
import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field";

export function OTPField({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof OTPFieldPrimitive.Root> & {
  size?: "default" | "lg";
}): React.ReactElement {
  return (
    <OTPFieldPrimitive.Root
      className={cn(
        "flex items-center gap-2 has-disabled:opacity-40",
        className,
      )}
      data-size={size}
      data-slot="otp-field"
      {...props}
    />
  );
}

export function OTPFieldInput({
  className,
  ...props
}: React.ComponentProps<typeof OTPFieldPrimitive.Input>): React.ReactElement {
  return (
    <OTPFieldPrimitive.Input
      className={cn(
        "relative size-11 min-w-0 rounded-field bg-card text-center text-body text-foreground outline-none inset-ring inset-ring-input transition-shadow in-[[data-slot=otp-field][data-size=lg]]:size-12 in-[[data-slot=otp-field][data-size=lg]]:text-title3 focus-visible:z-10 focus-visible:shadow-focus aria-invalid:inset-ring-2 aria-invalid:inset-ring-destructive-foreground",
        className,
      )}
      data-slot="otp-field-input"
      spellCheck={false}
      {...props}
    />
  );
}

export function OTPFieldSeparator({ className, ...props }: React.ComponentProps<typeof Separator>): React.ReactElement {
  return (
    <OTPFieldPrimitive.Separator
      render={
        <Separator
          className={cn(
            "rounded-control bg-input data-[orientation=horizontal]:h-0.5 data-[orientation=horizontal]:w-3",
            className,
          )}
          orientation="horizontal"
          {...props}
        />
      }
    />
  );
}

export { OTPFieldPrimitive };
