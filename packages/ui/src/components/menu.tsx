"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { CheckIcon } from "@solar-icons/react/linear/check";
import { Fragment } from "react";
import type * as React from "react";

import { cn } from "../lib/cn";

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
            "relative flex not-[class*='w-']:min-w-60 origin-(--transform-origin) overflow-hidden rounded-overlay edge bg-popover text-popover-foreground shadow-raised outline-none transition-popup data-ending-style:scale-95 data-starting-style:scale-95 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
            className,
          )}
          data-slot="menu-popup"
          {...props}
        >
          <div className="max-h-(--available-height) w-full overflow-y-auto p-1.5">{children}</div>
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
        "flex min-h-11 cursor-default select-none items-center gap-3 rounded-surface px-3.5 py-2.5 text-body text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-muted data-inset:ps-10 data-[variant=destructive]:text-destructive-foreground data-disabled:opacity-40 [&>svg:not([class*='size-'])]:size-5 [&>svg]:pointer-events-none [&>svg]:order-last [&>svg]:ms-auto [&>svg]:shrink-0",
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
        "relative flex min-h-11 in-data-[side=none]:min-w-anchor-inset cursor-default items-center gap-3 rounded-surface py-2.5 text-body text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-muted data-disabled:opacity-40 [&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        variant === "switch" ? "justify-between ps-3.5 pe-2" : "ps-10 pe-3.5",
        className,
      )}
      data-slot="menu-checkbox-item"
      {...props}
    >
      {variant === "switch" ? (
        <Fragment>
          <span>{children}</span>
          <MenuPrimitive.CheckboxItemIndicator
            className="inline-flex h-7.75 w-12.75 shrink-0 items-center rounded-control bg-muted p-0.5 transition-colors duration-200 ease-out data-checked:bg-success motion-reduce:transition-none"
            keepMounted
          >
            <span className="pointer-events-none block size-6.75 origin-left rounded-full bg-on-fill shadow-thumb transition-transform duration-200 ease-out in-[[data-slot=menu-checkbox-item][data-checked]]:origin-right in-[[data-slot=menu-checkbox-item][data-checked]]:translate-x-5 in-[[data-slot=menu-checkbox-item]:active]:scale-x-110 motion-reduce:transition-none" />
          </MenuPrimitive.CheckboxItemIndicator>
        </Fragment>
      ) : (
        <Fragment>
          <MenuPrimitive.CheckboxItemIndicator className="absolute start-3.5 text-brand">
            <CheckIcon strokeWidth={2} />
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
        "relative flex min-h-11 in-data-[side=none]:min-w-anchor-inset cursor-default items-center gap-3 rounded-surface py-2.5 ps-10 pe-3.5 text-body text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-muted data-disabled:opacity-40 [&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      data-slot="menu-radio-item"
      {...props}
    >
      <MenuPrimitive.RadioItemIndicator className="absolute start-3.5 text-brand">
        <CheckIcon strokeWidth={2} />
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
        "px-3.5 pt-2 pb-1 font-semibold text-footnote text-muted-foreground data-inset:ps-10",
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
      className={cn("mx-3.5 my-1.5 h-px bg-border", className)}
      data-slot="menu-separator"
      {...props}
    />
  );
}

function MenuShortcut({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn("ms-auto font-sans text-muted-foreground text-subheadline", className)}
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
        "flex min-h-11 items-center gap-3 rounded-surface px-3.5 py-2.5 text-body text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-muted data-popup-open:bg-muted data-inset:ps-10 data-disabled:opacity-40 [&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none",
        className,
      )}
      data-inset={inset}
      data-slot="menu-sub-trigger"
      {...props}
    >
      {children}
      <AltArrowRightIcon className="ms-auto text-muted-foreground" />
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
