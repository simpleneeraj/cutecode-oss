"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { CloseIcon } from "@solar-icons/react/linear/close";
import { SortVerticalIcon } from "@solar-icons/react/linear/sort-vertical";
import { Fragment } from "react";

import { cn } from "../lib/cn";
import { Input } from "./input";
import { popupClassNames } from "./popup-classes";
import { ScrollArea } from "./scroll-area";

const Autocomplete = AutocompletePrimitive.Root;

const autocompleteInputButtonClassName = cn(popupClassNames.inputButton, "has-[+[data-slot=autocomplete-clear]]:hidden");

type AutocompleteInputButtonsProps = {
  showTrigger: boolean;
  showClear: boolean;
  triggerProps?: AutocompletePrimitive.Trigger.Props;
  clearProps?: AutocompletePrimitive.Clear.Props;
};

function AutocompleteInputButtons({ showTrigger, showClear, triggerProps, clearProps }: AutocompleteInputButtonsProps) {
  return (
    <Fragment>
      {showTrigger && (
        <AutocompleteTrigger className={autocompleteInputButtonClassName} {...triggerProps}>
          <AutocompletePrimitive.Icon data-slot="autocomplete-icon">
            <SortVerticalIcon aria-hidden="true" />
          </AutocompletePrimitive.Icon>
        </AutocompleteTrigger>
      )}
      {showClear && (
        <AutocompleteClear aria-label="Clear" className={autocompleteInputButtonClassName} {...clearProps}>
          <CloseIcon aria-hidden="true" />
        </AutocompleteClear>
      )}
    </Fragment>
  );
}

type AutocompleteInputProps = Omit<AutocompletePrimitive.Input.Props, "size"> &
  Partial<AutocompleteInputButtonsProps> & {
    startAddon?: React.ReactNode;
    size?: "sm" | "default" | "lg" | number;
    ref?: React.Ref<HTMLInputElement>;
  };

function AutocompleteInput({
  className,
  showTrigger = false,
  showClear = false,
  startAddon,
  size = "default",
  triggerProps,
  clearProps,
  ...props
}: AutocompleteInputProps) {
  return (
    <div className={popupClassNames.inputShell}>
      {startAddon && (
        <div aria-hidden="true" className={popupClassNames.inputStartAddon} data-slot="autocomplete-start-addon">
          {startAddon}
        </div>
      )}
      <AutocompletePrimitive.Input
        className={cn(
          startAddon && "*:data-[slot=autocomplete-input]:ps-10.5",
          "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-field",
          className,
        )}
        data-slot="autocomplete-input"
        render={<Input nativeInput size={size} />}
        {...props}
      />
      <AutocompleteInputButtons clearProps={clearProps} showClear={showClear} showTrigger={showTrigger} triggerProps={triggerProps} />
    </div>
  );
}

type AutocompletePopupProps = AutocompletePrimitive.Popup.Props &
  Pick<AutocompletePrimitive.Positioner.Props, "align" | "sideOffset" | "alignOffset" | "side" | "anchor">;

function AutocompletePopup({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  alignOffset,
  align = "start",
  anchor,
  ...props
}: AutocompletePopupProps) {
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
            popupClassNames.anchored,
            popupClassNames.glass,
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
        "flex min-h-row cursor-default select-none items-center rounded-density-surface px-row-inset py-1.5 text-density-body outline-none data-disabled:pointer-events-none data-highlighted:bg-foreground/7 data-disabled:opacity-40",
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
      className={cn("mx-row-inset my-1.5 h-px bg-border last:hidden", className)}
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
      className={cn("px-row-inset pt-2 pb-1 font-semibold text-density-footnote text-muted-foreground", className)}
      data-slot="autocomplete-group-label"
      {...props}
    />
  );
}

function AutocompleteEmpty({ className, ...props }: AutocompletePrimitive.Empty.Props) {
  return (
    <AutocompletePrimitive.Empty
      className={cn("not-empty:p-3 text-center text-density-subheadline text-muted-foreground", className)}
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
        "hit-area absolute inset-y-1 end-1 inline-flex aspect-square shrink-0 cursor-pointer items-center justify-center rounded-control text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:shadow-focus [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      data-slot="autocomplete-clear"
      {...props}
    >
      <CloseIcon aria-hidden="true" />
    </AutocompletePrimitive.Clear>
  );
}

function AutocompleteStatus({ className, ...props }: AutocompletePrimitive.Status.Props) {
  return (
    <AutocompletePrimitive.Status
      className={cn("px-row-inset py-2 font-medium text-density-footnote text-muted-foreground empty:m-0 empty:p-0", className)}
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
