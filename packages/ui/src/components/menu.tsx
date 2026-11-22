"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { CheckIcon } from "@solar-icons/react/linear/check";
import { Fragment } from "react";
import type * as React from "react";

import { cn } from "../lib/cn";
import { popupClassNames } from "./popup-classes";

const MenuCreateHandle = MenuPrimitive.createHandle;

const Menu = MenuPrimitive.Root;

const MenuPortal = MenuPrimitive.Portal;

function MenuTrigger({ className, children, ...props }: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger className={className} data-slot="menu-trigger" {...props}>
      {children}
    </MenuPrimitive.Trigger>
  );
}

function MenuPopup({
  children,
  className,
  sideOffset = 4,
  align = "center",
  alignOffset,
  side = "bottom",
  anchor,
  ...props
}: MenuPrimitive.Popup.Props & {
  align?: MenuPrimitive.Positioner.Props["align"];
  sideOffset?: MenuPrimitive.Positioner.Props["sideOffset"];
  alignOffset?: MenuPrimitive.Positioner.Props["alignOffset"];
  side?: MenuPrimitive.Positioner.Props["side"];
  anchor?: MenuPrimitive.Positioner.Props["anchor"];
}) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-50"
        data-slot="menu-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          className={cn(
            popupClassNames.glass,
            "relative flex not-[class*='w-']:min-w-32 origin-(--transform-origin) overflow-hidden outline-none transition-popup data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
            className,
          )}
          data-slot="menu-popup"
          {...props}
        >
          <div className="max-h-(--available-height) w-full overflow-y-auto p-1">{children}</div>
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function MenuGroup(props: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="menu-group" {...props} />;
}

function MenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenuPrimitive.Item
      className={cn(
        "flex min-h-row cursor-default select-none items-center gap-2 rounded-md px-row-inset py-1 text-density-body text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-foreground/7 data-inset:ps-8 data-[variant=destructive]:text-destructive-foreground data-[variant=destructive]:data-highlighted:bg-destructive-soft data-disabled:opacity-64 [&>svg:not([class*='opacity-'])]:opacity-80 [&>svg:not([class*='size-'])]:size-4.5 sm:[&>svg:not([class*='size-'])]:size-4 [&>svg]:pointer-events-none [&>svg]:-mx-0.5 [&>svg]:shrink-0",
        className,
      )}
      data-inset={inset}
      data-slot="menu-item"
      data-variant={variant}
      {...props}
    />
  );
}

function MenuCheckboxItem({
  className,
  children,
  checked,
  variant = "default",
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  variant?: "default" | "switch";
}) {
  return (
    <MenuPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        "relative flex min-h-row in-data-[side=none]:min-w-anchor-inset cursor-default items-center gap-2 rounded-md py-1 text-density-body text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-foreground/7 data-disabled:opacity-64 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        variant === "switch" ? "justify-between gap-4 ps-row-inset pe-1.5" : "ps-7 pe-4",
        className,
      )}
      data-slot="menu-checkbox-item"
      {...props}
    >
      {variant === "switch" ? (
        <Fragment>
          <span>{children}</span>
          <MenuPrimitive.CheckboxItemIndicator
            className="inline-flex h-4.5 w-7.5 shrink-0 items-center rounded-full bg-muted p-px sm:h-3.5 sm:w-5.5 transition-colors duration-color ease-out data-checked:bg-brand motion-reduce:transition-none"
            keepMounted
          >
            <span className="pointer-events-none block size-4 origin-left rounded-full bg-on-fill shadow-thumb transition-transform duration-snappy ease-snappy sm:size-3 in-[[data-slot=menu-checkbox-item][data-checked]]:origin-right in-[[data-slot=menu-checkbox-item][data-checked]]:translate-x-3 sm:in-[[data-slot=menu-checkbox-item][data-checked]]:translate-x-2 in-[[data-slot=menu-checkbox-item]:active]:scale-x-110 motion-reduce:transition-none" />
          </MenuPrimitive.CheckboxItemIndicator>
        </Fragment>
      ) : (
        <Fragment>
          <MenuPrimitive.CheckboxItemIndicator className="absolute start-row-inset text-foreground">
            <CheckIcon aria-hidden="true" strokeWidth={2} />
          </MenuPrimitive.CheckboxItemIndicator>
          <span>{children}</span>
        </Fragment>
      )}
    </MenuPrimitive.CheckboxItem>
  );
}

