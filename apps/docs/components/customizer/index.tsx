"use client";

import { Button } from "@cutecode/ui/components/button";
import {
  Sheet,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
  SheetTrigger,
} from "@cutecode/ui/components/sheet";
import { defaultStyleSettings, renderThemeCss } from "@cutecode/ui/provider";
import { useStyleSettings } from "@cutecode/ui/provider/use-style-settings";
import { CopyIcon } from "@solar-icons/react/linear/copy";
import { PaletteIcon } from "@solar-icons/react/linear/palette";
import Link from "next/link";
import { useState } from "react";

import { customizer } from "./constants";
import { CustomizerControls } from "./controls";
import { CopyTextButton } from "./copy-text-button";
import { customizerStyles } from "./style";
import { useIsPhone } from "./use-is-phone";

const styles = customizerStyles();

export function Customizer() {
  const [isOpen, setIsOpen] = useState(false);
  const isPhone = useIsPhone();
  const { settings, updateStyleSettings } = useStyleSettings();

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger render={<Button aria-label="Customize" size="sm" variant="gray" />}>
        <PaletteIcon aria-hidden="true" />
        <span className={styles.triggerLabel()}>Customize</span>
      </SheetTrigger>
      <SheetPopup side={isPhone ? "bottom" : "right"}>
        <SheetHeader>
          <SheetTitle>Customize</SheetTitle>
          <SheetDescription>Pick how CuteUI looks across this site.</SheetDescription>
        </SheetHeader>
        <SheetPanel>
          <CustomizerControls onSettingsChange={updateStyleSettings} settings={settings} />
        </SheetPanel>
        <SheetFooter className={styles.footer()}>
          <Button onClick={() => updateStyleSettings(defaultStyleSettings)} variant="ghost">
            Reset
          </Button>
          <CopyTextButton
            copiedLabel="Copied"
            icon={CopyIcon}
            label="Copy CSS"
            readText={() => renderThemeCss(settings)}
          />
          <Button onClick={() => setIsOpen(false)} render={<Link href={customizer.themeBuilderHref} />}>
            Open Theme Builder
          </Button>
        </SheetFooter>
      </SheetPopup>
    </Sheet>
  );
}
