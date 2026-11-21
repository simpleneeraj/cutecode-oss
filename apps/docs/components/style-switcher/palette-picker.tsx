"use client";

import { ToggleGroup, ToggleGroupItem } from "@cutecode/ui/components/toggle-group";
import { Palette } from "@cutecode/ui/provider";

import { styleSwitcher } from "./constants";
import { styleSwitcherStyles } from "./style";

type PalettePickerProps = {
  palette: Palette;
  onPaletteChange: (palette: Palette) => void;
};

const styles = styleSwitcherStyles();
const palettes = Object.values(Palette);

export function PalettePicker({ palette, onPaletteChange }: PalettePickerProps) {
  function selectPalette(values: string[]) {
    const selected = palettes.find((candidate) => values.includes(candidate));
    if (selected) {
      onPaletteChange(selected);
    }
  }

  return (
    <div className={styles.group()}>
      <span className={styles.caption()}>Palette</span>
      <ToggleGroup aria-label="Palette" className={styles.strip()} onValueChange={selectPalette} value={[palette]}>
        {palettes.map((option) => (
          <ToggleGroupItem aria-label={styleSwitcher.paletteLabels[option]} key={option} value={option}>
            <span aria-hidden="true" className={styles.swatch()} data-palette={option} />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
