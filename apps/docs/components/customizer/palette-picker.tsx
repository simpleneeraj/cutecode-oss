"use client";

import { RadioGroupPrimitive } from "@cutecode/ui/components/radio-group";
import { Palette } from "@cutecode/ui/provider";

import { customizer } from "./constants";
import { OptionRadio } from "./option-radio";
import { PickerSection } from "./picker-section";
import { customizerStyles } from "./style";

type PalettePickerProps = {
  palette: Palette;
  onPaletteChange: (palette: Palette) => void;
};

const styles = customizerStyles();
const paletteValues = Object.values(Palette);

export function PalettePicker({ palette, onPaletteChange }: PalettePickerProps) {
  return (
    <PickerSection title="Palette">
      <RadioGroupPrimitive
        aria-label="Palette"
        className={styles.strip()}
        onValueChange={onPaletteChange}
        value={palette}
      >
        {paletteValues.map((option) => (
          <OptionRadio key={option} shape={styles.paletteOption()} value={option}>
            <span aria-hidden="true" className={styles.swatch()} data-palette={option} />
            <span className={styles.paletteName()}>{customizer.paletteLabels[option]}</span>
          </OptionRadio>
        ))}
      </RadioGroupPrimitive>
    </PickerSection>
  );
}
