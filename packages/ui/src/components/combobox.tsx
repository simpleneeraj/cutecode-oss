"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Tick02Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import * as React from "react";

import { cn } from "../lib/cn";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";

const ComboboxContext = React.createContext<{
  chipsRef: React.RefObject<HTMLDivElement | null> | null;
  multiple: boolean;
}>({
  chipsRef: null,
  multiple: false,
});

function Combobox<Value, Multiple extends boolean | undefined = false>(
  props: ComboboxPrimitive.Root.Props<Value, Multiple>,
) {
  const chipsRef = React.useRef<HTMLDivElement | null>(null);
  return (
    <ComboboxContext.Provider value={{ chipsRef, multiple: !!props.multiple }}>
      <ComboboxPrimitive.Root {...props} />
    </ComboboxContext.Provider>
  );
}

function ComboboxChipsInput({
  className,
  size,
  ...props
}: Omit<ComboboxPrimitive.Input.Props, "size"> & {
  size?: "sm" | "default" | "lg" | number;
  ref?: React.Ref<HTMLInputElement>;
}) {
  const sizeValue = size ?? "default";

  return (
    <ComboboxPrimitive.Input
      className={cn(
        "min-w-12 flex-1 bg-transparent text-body outline-none placeholder:text-muted-foreground [[data-slot=combobox-chip]+&]:ps-0.5",
        sizeValue === "sm" ? "ps-1.5" : "ps-2",
        className,
      )}
      data-size={typeof sizeValue === "string" ? sizeValue : undefined}
      data-slot="combobox-chips-input"
      size={typeof sizeValue === "number" ? sizeValue : undefined}
      {...props}
    />
  );
}

function ComboboxInput({
  className,
  showTrigger = true,
  showClear = false,
  startAddon,
  size,
  triggerProps,
  clearProps,
  ...props
}: Omit<ComboboxPrimitive.Input.Props, "size"> & {
  showTrigger?: boolean;
  showClear?: boolean;
  startAddon?: React.ReactNode;
  size?: "sm" | "default" | "lg" | number;
  ref?: React.Ref<HTMLInputElement>;
  triggerProps?: ComboboxPrimitive.Trigger.Props;
  clearProps?: ComboboxPrimitive.Clear.Props;
}) {
  const sizeValue = size ?? "default";

  return (
    <div className="relative not-has-[>*.w-full]:w-fit w-full text-foreground has-disabled:opacity-40">
      {startAddon && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center ps-3.5 text-muted-foreground has-[+[data-size=sm]]:ps-3 [&_svg:not([class*='size-'])]:size-5"
          data-slot="combobox-start-addon"
        >
          {startAddon}
        </div>
      )}
      <ComboboxPrimitive.Input
        className={cn(
          startAddon &&
            "data-[size=sm]:*:data-[slot=combobox-input]:ps-9.5 *:data-[slot=combobox-input]:ps-10.5",
          sizeValue === "sm"
            ? "has-[+[data-slot=combobox-trigger],+[data-slot=combobox-clear]]:*:data-[slot=combobox-input]:pe-10"
            : "has-[+[data-slot=combobox-trigger],+[data-slot=combobox-clear]]:*:data-[slot=combobox-input]:pe-11",
          className,
        )}
        data-slot="combobox-input"
        render={<Input className="has-disabled:opacity-100" nativeInput size={sizeValue} />}
        {...props}
      />
      {showTrigger && (
        <ComboboxTrigger
          className={cn(
            "hit-area -translate-y-1/2 absolute top-1/2 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-control text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:shadow-focus has-[+[data-slot=combobox-clear]]:hidden [&_svg:not([class*='size-'])]:size-4.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
            sizeValue === "sm" ? "end-1" : "end-1.5",
          )}
          {...triggerProps}
        >
          <ComboboxPrimitive.Icon data-slot="combobox-icon">
            <HugeiconsIcon icon={UnfoldMoreIcon} />
          </ComboboxPrimitive.Icon>
        </ComboboxTrigger>
      )}
      {showClear && (
        <ComboboxClear
          className={cn(
            "hit-area -translate-y-1/2 absolute top-1/2 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-control text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:shadow-focus has-[+[data-slot=combobox-clear]]:hidden [&_svg:not([class*='size-'])]:size-4.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
            sizeValue === "sm" ? "end-1" : "end-1.5",
          )}
          {...clearProps}
        >
          <HugeiconsIcon icon={Cancel01Icon} />
        </ComboboxClear>
      )}
    </div>
  );
}

function ComboboxTrigger({ className, children, ...props }: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger className={className} data-slot="combobox-trigger" {...props}>
      {children}
    </ComboboxPrimitive.Trigger>
  );
}

