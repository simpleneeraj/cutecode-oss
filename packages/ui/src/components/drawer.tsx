"use client";

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { CloseIcon } from "@solar-icons/react/linear/close";

import { cn } from "../lib/cn";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";

function Drawer(props: DrawerPrimitive.Root.Props) {
  return <DrawerPrimitive.Root swipeDirection="down" {...props} />;
}

function DrawerBackdrop({ className, ...props }: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-scrim opacity-[calc(1-var(--drawer-swipe-progress))] transition-opacity duration-drawer ease-drawer data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] motion-reduce:transition-none",
        className,
      )}
      data-slot="drawer-backdrop"
      {...props}
    />
  );
}

function DrawerPopup({ className, children, ...props }: DrawerPrimitive.Popup.Props) {
  return (
    <DrawerPrimitive.VirtualKeyboardProvider>
      <DrawerPrimitive.Portal>
        <DrawerBackdrop />
        <DrawerPrimitive.Viewport
          className="fixed inset-0 z-50 grid touch-none grid-rows-end pt-safe"
          data-slot="drawer-viewport"
        >
          <DrawerPrimitive.Popup
            className={cn(
              "relative row-start-2 flex max-h-full min-h-0 w-full min-w-0 touch-none flex-col rounded-t-overlay edge bg-popover pt-2 pb-safe-inset text-popover-foreground shadow-raised outline-none transition-transform duration-drawer ease-drawer will-change-transform translate-y-(--drawer-swipe-movement-y) data-swiping:select-none data-ending-style:translate-y-full data-starting-style:translate-y-full data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] motion-reduce:transition-none",
              className,
            )}
            data-slot="drawer-popup"
            {...props}
          >
            <span
              aria-hidden="true"
              className="mx-auto h-1.25 w-9 shrink-0 rounded-control bg-input/60"
              data-slot="drawer-grabber"
            />
            {children}
            <DrawerPrimitive.Close
              aria-label="Close"
              className="absolute end-4 top-4"
              render={<Button size="icon-sm" variant="gray" />}
            >
              <CloseIcon aria-hidden="true" />
            </DrawerPrimitive.Close>
          </DrawerPrimitive.Popup>
        </DrawerPrimitive.Viewport>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.VirtualKeyboardProvider>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 px-6 pt-4 pe-16 pb-4", className)} data-slot="drawer-header" {...props} />;
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      className={cn("font-heading font-semibold text-title3", className)}
      data-slot="drawer-title"
      {...props}
    />
  );
}

function DrawerDescription({ className, ...props }: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      className={cn("text-muted-foreground text-subheadline", className)}
      data-slot="drawer-description"
      {...props}
    />
  );
}

function DrawerPanel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <ScrollArea className="touch-auto" scrollFade>
      <DrawerPrimitive.Content className={cn("px-6 pt-1 pb-2", className)} data-slot="drawer-panel" {...props} />
    </ScrollArea>
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex gap-2 px-6 pt-3 pb-6", className)} data-slot="drawer-footer" {...props} />;
}

export { Drawer, DrawerPopup, DrawerHeader, DrawerTitle, DrawerDescription, DrawerPanel, DrawerFooter, DrawerPrimitive };
