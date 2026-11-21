"use client";

import { type Style, type StyleSettings, suggestedFontPairings } from "@cutecode/ui/provider";

import { AppearancePicker } from "./appearance-picker";
import { FontPicker } from "./font-picker";
import { PalettePicker } from "./palette-picker";
import { customizerStyles } from "./style";
import { StylePicker } from "./style-picker";

type CustomizerControlsProps = {
  settings: StyleSettings;
  onSettingsChange: (changes: Partial<StyleSettings>) => void;
};

const styles = customizerStyles();

export function CustomizerControls({ settings, onSettingsChange }: CustomizerControlsProps) {
  function selectStyle(style: Style) {
    onSettingsChange({ style, font: suggestedFontPairings[style] });
  }

  return (
    <div className={styles.controls()}>
      <StylePicker onStyleChange={selectStyle} style={settings.style} />
      <PalettePicker onPaletteChange={(palette) => onSettingsChange({ palette })} palette={settings.palette} />
      <FontPicker font={settings.font} onFontChange={(font) => onSettingsChange({ font })} style={settings.style} />
      <AppearancePicker />
    </div>
  );
}