function ComboboxPopup({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  alignOffset,
  align = "start",
  anchor: anchorProp,
  ...props
}: ComboboxPrimitive.Popup.Props & {
  align?: ComboboxPrimitive.Positioner.Props["align"];
  sideOffset?: ComboboxPrimitive.Positioner.Props["sideOffset"];
  alignOffset?: ComboboxPrimitive.Positioner.Props["alignOffset"];
  side?: ComboboxPrimitive.Positioner.Props["side"];
  anchor?: ComboboxPrimitive.Positioner.Props["anchor"];
}) {
  const { chipsRef } = React.useContext(ComboboxContext);
  const anchor = anchorProp ?? chipsRef;

  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-50 select-none"
        data-slot="combobox-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <span
          className={cn(
            "relative flex max-h-full min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-overlay bg-popover text-popover-foreground shadow-raised",
            className,
          )}
        >
          <ComboboxPrimitive.Popup
            className="max-h-popup flex flex-1 flex-col text-foreground"
            data-slot="combobox-popup"
            {...props}
          >
            {children}
          </ComboboxPrimitive.Popup>
        </span>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxItem({ className, children, ...props }: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      className={cn(
        "relative flex min-h-11 in-data-[side=none]:min-w-anchor-inset cursor-default items-center rounded-surface py-2.5 ps-10 pe-3.5 text-body outline-none data-disabled:pointer-events-none data-highlighted:bg-muted data-disabled:opacity-40 [&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      data-slot="combobox-item"
      {...props}
    >
      <ComboboxPrimitive.ItemIndicator className="absolute start-3.5 text-brand">
        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
      </ComboboxPrimitive.ItemIndicator>
      <div className="min-w-0">{children}</div>
    </ComboboxPrimitive.Item>
  );
}

function ComboboxSeparator({ className, ...props }: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      className={cn("mx-3.5 my-1.5 h-px bg-border last:hidden", className)}
      data-slot="combobox-separator"
      {...props}
    />
  );
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      className={cn("[[role=group]+&]:mt-1.5", className)}
      data-slot="combobox-group"
      {...props}
    />
  );
}

function ComboboxGroupLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      className={cn("px-3.5 pt-2 pb-1 font-semibold text-footnote text-muted-foreground", className)}
      data-slot="combobox-group-label"
      {...props}
    />
  );
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      className={cn("not-empty:p-3 text-center text-subheadline text-muted-foreground", className)}
      data-slot="combobox-empty"
      {...props}
    />
  );
}

function ComboboxRow({ className, ...props }: ComboboxPrimitive.Row.Props) {
  return <ComboboxPrimitive.Row className={className} data-slot="combobox-row" {...props} />;
}

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ScrollArea scrollbarGutter scrollFade>
      <ComboboxPrimitive.List
        className={cn("not-empty:scroll-py-1.5 not-empty:p-1.5 in-data-has-overflow-y:pe-3", className)}
        data-slot="combobox-list"
        {...props}
      />
    </ScrollArea>
  );
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return <ComboboxPrimitive.Clear className={className} data-slot="combobox-clear" {...props} />;
}

function ComboboxStatus({ className, ...props }: ComboboxPrimitive.Status.Props) {
  return (
    <ComboboxPrimitive.Status
      className={cn("px-3.5 py-2 font-medium text-footnote text-muted-foreground empty:m-0 empty:p-0", className)}
      data-slot="combobox-status"
      {...props}
    />
  );
}

function ComboboxCollection(props: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />;
}

function ComboboxChips({
  className,
  children,
  startAddon,
  ...props
}: ComboboxPrimitive.Chips.Props & {
  startAddon?: React.ReactNode;
}) {
  const { chipsRef } = React.useContext(ComboboxContext);

  return (
    <ComboboxPrimitive.Chips
      className={cn(
        "relative inline-flex min-h-11 w-full flex-wrap gap-1 rounded-field bg-card p-1.5 text-body text-foreground outline-none inset-ring inset-ring-input transition-shadow *:min-h-8 focus-within:shadow-focus has-disabled:pointer-events-none has-data-[size=lg]:min-h-12 has-aria-invalid:inset-ring-2 has-aria-invalid:inset-ring-destructive-foreground has-autofill:bg-foreground/4 has-disabled:opacity-40",
        className,
      )}
      data-slot="combobox-chips"
      ref={chipsRef}
      {...props}
    >
      {startAddon && (
        <div
          aria-hidden="true"
          className="flex shrink-0 items-center ps-2 text-muted-foreground has-[+[data-slot=combobox-chip]]:pe-1 [&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none"
          data-slot="combobox-start-addon"
        >
          {startAddon}
        </div>
      )}
      {children}
    </ComboboxPrimitive.Chips>
  );
}

function ComboboxChip({
  children,
  removeProps,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  removeProps?: ComboboxPrimitive.ChipRemove.Props;
}) {
  return (
    <ComboboxPrimitive.Chip
      className="flex items-center rounded-control bg-secondary ps-3 font-medium text-footnote text-secondary-foreground outline-none [&_svg:not([class*='size-'])]:size-3.5"
      data-slot="combobox-chip"
      {...props}
    >
      {children}
      <ComboboxChipRemove {...removeProps} />
    </ComboboxPrimitive.Chip>
  );
}

function ComboboxChipRemove(props: ComboboxPrimitive.ChipRemove.Props) {
  return (
    <ComboboxPrimitive.ChipRemove
      aria-label="Remove"
      className="hit-area relative h-full shrink-0 cursor-pointer rounded-control px-2 text-muted-foreground hover:text-foreground [&_svg:not([class*='size-'])]:size-3.5"
      data-slot="combobox-chip-remove"
      {...props}
    >
      <HugeiconsIcon icon={Cancel01Icon} />
    </ComboboxPrimitive.ChipRemove>
  );
}

const useComboboxFilter = ComboboxPrimitive.useFilter;

export {
  Combobox,
  ComboboxChipsInput,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxPopup,
  ComboboxItem,
  ComboboxSeparator,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxEmpty,
  ComboboxValue,
  ComboboxList,
  ComboboxClear,
  ComboboxStatus,
  ComboboxRow,
  ComboboxCollection,
  ComboboxChips,
  ComboboxChip,
  useComboboxFilter,
  ComboboxPrimitive,
};
