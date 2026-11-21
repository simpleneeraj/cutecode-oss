"use client";

import { RadioGroupPrimitive } from "@cutecode/ui/components/radio-group";
import { FontPairing, type Style } from "@cutecode/ui/provider";

import { customizer } from "./constants";
import { FontSuggestion } from "./font-suggestion";
import { OptionRadio } from "./option-radio";
import { PickerSection } from "./picker-section";
import { customizerStyles } from "./style";

type FontPickerProps = {
  font: FontPairing;
  style: Style;
  onFontChange: (font: FontPairing) => void;
};

const styles = customizerStyles();
const fontValues = Object.values(FontPairing);

export function FontPicker({ font, style, onFontChange }: FontPickerProps) {
  return (
    <PickerSection title="Font">
      <RadioGroupPrimitive aria-label="Font" className={styles.strip()} onValueChange={onFontChange} value={font}>
        {fontValues.map((option) => (
          <OptionRadio isSelected={option === font} key={option} shape={styles.fontOption()} value={option}>
            <span aria-hidden="true" className={styles.fontSample()} data-font={option}>
              <span className={styles.fontHeading()}>Aa</span>
              <span className={styles.fontBody()}>{customizer.fontSampleText}</span>
            </span>
            <span className={styles.optionText()}>
              <span className={styles.optionName()}>{customizer.fontLabels[option]}</span>
            </span>
          </OptionRadio>
        ))}
      </RadioGroupPrimitive>
      <FontSuggestion font={font} onFontChange={onFontChange} style={style} />
    </PickerSection>
  );
}
