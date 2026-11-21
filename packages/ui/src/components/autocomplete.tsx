"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { CloseIcon } from "@solar-icons/react/linear/close";
import { SortVerticalIcon } from "@solar-icons/react/linear/sort-vertical";

import { cn } from "../lib/cn";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";

const Autocomplete = AutocompletePrimitive.Root;

function AutocompleteInput({
  className,
  showTrigger = false,
  showClear = false,
  startAddon,
  size,
  triggerProps,
  clearProps,
  ...props
}: Omit<AutocompletePrimitive.Input.Props, "size"> & {
  showTrigger?: boolean;
  showClear?: boolean;
  startAddon?: React.ReactNode;
  size?: "sm" | "default" | "lg" | number;
  ref?: React.Ref<HTMLInputElement>;
  triggerProps?: AutocompletePrimitive.Trigger.Props;
  clearProps?: AutocompletePrimitive.Clear.Props;
}) {
  const sizeValue = size ?? "default";

  return (
    <div className="relative not-has-[>*.w-full]:w-fit w-full text-foreground has-disabled:opacity-40">
      {startAddon && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center ps-3.5 text-muted-foreground has-[+[data-size=sm]]:ps-3 [&_svg:not([class*='size-'])]:size-5"
          data-slot="autocomplete-start-addon"
        >
          {startAddon}
        </div>
      )}
      <AutocompletePrimitive.Input
        className={cn(
          startAddon &&
            "data-[size=sm]:*:data-[slot=autocomplete-input]:ps-9.5 *:data-[slot=autocomplete-input]:ps-10.5",
          sizeValue === "sm"
            ? "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-10"
            : "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-11",
          className,
        )}
        data-slot="autocomplete-input"
        render={<Input nativeInput size={sizeValue} />}
        {...props}
      />
      {showTrigger && (
        <AutocompleteTrigger
          className={cn(
            "hit-area -translate-y-1/2 absolute top-1/2 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-control text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:shadow-focus has-[+[data-slot=autocomplete-clear]]:hidden [&_svg:not([class*='size-'])]:size-4.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
            sizeValue === "sm" ? "end-1" : "end-1.5",
          )}
          {...triggerProps}
        >
          <AutocompletePrimitive.Icon data-slot="autocomplete-icon">
            <SortVerticalIcon />
          </AutocompletePrimitive.Icon>
        </AutocompleteTrigger>
      )}
      {showClear && (
        <AutocompleteClear
          className={cn(
            "hit-area -translate-y-1/2 absolute top-1/2 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-control text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:shadow-focus has-[+[data-slot=autocomplete-clear]]:hidden [&_svg:not([class*='size-'])]:size-4.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
            sizeValue === "sm" ? "end-1" : "end-1.5",
          )}
          {...clearProps}
        >
          <CloseIcon />
        </AutocompleteClear>
      )}
    </div>
  );
}

function AutocompletePopup({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  alignOffset,
  align = "start",
  anchor,
  ...props
}: AutocompletePrimitive.Popup.Props & {
  align?: AutocompletePrimitive.Positioner.Props["align"];
  sideOffset?: AutocompletePrimitive.Positioner.Props["sideOffset"];
  alignOffset?: AutocompletePrimitive.Positioner.Props["alignOffset"];
  side?: AutocompletePrimitive.Positioner.Props["side"];
  anchor?: AutocompletePrimitive.Positioner.Props["anchor"];
}) {
  return (
    <AutocompletePrimitive.Portal>
      <AutocompletePrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-50 select-none"
        data-slot="autocomplete-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <span
          className={cn(
            "relative flex max-h-full min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-overlay edge bg-popover text-popover-foreground shadow-raised",
            className,
          )}
        >
          <AutocompletePrimitive.Popup
            className="max-h-popup flex flex-1 flex-col text-foreground"
            data-slot="autocomplete-popup"
            {...props}
          >
            {children}
          </AutocompletePrimitive.Popup>
        </span>
      </AutocompletePrimitive.Positioner>
    </AutocompletePrimitive.Portal>
  );
}