function MenuRadioGroup(props: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="menu-radio-group" {...props} />;
}

function MenuRadioItem({ className, children, ...props }: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      className={cn(
        "relative flex min-h-row in-data-[side=none]:min-w-anchor-inset cursor-default items-center gap-2 rounded-md py-1 ps-7 pe-4 text-density-body text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-foreground/7 data-disabled:opacity-64 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      data-slot="menu-radio-item"
      {...props}
    >
      <MenuPrimitive.RadioItemIndicator className="absolute start-row-inset text-foreground">
        <CheckIcon aria-hidden="true" strokeWidth={2} />
      </MenuPrimitive.RadioItemIndicator>
      <span>{children}</span>
    </MenuPrimitive.RadioItem>
  );
}

function MenuGroupLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.GroupLabel
      className={cn(
        "px-row-inset py-1.5 font-medium text-density-footnote text-muted-foreground data-inset:ps-9 sm:data-inset:ps-8",
        className,
      )}
      data-inset={inset}
      data-slot="menu-label"
      {...props}
    />
  );
}

function MenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      className={cn("mx-row-inset my-1 h-px bg-border", className)}
      data-slot="menu-separator"
      {...props}
    />
  );
}

function MenuShortcut({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn("ms-auto font-medium font-sans text-muted-foreground text-density-footnote tracking-widest", className)}
      data-slot="menu-shortcut"
      {...props}
    />
  );
}

function MenuSub(props: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="menu-sub" {...props} />;
}

function MenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      className={cn(
        "flex min-h-row items-center gap-2 rounded-md px-row-inset py-1 text-density-body text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-foreground/7 data-popup-open:bg-foreground/7 data-inset:ps-8 data-disabled:opacity-64 [&>svg:not(:last-child)]:-mx-0.5 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className,
      )}
      data-inset={inset}
      data-slot="menu-sub-trigger"
      {...props}
    >
      {children}
      <AltArrowRightIcon aria-hidden="true" className="ms-auto -me-0.5 text-muted-foreground" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

function MenuSubPopup({
  className,
  sideOffset = 0,
  alignOffset,
  align = "start",
  ...props
}: MenuPrimitive.Popup.Props & {
  align?: MenuPrimitive.Positioner.Props["align"];
  sideOffset?: MenuPrimitive.Positioner.Props["sideOffset"];
  alignOffset?: MenuPrimitive.Positioner.Props["alignOffset"];
}) {
  const defaultAlignOffset = align !== "center" ? -5 : undefined;

  return (
    <MenuPopup
      align={align}
      alignOffset={alignOffset ?? defaultAlignOffset}
      className={className}
      data-slot="menu-sub-content"
      side="inline-end"
      sideOffset={sideOffset}
      {...props}
    />
  );
}

export {
  MenuCreateHandle,
  MenuCreateHandle as DropdownMenuCreateHandle,
  Menu,
  Menu as DropdownMenu,
  MenuPortal,
  MenuPortal as DropdownMenuPortal,
  MenuTrigger,
  MenuTrigger as DropdownMenuTrigger,
  MenuPopup,
  MenuPopup as DropdownMenuContent,
  MenuGroup,
  MenuGroup as DropdownMenuGroup,
  MenuItem,
  MenuItem as DropdownMenuItem,
  MenuCheckboxItem,
  MenuCheckboxItem as DropdownMenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioGroup as DropdownMenuRadioGroup,
  MenuRadioItem,
  MenuRadioItem as DropdownMenuRadioItem,
  MenuGroupLabel,
  MenuGroupLabel as DropdownMenuLabel,
  MenuSeparator,
  MenuSeparator as DropdownMenuSeparator,
  MenuShortcut,
  MenuShortcut as DropdownMenuShortcut,
  MenuSub,
  MenuSub as DropdownMenuSub,
  MenuSubTrigger,
  MenuSubTrigger as DropdownMenuSubTrigger,
  MenuSubPopup,
  MenuSubPopup as DropdownMenuSubContent,
  MenuPrimitive,
};
