"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { AltArrowDownIcon } from "@solar-icons/react/linear/alt-arrow-down";
import { AltArrowUpIcon } from "@solar-icons/react/linear/alt-arrow-up";
import { CheckIcon } from "@solar-icons/react/linear/check";
import { SortVerticalIcon } from "@solar-icons/react/linear/sort-vertical";
import { Fragment } from "react";
import type * as React from "react";

import { cn } from "../lib/cn";

const Select = SelectPrimitive.Root;

const selectTriggerVariants = cva(
  "relative inline-flex min-h-11 w-full min-w-36 cursor-pointer select-none items-center justify-between gap-2 rounded-field edge bg-card px-3.5 text-left text-body text-foreground outline-none inset-ring inset-ring-input transition-shadow in-data-[slot=toolbar]:rounded-control focus-visible:shadow-focus aria-invalid:inset-ring-2 aria-invalid:inset-ring-destructive-foreground data-disabled:pointer-events-none data-disabled:opacity-40 [&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
    },
    variants: {
      size: {
        default: "",
        lg: "min-h-12 px-4",
        sm: "gap-1.5 px-3",
      },
    },
  },
);

const selectTriggerIconClassName = "-me-1 size-4.5 text-muted-foreground";

type SelectButtonProps = useRender.ComponentProps<"button"> & {
  size?: VariantProps<typeof selectTriggerVariants>["size"];
};

function SelectButton({ className, size, render, children, ...props }: SelectButtonProps) {
  const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] = render ? undefined : "button";

  const defaultProps = {
    children: (
      <Fragment>
        <span className="flex-1 truncate in-data-placeholder:text-muted-foreground">{children}</span>
        <SortVerticalIcon className={selectTriggerIconClassName} />
      </Fragment>
    ),
    className: cn(selectTriggerVariants({ size }), "min-w-0", className),
    "data-slot": "select-button",
    type: typeValue,
  };

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  });
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & VariantProps<typeof selectTriggerVariants>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(selectTriggerVariants({ size }), className)}
      data-slot="select-trigger"
      {...props}
    >
      {children}
      <SelectPrimitive.Icon data-slot="select-icon">
        <SortVerticalIcon className={selectTriggerIconClassName} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      className={cn("flex-1 truncate data-placeholder:text-muted-foreground", className)}
      data-slot="select-value"
      {...props}
    />
  );
}

function SelectPopup({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  alignItemWithTrigger = true,
  anchor,
  ...props
}: SelectPrimitive.Popup.Props & {
  side?: SelectPrimitive.Positioner.Props["side"];
  sideOffset?: SelectPrimitive.Positioner.Props["sideOffset"];
  align?: SelectPrimitive.Positioner.Props["align"];
  alignOffset?: SelectPrimitive.Positioner.Props["alignOffset"];
  alignItemWithTrigger?: SelectPrimitive.Positioner.Props["alignItemWithTrigger"];
  anchor?: SelectPrimitive.Positioner.Props["anchor"];
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        align={align}
        alignItemWithTrigger={alignItemWithTrigger}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-50 select-none"
        data-slot="select-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <SelectPrimitive.Popup
          className="origin-(--transform-origin) text-foreground"
          data-slot="select-popup"
          {...props}
        >
          <SelectPrimitive.ScrollUpArrow
            className="top-0 z-50 flex h-7 w-full cursor-default items-center justify-center before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-full before:rounded-t-overlay before:bg-linear-to-b before:from-50% before:from-popover"
            data-slot="select-scroll-up-arrow"
          >
            <AltArrowUpIcon className="relative size-4" />
          </SelectPrimitive.ScrollUpArrow>
          <div className="relative h-full min-w-(--anchor-width) overflow-hidden rounded-overlay edge bg-popover text-popover-foreground shadow-raised">
            <SelectPrimitive.List
              className={cn("max-h-(--available-height) overflow-y-auto p-1.5", className)}
              data-slot="select-list"
            >
              {children}
            </SelectPrimitive.List>
          </div>
          <SelectPrimitive.ScrollDownArrow
            className="bottom-0 z-50 flex h-7 w-full cursor-default items-center justify-center before:pointer-events-none before:absolute before:inset-x-0 before:bottom-0 before:h-full before:rounded-b-overlay before:bg-linear-to-t before:from-50% before:from-popover"
            data-slot="select-scroll-down-arrow"
          >
            <AltArrowDownIcon className="relative size-4" />
          </SelectPrimitive.ScrollDownArrow>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex min-h-11 in-data-[side=none]:min-w-anchor-inset cursor-default items-center rounded-surface py-2.5 ps-10 pe-3.5 text-body outline-none data-disabled:pointer-events-none data-highlighted:bg-muted data-disabled:opacity-40 [&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      data-slot="select-item"
      {...props}
    >
      <SelectPrimitive.ItemIndicator className="absolute start-3.5 text-brand">
        <CheckIcon strokeWidth={2} />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText className="min-w-0">{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      className={cn("mx-3.5 my-1.5 h-px bg-border", className)}
      data-slot="select-separator"
      {...props}
    />
  );
}

function SelectGroup(props: SelectPrimitive.Group.Props) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectGroupLabel(props: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      className="px-3.5 pt-2 pb-1 font-semibold text-footnote text-muted-foreground"
      data-slot="select-group-label"
      {...props}
    />
  );
}

export {
  Select,
  SelectTrigger,
  SelectButton,
  selectTriggerVariants,
  SelectValue,
  SelectPopup,
  SelectPopup as SelectContent,
  SelectItem,
  SelectSeparator,
  SelectGroup,
  SelectGroupLabel,
  SelectPrimitive,
};
