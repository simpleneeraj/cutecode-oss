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
import { popupClassNames } from "./popup-classes";

const Select = SelectPrimitive.Root;

const selectTriggerVariants = cva(
  "hit-area relative inline-flex min-h-control-medium w-full min-w-36 cursor-pointer select-none items-center justify-between gap-2 rounded-density-field edge bg-card px-control-inset-medium text-left text-density-body text-foreground outline-none inset-ring inset-ring-input transition-shadow in-data-[slot=toolbar]:rounded-control focus-visible:shadow-focus aria-invalid:inset-ring-destructive-foreground data-disabled:pointer-events-none data-disabled:opacity-64 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
    },
    variants: {
      size: {
        default: "",
        lg: "min-h-control-large",
        sm: "min-h-control-small gap-1.5 px-control-inset-small",
      },
    },
  },
);

const selectTriggerIconClassName = "-me-1 size-4.5 text-muted-foreground sm:size-4";

type SelectButtonProps = useRender.ComponentProps<"button"> & {
  size?: VariantProps<typeof selectTriggerVariants>["size"];
};

function SelectButton({ className, size, render, children, ...props }: SelectButtonProps) {
  const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] = render ? undefined : "button";

  const defaultProps = {
    children: (
      <Fragment>
        <span className="flex-1 truncate in-data-placeholder:text-muted-foreground">{children}</span>
        <SortVerticalIcon aria-hidden="true" className={selectTriggerIconClassName} />
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
        <SortVerticalIcon aria-hidden="true" className={selectTriggerIconClassName} />
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

function SelectScrollUpArrow() {
  return (
    <SelectPrimitive.ScrollUpArrow
      className="top-0 z-50 flex h-6 w-full cursor-default items-center justify-center"
      data-slot="select-scroll-up-arrow"
    >
      <AltArrowUpIcon aria-hidden="true" className="relative size-4.5 sm:size-4" />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownArrow() {
  return (
    <SelectPrimitive.ScrollDownArrow
      className="bottom-0 z-50 flex h-6 w-full cursor-default items-center justify-center"
      data-slot="select-scroll-down-arrow"
    >
      <AltArrowDownIcon aria-hidden="true" className="relative size-4.5 sm:size-4" />
    </SelectPrimitive.ScrollDownArrow>
  );
}

type SelectPopupProps = SelectPrimitive.Popup.Props &
  Pick<SelectPrimitive.Positioner.Props, "side" | "sideOffset" | "align" | "alignOffset" | "alignItemWithTrigger" | "anchor">;

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
}: SelectPopupProps) {
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
          className="group/select-popup origin-(--transform-origin) text-foreground outline-none"
          data-slot="select-popup"
          {...props}
        >
          <SelectScrollUpArrow />
          <div className={cn("relative h-full min-w-(--anchor-width) overflow-hidden", popupClassNames.glass)}>
            <SelectPrimitive.List
              className={cn(
                "scroll-arrow-fade max-h-(--available-height) overflow-y-auto p-1 group-has-data-[slot=select-scroll-down-arrow]/select-popup:mask-b-from-(--arrow-fade) group-has-data-[slot=select-scroll-up-arrow]/select-popup:mask-t-from-(--arrow-fade)",
                className,
              )}
              data-slot="select-list"
            >
              {children}
            </SelectPrimitive.List>
          </div>
          <SelectScrollDownArrow />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "grid min-h-row in-data-[side=none]:min-w-anchor-inset cursor-default grid-cols-[1rem_minmax(0,1fr)] items-center gap-2 rounded-density-control py-1 ps-row-inset pe-4 text-density-body outline-none data-disabled:pointer-events-none data-highlighted:bg-foreground/7 data-disabled:opacity-64 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      data-slot="select-item"
      {...props}
    >
      <SelectPrimitive.ItemIndicator className="col-start-1 text-foreground">
        <CheckIcon aria-hidden="true" strokeWidth={2} />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText className="wrap-anywhere col-start-2 min-w-0">{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      className={cn("mx-row-inset my-1 h-px bg-border", className)}
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
      className="px-row-inset py-1.5 font-medium text-density-footnote text-muted-foreground"
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
