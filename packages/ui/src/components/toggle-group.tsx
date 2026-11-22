"use client";

import type { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import type { VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { cn } from "../lib/cn";
import { motion as motionTokens } from "../tokens/motion";
import { Separator } from "./separator";
import { Toggle as ToggleComponent, type toggleVariants } from "./toggle";

type ToggleGroupContextValue = VariantProps<typeof toggleVariants> & {
  thumbId?: string;
};

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  size: "default",
  variant: "default",
});

const instantTransition = { duration: 0 };

function SegmentThumb({ thumbId }: { thumbId?: string }) {
  const isReducedMotion = useReducedMotion();
  const transition = isReducedMotion ? instantTransition : motionTokens.springSnappy;

  return (
    <motion.span
      aria-hidden="true"
      className="-z-10 pointer-events-none absolute inset-0 rounded-control-inner bg-segment-thumb shadow-thumb"
      layoutId={thumbId}
      transition={transition}
    />
  );
}

function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  orientation = "horizontal",
  multiple,
  children,
  ...props
}: ToggleGroupPrimitive.Props & VariantProps<typeof toggleVariants>) {
  const groupId = React.useId();
  const thumbId = multiple ? undefined : `${groupId}-thumb`;

  return (
    <ToggleGroupPrimitive
      className={cn(
        "isolate flex w-fit items-center gap-0.5 rounded-control bg-secondary p-0.5",
        orientation === "vertical" && "flex-col",
        className,
      )}
      data-size={size}
      data-slot="toggle-group"
      data-variant={variant}
      multiple={multiple}
      orientation={orientation}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ size, variant, thumbId }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

function Toggle({
  className,
  children,
  variant,
  size,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);

  const resolvedVariant = context.variant || variant;
  const resolvedSize = context.size || size;

  return (
    <ToggleComponent
      className={className}
      data-size={resolvedSize}
      data-variant={resolvedVariant}
      render={(buttonProps, state) => (
        <button {...buttonProps} type="button">
          {state.pressed ? <SegmentThumb thumbId={context.thumbId} /> : null}
          {buttonProps.children}
        </button>
      )}
      size={resolvedSize}
      variant={resolvedVariant}
      {...props}
    >
      {children}
    </ToggleComponent>
  );
}

function ToggleGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: {
  className?: string;
} & React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn("pointer-events-none mx-0.5 my-2 bg-border", className)}
      orientation={orientation}
      {...props}
    />
  );
}

export { ToggleGroup, Toggle, Toggle as ToggleGroupItem, ToggleGroupSeparator, ToggleGroupPrimitive };
