"use client";

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";

const Sheet = SheetPrimitive.Root;

const SheetPortal = SheetPrimitive.Portal;

function SheetTrigger(props: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetBackdrop({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-scrim transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
        className,
      )}
      data-slot="sheet-backdrop"
      {...props}
    />
  );
}

function SheetViewport({
  className,
  side,
  variant = "default",
  ...props
}: SheetPrimitive.Viewport.Props & {
  side?: "right" | "left" | "top" | "bottom";
  variant?: "default" | "inset";
}) {
  return (
    <SheetPrimitive.Viewport
      className={cn(
        "fixed inset-0 z-50 grid",
        side === "bottom" && "grid-rows-end pt-12",
        side === "top" && "grid-rows-start pb-12",
        side === "left" && "flex justify-start",
        side === "right" && "flex justify-end",
        variant === "inset" && "sm:p-4",
      )}
      data-slot="sheet-viewport"
      {...props}
    />
  );
}

function SheetPopup({
  className,
  children,
  showCloseButton = true,
  side = "right",
  variant = "default",
  closeProps,
  ...props
}: SheetPrimitive.Popup.Props & {
  showCloseButton?: boolean;
  side?: "right" | "left" | "top" | "bottom";
  variant?: "default" | "inset";
  closeProps?: SheetPrimitive.Close.Props;
}) {
  return (
    <SheetPortal>
      <SheetBackdrop />
      <SheetViewport side={side} variant={variant}>
        <SheetPrimitive.Popup
          className={cn(
            "relative flex max-h-full min-h-0 w-full min-w-0 flex-col bg-popover text-popover-foreground shadow-raised transition duration-200 ease-out will-change-transform data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
            side === "bottom" &&
              "row-start-2 rounded-t-overlay data-ending-style:translate-y-8 data-starting-style:translate-y-8",
            side === "top" && "rounded-b-overlay data-ending-style:-translate-y-8 data-starting-style:-translate-y-8",
            side === "left" &&
              "w-11/12 max-w-md data-ending-style:-translate-x-8 data-starting-style:-translate-x-8",
            side === "right" &&
              "col-start-2 w-11/12 max-w-md data-ending-style:translate-x-8 data-starting-style:translate-x-8",
            variant === "inset" && "sm:rounded-overlay",
            className,
          )}
          data-slot="sheet-popup"
          {...props}
        >
          {side === "bottom" && (
            <span
              aria-hidden="true"
              className="mx-auto mt-2 h-1.25 w-9 shrink-0 rounded-control bg-input/60"
              data-slot="sheet-grabber"
            />
          )}
          {children}
          {showCloseButton && (
            <SheetPrimitive.Close
              aria-label="Close"
              className="absolute end-4 top-4"
              render={<Button size="icon-sm" variant="gray" />}
              {...closeProps}
            >
              <HugeiconsIcon icon={Cancel01Icon} />
            </SheetPrimitive.Close>
          )}
        </SheetPrimitive.Popup>
      </SheetViewport>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 p-6 pe-16 in-[[data-slot=sheet-popup]:has([data-slot=sheet-panel])]:pb-3 max-sm:pb-4",
        className,
      )}
      data-slot="sheet-header"
      {...props}
    />
  );
}

function SheetFooter({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "bare";
}) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 px-6 sm:flex-row sm:justify-end",
        variant === "default" && "pt-2 pb-6",
        variant === "bare" && "in-[[data-slot=sheet-popup]:has([data-slot=sheet-panel])]:pt-3 pt-4 pb-6",
        className,
      )}
      data-slot="sheet-footer"
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      className={cn("font-heading font-semibold text-title3", className)}
      data-slot="sheet-title"
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      className={cn("text-muted-foreground text-subheadline", className)}
      data-slot="sheet-description"
      {...props}
    />
  );
}

function SheetPanel({
  className,
  scrollFade = true,
  ...props
}: React.ComponentProps<"div"> & { scrollFade?: boolean }) {
  return (
    <ScrollArea scrollFade={scrollFade}>
      <div
        className={cn(
          "p-6 in-[[data-slot=sheet-popup]:has([data-slot=sheet-header])]:pt-1 in-[[data-slot=sheet-popup]:has([data-slot=sheet-footer]:not(.border-t))]:pb-1",
          className,
        )}
        data-slot="sheet-panel"
        {...props}
      />
    </ScrollArea>
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetClose,
  SheetBackdrop,
  SheetBackdrop as SheetOverlay,
  SheetPopup,
  SheetPopup as SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetPanel,
  SheetPrimitive,
};
