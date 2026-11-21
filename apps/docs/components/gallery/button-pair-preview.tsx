"use client";

import { ButtonPair } from "@cutecode/ui/tactile/button-pair";
import { useState } from "react";

import { galleryStyles } from "./style";

const styles = galleryStyles();

export function ButtonPairPreview() {
  const [lastPressed, setLastPressed] = useState("Nothing pressed yet");

  return (
    <div className={styles.row()}>
      <ButtonPair
        label="Save changes"
        onPrimaryClick={() => setLastPressed("Saved")}
        onSecondaryClick={() => setLastPressed("Discarded")}
        primary="Save"
        secondary="Discard"
      />
      <span aria-live="polite" className={styles.status()}>
        {lastPressed}
      </span>
    </div>
  );
}
