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
        "fixed inset-0 z-50 bg-scrim opacity-drawer-swipe transition-opacity duration-drawer ease-drawer data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0 data-ending-style:duration-drawer-swipe motion-reduce:transition-none",
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
              "relative row-start-2 flex max-h-full min-h-0 w-full min-w-0 touch-none flex-col squircle rounded-t-density-overlay edge bg-popover pt-2 pb-safe-inset text-popover-foreground shadow-raised outline-none transition-transform duration-drawer ease-drawer will-change-transform translate-y-(--drawer-swipe-movement-y) data-swiping:select-none data-ending-style:translate-y-full data-starting-style:translate-y-full data-ending-style:duration-drawer-swipe motion-reduce:transition-none",
              className,
            )}
            data-slot="drawer-popup"
            {...props}
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-3 mx-auto h-1 w-12 rounded-full bg-input/60"
              data-slot="drawer-grabber"
            />
            {children}
            <DrawerPrimitive.Close
              aria-label="Close"
              className="absolute end-2 top-2 z-1"
              render={<Button size="icon" variant="ghost" />}
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
  return <div className={cn("flex flex-col gap-2 p-6 pe-12 in-[[data-slot=drawer-popup]:has([data-slot=drawer-panel])]:pb-3 max-sm:pb-4", className)} data-slot="drawer-header" {...props} />;
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      className={cn("font-bold font-heading text-title3 leading-none", className)}
      data-slot="drawer-title"
      {...props}
    />
  );
}

function DrawerDescription({ className, ...props }: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      className={cn("text-density-subheadline text-muted-foreground", className)}
      data-slot="drawer-description"
      {...props}
    />
  );
}

function DrawerPanel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <ScrollArea className="touch-auto" scrollFade>
      <DrawerPrimitive.Content className={cn("p-6 in-[[data-slot=drawer-popup]:has([data-slot=drawer-header])]:pt-1 in-[[data-slot=drawer-popup]:has([data-slot=drawer-footer])]:pb-1", className)} data-slot="drawer-panel" {...props} />
    </ScrollArea>
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col-reverse gap-2 px-6 pt-4 pb-6 in-[[data-slot=drawer-popup]:has([data-slot=drawer-panel])]:pt-3 sm:flex-row sm:justify-end", className)} data-slot="drawer-footer" {...props} />;
}

export { Drawer, DrawerPopup, DrawerHeader, DrawerTitle, DrawerDescription, DrawerPanel, DrawerFooter, DrawerPrimitive };
