"use client";

import { Button } from "@cutecode/ui/components/button";
import { PaletteIcon } from "@solar-icons/react/linear/palette";
import { Fragment, useRef, useState } from "react";

import { CustomizerOverlay } from "./constants";
import { CustomizerOverlays } from "./overlays";
import { customizerStyles } from "./style";
import { useIsPhone } from "./use-is-phone";

const styles = customizerStyles();

export function Customizer() {
  const [overlay, setOverlay] = useState(CustomizerOverlay.Closed);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isPhone = useIsPhone();

  function openCustomizer() {
    setOverlay(isPhone ? CustomizerOverlay.Drawer : CustomizerOverlay.Sheet);
  }

  return (
    <Fragment>
      <Button
        aria-expanded={overlay !== CustomizerOverlay.Closed}
        aria-haspopup="dialog"
        onClick={openCustomizer}
        ref={triggerRef}
        size="sm"
        variant="gray"
      >
        <PaletteIcon aria-hidden="true" />
        <span className={styles.triggerLabel()}>Customize</span>
      </Button>
      <CustomizerOverlays
        onClose={() => setOverlay(CustomizerOverlay.Closed)}
        overlay={overlay}
        triggerRef={triggerRef}
      />
    </Fragment>
  );
}
