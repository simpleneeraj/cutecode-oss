"use client";

import { Button } from "@cutecode/ui/components/button";
import {
  Drawer,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
} from "@cutecode/ui/components/drawer";
import type { StyleSettings } from "@cutecode/ui/provider";
import { Tuning2Icon } from "@solar-icons/react/linear/tuning-2";
import { Fragment, useRef, useState } from "react";

import { CustomizerControls } from "@/components/customizer/controls";

import { themeBuilder } from "./constants";
import { ExportActions } from "./export-actions";
import { themeBuilderStyles } from "./style";

type EditThemeDrawerProps = {
  settings: StyleSettings;
  onSettingsChange: (changes: Partial<StyleSettings>) => void;
  onReset: () => void;
};

const styles = themeBuilderStyles();

export function EditThemeDrawer({ settings, onSettingsChange, onReset }: EditThemeDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <Fragment>
      <div className={styles.editBar()}>
        <Button
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          className={styles.editButton()}
          onClick={() => setIsOpen(true)}
          ref={triggerRef}
        >
          <Tuning2Icon aria-hidden="true" />
          {themeBuilder.editTitle}
        </Button>
      </div>
      <Drawer onOpenChange={setIsOpen} open={isOpen}>
        <DrawerPopup finalFocus={triggerRef}>
          <DrawerHeader>
            <DrawerTitle>{themeBuilder.editTitle}</DrawerTitle>
            <DrawerDescription>{themeBuilder.editDescription}</DrawerDescription>
          </DrawerHeader>
          <DrawerPanel>
            <CustomizerControls onSettingsChange={onSettingsChange} settings={settings} />
          </DrawerPanel>
          <DrawerFooter className={styles.drawerFooter()}>
            <ExportActions onReset={onReset} settings={settings} />
          </DrawerFooter>
        </DrawerPopup>
      </Drawer>
    </Fragment>
  );
}