function AutocompleteItem({ className, children, ...props }: AutocompletePrimitive.Item.Props) {
  return (
    <AutocompletePrimitive.Item
      className={cn(
        "flex min-h-11 cursor-default select-none items-center rounded-surface px-3.5 py-2.5 text-body outline-none data-disabled:pointer-events-none data-highlighted:bg-muted data-disabled:opacity-40",
        className,
      )}
      data-slot="autocomplete-item"
      {...props}
    >
      {children}
    </AutocompletePrimitive.Item>
  );
}

function AutocompleteSeparator({ className, ...props }: AutocompletePrimitive.Separator.Props) {
  return (
    <AutocompletePrimitive.Separator
      className={cn("mx-3.5 my-1.5 h-px bg-border last:hidden", className)}
      data-slot="autocomplete-separator"
      {...props}
    />
  );
}

function AutocompleteGroup({ className, ...props }: AutocompletePrimitive.Group.Props) {
  return (
    <AutocompletePrimitive.Group
      className={cn("[[role=group]+&]:mt-1.5", className)}
      data-slot="autocomplete-group"
      {...props}
    />
  );
}

function AutocompleteGroupLabel({ className, ...props }: AutocompletePrimitive.GroupLabel.Props) {
  return (
    <AutocompletePrimitive.GroupLabel
      className={cn("px-3.5 pt-2 pb-1 font-semibold text-footnote text-muted-foreground", className)}
      data-slot="autocomplete-group-label"
      {...props}
    />
  );
}

function AutocompleteEmpty({ className, ...props }: AutocompletePrimitive.Empty.Props) {
  return (
    <AutocompletePrimitive.Empty
      className={cn("not-empty:p-3 text-center text-subheadline text-muted-foreground", className)}
      data-slot="autocomplete-empty"
      {...props}
    />
  );
}

function AutocompleteRow({ className, ...props }: AutocompletePrimitive.Row.Props) {
  return <AutocompletePrimitive.Row className={className} data-slot="autocomplete-row" {...props} />;
}

function AutocompleteValue({ ...props }: AutocompletePrimitive.Value.Props) {
  return <AutocompletePrimitive.Value data-slot="autocomplete-value" {...props} />;
}

function AutocompleteList({ className, ...props }: AutocompletePrimitive.List.Props) {
  return (
    <ScrollArea scrollbarGutter scrollFade>
      <AutocompletePrimitive.List
        className={cn("not-empty:scroll-py-1.5 not-empty:p-1.5 in-data-has-overflow-y:pe-3", className)}
        data-slot="autocomplete-list"
        {...props}
      />
    </ScrollArea>
  );
}

function AutocompleteClear({ className, ...props }: AutocompletePrimitive.Clear.Props) {
  return (
    <AutocompletePrimitive.Clear
      className={cn(
        "hit-area -translate-y-1/2 absolute end-1.5 top-1/2 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-control text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:shadow-focus [&_svg:not([class*='size-'])]:size-4.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      data-slot="autocomplete-clear"
      {...props}
    >
      <CloseIcon />
    </AutocompletePrimitive.Clear>
  );
}

function AutocompleteStatus({ className, ...props }: AutocompletePrimitive.Status.Props) {
  return (
    <AutocompletePrimitive.Status
      className={cn("px-3.5 py-2 font-medium text-footnote text-muted-foreground empty:m-0 empty:p-0", className)}
      data-slot="autocomplete-status"
      {...props}
    />
  );
}

function AutocompleteCollection({ ...props }: AutocompletePrimitive.Collection.Props) {
  return <AutocompletePrimitive.Collection data-slot="autocomplete-collection" {...props} />;
}

function AutocompleteTrigger({ className, children, ...props }: AutocompletePrimitive.Trigger.Props) {
  return (
    <AutocompletePrimitive.Trigger className={className} data-slot="autocomplete-trigger" {...props}>
      {children}
    </AutocompletePrimitive.Trigger>
  );
}

const useAutocompleteFilter = AutocompletePrimitive.useFilter;

export {
  Autocomplete,
  AutocompleteInput,
  AutocompleteTrigger,
  AutocompletePopup,
  AutocompleteItem,
  AutocompleteSeparator,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteEmpty,
  AutocompleteValue,
  AutocompleteList,
  AutocompleteClear,
  AutocompleteStatus,
  AutocompleteRow,
  AutocompleteCollection,
  useAutocompleteFilter,
  AutocompletePrimitive,
};
