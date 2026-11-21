"use client";

import { Button } from "@cutecode/ui/components/button";
import { RadioGroupPrimitive } from "@cutecode/ui/components/radio-group";
import { FontPairing, type Style, suggestedFontPairings } from "@cutecode/ui/provider";

import { customizer } from "./constants";
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
  const suggestedFont = suggestedFontPairings[style];
  const isSuggested = font === suggestedFont;
  const styleName = customizer.styleOptions[style].name;
  const suggestedName = customizer.fontLabels[suggestedFont];

  return (
    <PickerSection title="Font">
      <RadioGroupPrimitive aria-label="Font" className={styles.strip()} onValueChange={onFontChange} value={font}>
        {fontValues.map((option) => (
          <OptionRadio key={option} shape={styles.fontOption()} value={option}>
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
      {isSuggested ? (
        <p className={styles.suggestionText()}>
          {suggestedName} is the suggested pairing for {styleName}.
        </p>
      ) : (
        <div className={styles.suggestion()}>
          <span className={styles.suggestionText()}>
            {styleName} pairs with {suggestedName}.
          </span>
          <Button onClick={() => onFontChange(suggestedFont)} size="sm" variant="tinted">
            Use {suggestedName}
          </Button>
        </div>
      )}
    </PickerSection>
  );
}
