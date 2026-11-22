import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../lib/cn";

const alertVariants = cva(
  "squircle relative grid w-full items-start gap-x-2 gap-y-0.5 rounded-density-control edge px-3.5 py-3 text-density-subheadline text-foreground has-[>svg]:has-data-[slot=alert-action]:grid-cols-icon-fill-auto has-[>svg]:grid-cols-icon-fill has-data-[slot=alert-action]:grid-cols-fill-auto [&>svg]:h-lh [&>svg]:w-4",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "bg-card shadow-rest [&>svg]:text-muted-foreground",
        error: "bg-destructive-soft [&>svg]:text-destructive-foreground",
        info: "bg-card shadow-rest [&>svg]:text-brand-ink",
        success: "bg-card shadow-rest [&>svg]:text-success-foreground",
        warning: "bg-card shadow-rest [&>svg]:text-warning-foreground",
      },
    },
  },
);

function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div className={cn(alertVariants({ variant }), className)} data-slot="alert" role="alert" {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("font-medium [svg~&]:col-start-2", className)} data-slot="alert-title" {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2.5 text-muted-foreground [svg~&]:col-start-2", className)}
      data-slot="alert-description"
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex gap-1 max-sm:col-start-2 max-sm:mt-2 sm:row-start-1 sm:row-end-3 sm:self-center sm:[[data-slot=alert-description]~&]:col-start-2 sm:[[data-slot=alert-title]~&]:col-start-2 sm:[svg~&]:col-start-2 sm:[svg~[data-slot=alert-description]~&]:col-start-3 sm:[svg~[data-slot=alert-title]~&]:col-start-3",
        className,
      )}
      data-slot="alert-action"
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, AlertAction };
