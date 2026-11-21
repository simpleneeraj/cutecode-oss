"use client";

import {
  Drawer,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
} from "@cutecode/ui/components/drawer";
import {
  Sheet,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from "@cutecode/ui/components/sheet";
import { useStyleSettings } from "@cutecode/ui/provider/use-style-settings";
import { Fragment, type RefObject } from "react";

import { CustomizerActions } from "./actions";
import { CustomizerOverlay, customizer } from "./constants";
import { CustomizerControls } from "./controls";
import { customizerStyles } from "./style";

type CustomizerOverlaysProps = {
  overlay: CustomizerOverlay;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
};

const styles = customizerStyles();

export function CustomizerOverlays({ overlay, triggerRef, onClose }: CustomizerOverlaysProps) {
  const { settings, updateStyleSettings } = useStyleSettings();
  const controls = <CustomizerControls onSettingsChange={updateStyleSettings} settings={settings} />;
  const actions = <CustomizerActions onNavigate={onClose} />;

  function changeOpen(isNextOpen: boolean) {
    if (isNextOpen) {
      return;
    }
    onClose();
  }

  return (
    <Fragment>
      <Sheet onOpenChange={changeOpen} open={overlay === CustomizerOverlay.Sheet}>
        <SheetPopup finalFocus={triggerRef} side="right">
          <SheetHeader>
            <SheetTitle>{customizer.title}</SheetTitle>
            <SheetDescription>{customizer.description}</SheetDescription>
          </SheetHeader>
          <SheetPanel>{controls}</SheetPanel>
          <SheetFooter className={styles.footer()}>{actions}</SheetFooter>
        </SheetPopup>
      </Sheet>
      <Drawer onOpenChange={changeOpen} open={overlay === CustomizerOverlay.Drawer}>
        <DrawerPopup finalFocus={triggerRef}>
          <DrawerHeader>
            <DrawerTitle>{customizer.title}</DrawerTitle>
            <DrawerDescription>{customizer.description}</DrawerDescription>
          </DrawerHeader>
          <DrawerPanel>{controls}</DrawerPanel>
          <DrawerFooter className={styles.footer()}>{actions}</DrawerFooter>
        </DrawerPopup>
      </Drawer>
    </Fragment>
  );
}
