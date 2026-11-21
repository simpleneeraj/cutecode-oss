"use client";

import { Palette, Style } from "@cutecode/ui/provider";
import { useState } from "react";

import { PalettePicker } from "@/components/customizer/palette-picker";
import { StylePicker } from "@/components/customizer/style-picker";
import { ArrowLink } from "@/components/home/arrow-link";
import { siteLinks } from "@/components/site-header/constants";

import { DemoPanel } from "./demo-panel";
import { themeDemoStyles } from "./style";

const styles = themeDemoStyles();

export function ThemeDemo() {
  const [style, setStyle] = useState(Style.Tactile);
  const [palette, setPalette] = useState(Palette.Blue);

  return (
    <div className={styles.root()}>
      <div className={styles.controls()}>
        <StylePicker onStyleChange={setStyle} style={style} />
        <PalettePicker onPaletteChange={setPalette} palette={palette} />
        <p className={styles.note()}>
          Same markup, new tokens. Make your own in the Theme Builder and copy one CSS file.
        </p>
        <ArrowLink href={siteLinks.themes}>Open the Theme Builder</ArrowLink>
      </div>
      <DemoPanel palette={palette} style={style} />
    </div>
  );
}
