"use client";

import { Dialog, DialogDescription, DialogHeader, DialogPopup, DialogTitle } from "@cutecode/ui/components/dialog";
import { Drawer, DrawerDescription, DrawerHeader, DrawerPopup, DrawerTitle } from "@cutecode/ui/components/drawer";
import { Fragment, type ReactNode } from "react";

import { useOverlay, type OverlayDismiss } from "./use-overlay";

export type DialogCopy = {
  title: string;
  description: string;
};

type ResponsiveDialogProps<Value> = {
  value: Value | null;
  copyOf: (shown: Value) => DialogCopy;
  dismiss: OverlayDismiss;
  children: (shown: Value) => ReactNode;
};

const closedCopy: DialogCopy = { title: "", description: "" };

function ResponsiveDialog<Value>({ value, copyOf, dismiss, children }: ResponsiveDialogProps<Value>) {
  const overlay = useOverlay(value, dismiss);
  const body = overlay.shown === null ? null : children(overlay.shown);
  const copy = overlay.shown === null ? closedCopy : copyOf(overlay.shown);
  const handlers = { onOpenChange: overlay.changeOpen, onOpenChangeComplete: overlay.release };

  return (
    <Fragment>
      <Dialog {...handlers} disablePointerDismissal={overlay.isSaving} open={overlay.isDesktopOpen}>
        <DialogPopup showCloseButton={!overlay.isSaving}>
          <DialogHeader>
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>{copy.description}</DialogDescription>
          </DialogHeader>
          {body}
        </DialogPopup>
      </Dialog>
      <Drawer {...handlers} disablePointerDismissal={overlay.isSaving} open={overlay.isPhoneOpen}>
        <DrawerPopup>
          <DrawerHeader>
            <DrawerTitle>{copy.title}</DrawerTitle>
            <DrawerDescription>{copy.description}</DrawerDescription>
          </DrawerHeader>
          {body}
        </DrawerPopup>
      </Drawer>
    </Fragment>
  );
}

export { ResponsiveDialog };
