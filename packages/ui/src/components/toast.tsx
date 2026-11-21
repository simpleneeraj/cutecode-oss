"use client";

import { Toast } from "@base-ui/react/toast";
import {
  Alert02Icon,
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { cn } from "../lib/cn";
import { buttonVariants } from "./button";
import { Spinner } from "./spinner";

const toastManager = Toast.createToastManager();
const anchoredToastManager = Toast.createToastManager();

const toastIcons = new Map<string, IconSvgElement>([
  ["error", AlertCircleIcon],
  ["info", InformationCircleIcon],
  ["success", CheckmarkCircle02Icon],
  ["warning", Alert02Icon],
]);

type ToastPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

type ToastProviderProps = Toast.Provider.Props & {
  position?: ToastPosition;
};

function readSwipeDirections(position: ToastPosition): Toast.Root.Props["swipeDirection"] {
  const verticalDirection = position.startsWith("top") ? "up" : "down";
  if (position.includes("center")) {
    return [verticalDirection];
  }
  if (position.includes("left")) {
    return ["left", verticalDirection];
  }
  return ["right", verticalDirection];
}

function ToastProvider({ children, position = "bottom-right", ...props }: ToastProviderProps) {
  return (
    <Toast.Provider toastManager={toastManager} {...props}>
      {children}
      <Toasts position={position} />
    </Toast.Provider>
  );
}

function ToastIcon({ type }: { type?: string }) {
  const icon = type ? toastIcons.get(type) : undefined;
  const isLoading = type === "loading";
  if (!isLoading && !icon) {
    return null;
  }
  return (
    <div
      className="flex h-lh shrink-0 items-center [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0"
      data-slot="toast-icon"
    >
      {icon ? (
        <HugeiconsIcon
          icon={icon}
          className="in-data-[type=error]:text-destructive-foreground in-data-[type=info]:text-brand in-data-[type=success]:text-success-foreground in-data-[type=warning]:text-warning-foreground"
        />
      ) : (
        <Spinner aria-hidden="true" className="text-muted-foreground" />
      )}
    </div>
  );
}

function Toasts({ position = "bottom-right" }: { position: ToastPosition }) {
  const { toasts } = Toast.useToastManager();

  return (
    <Toast.Portal data-slot="toast-portal">
      <Toast.Viewport
        className="toast-viewport fixed z-50 mx-auto flex max-w-90 data-[position*=bottom]:bottom-(--toast-inset) data-[position*=left]:left-(--toast-inset) data-[position*=right]:right-(--toast-inset) data-[position*=top]:top-(--toast-inset) data-[position*=center]:left-1/2 data-[position*=center]:-translate-x-1/2"
        data-position={position}
        data-slot="toast-viewport"
      >
        {toasts.map((toast) => {
          return (
            <Toast.Root
              className="toast-stack glass rounded-surface text-foreground shadow-glass"
              data-position={position}
              key={toast.id}
              swipeDirection={readSwipeDirections(position)}
              toast={toast}
            >
              <Toast.Content className="pointer-events-auto flex items-center justify-between gap-3 overflow-hidden px-4 py-3.5 text-subheadline transition-opacity duration-250 data-behind:not-data-expanded:pointer-events-none data-behind:opacity-0 data-expanded:opacity-100">
                <div className="flex gap-3">
                  <ToastIcon type={toast.type} />

                  <div className="flex flex-col gap-0.5">
                    <Toast.Title className="font-semibold" data-slot="toast-title" />
                    <Toast.Description className="text-muted-foreground" data-slot="toast-description" />
                  </div>
                </div>
                {toast.actionProps && (
                  <Toast.Action className={buttonVariants({ size: "sm" })} data-slot="toast-action">
                    {toast.actionProps.children}
                  </Toast.Action>
                )}
              </Toast.Content>
            </Toast.Root>
          );
        })}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

function AnchoredToastProvider({ children, ...props }: Toast.Provider.Props) {
  return (
    <Toast.Provider toastManager={anchoredToastManager} {...props}>
      {children}
      <AnchoredToasts />
    </Toast.Provider>
  );
}

function AnchoredToasts() {
  const { toasts } = Toast.useToastManager();

  return (
    <Toast.Portal data-slot="toast-portal-anchored">
      <Toast.Viewport className="outline-none" data-slot="toast-viewport-anchored">
        {toasts.map((toast) => {
          const tooltipStyle = (toast.data as { tooltipStyle?: boolean })?.tooltipStyle ?? false;
          const positionerProps = toast.positionerProps;

          if (!positionerProps?.anchor) {
            return null;
          }

          return (
            <Toast.Positioner
              className="max-w-anchored z-50"
              data-slot="toast-positioner"
              key={toast.id}
              sideOffset={positionerProps.sideOffset ?? 4}
              toast={toast}
            >
              <Toast.Root
                className={cn(
                  "relative text-balance text-footnote transition-popup data-ending-style:scale-95 data-starting-style:scale-95 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
                  tooltipStyle
                    ? "rounded-overlay bg-popover text-popover-foreground shadow-raised"
                    : "glass rounded-surface text-foreground shadow-glass",
                )}
                data-slot="toast-popup"
                toast={toast}
              >
                {tooltipStyle ? (
                  <Toast.Content className="pointer-events-auto px-3 py-1.5">
                    <Toast.Title data-slot="toast-title" />
                  </Toast.Content>
                ) : (
                  <Toast.Content className="pointer-events-auto flex items-center justify-between gap-3 overflow-hidden px-4 py-3.5 text-subheadline">
                    <div className="flex gap-3">
                      <ToastIcon type={toast.type} />

                      <div className="flex flex-col gap-0.5">
                        <Toast.Title className="font-semibold" data-slot="toast-title" />
                        <Toast.Description className="text-muted-foreground" data-slot="toast-description" />
                      </div>
                    </div>
                    {toast.actionProps && (
                      <Toast.Action className={buttonVariants({ size: "sm" })} data-slot="toast-action">
                        {toast.actionProps.children}
                      </Toast.Action>
                    )}
                  </Toast.Content>
                )}
              </Toast.Root>
            </Toast.Positioner>
          );
        })}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

export {
  ToastProvider,
  type ToastPosition,
  toastManager,
  AnchoredToastProvider,
  anchoredToastManager,
  Toast as ToastPrimitive,
};
