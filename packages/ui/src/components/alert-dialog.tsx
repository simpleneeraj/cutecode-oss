"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";

import { cn } from "../lib/cn";

const AlertDialogCreateHandle = AlertDialogPrimitive.createHandle;

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

function AlertDialogTrigger(props: AlertDialogPrimitive.Trigger.Props) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogBackdrop({ className, ...props }: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-scrim transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
        className,
      )}
      data-slot="alert-dialog-backdrop"
      {...props}
    />
  );
}

function AlertDialogViewport({ className, ...props }: AlertDialogPrimitive.Viewport.Props) {
  return (
    <AlertDialogPrimitive.Viewport
      className={cn("grid-rows-dialog fixed inset-0 z-50 grid justify-items-center p-4", className)}
      data-slot="alert-dialog-viewport"
      {...props}
    />
  );
}

function AlertDialogPopup({
  className,
  bottomStickOnMobile = false,
  ...props
}: AlertDialogPrimitive.Popup.Props & {
  bottomStickOnMobile?: boolean;
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogBackdrop />
      <AlertDialogViewport className={cn(bottomStickOnMobile && "max-sm:grid-rows-end max-sm:p-0 max-sm:pt-12")}>
        <AlertDialogPrimitive.Popup
          className={cn(
            "opacity-nested relative row-start-2 flex max-h-full min-h-0 w-full min-w-0 max-w-xs origin-center flex-col rounded-overlay edge bg-popover text-popover-foreground shadow-raised transition duration-200 ease-out will-change-transform data-ending-style:opacity-0 data-starting-style:opacity-0 sm:scale-nested sm:data-ending-style:scale-95 sm:data-starting-style:scale-95 motion-reduce:transition-none",
            bottomStickOnMobile &&
              "max-sm:max-w-none max-sm:origin-bottom max-sm:rounded-b-none max-sm:data-ending-style:translate-y-8 max-sm:data-starting-style:translate-y-8",
            className,
          )}
          data-slot="alert-dialog-popup"
          {...props}
        />
      </AlertDialogViewport>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-1 px-5 pt-5 pb-4 text-center", className)}
      data-slot="alert-dialog-header"
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "bare";
}) {
  return (
    <div
      className={cn(
        "flex gap-2 px-4 pb-4 *:flex-1",
        variant === "bare" && "pb-5",
        className,
      )}
      data-slot="alert-dialog-footer"
      {...props}
    />
  );
}

function AlertDialogTitle({ className, ...props }: AlertDialogPrimitive.Title.Props) {
  return (
    <AlertDialogPrimitive.Title
      className={cn("font-heading font-semibold text-body", className)}
      data-slot="alert-dialog-title"
      {...props}
    />
  );
}

function AlertDialogDescription({ className, ...props }: AlertDialogPrimitive.Description.Props) {
  return (
    <AlertDialogPrimitive.Description
      className={cn("text-footnote text-foreground", className)}
      data-slot="alert-dialog-description"
      {...props}
    />
  );
}

function AlertDialogClose(props: AlertDialogPrimitive.Close.Props) {
  return <AlertDialogPrimitive.Close data-slot="alert-dialog-close" {...props} />;
}

export {
  AlertDialogCreateHandle,
  AlertDialog,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogBackdrop as AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogPopup,
  AlertDialogPopup as AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
  AlertDialogViewport,
  AlertDialogPrimitive,
};
