"use client";

import { RadioGroupPrimitive } from "@cutecode/ui/components/radio-group";
import { Style } from "@cutecode/ui/provider";

import { customizer } from "./constants";
import { OptionRadio } from "./option-radio";
import { PickerSection } from "./picker-section";
import { customizerStyles } from "./style";

type StylePickerProps = {
  style: Style;
  onStyleChange: (style: Style) => void;
};

const styles = customizerStyles();
const styleValues = Object.values(Style);

export function StylePicker({ style, onStyleChange }: StylePickerProps) {
  return (
    <PickerSection title="Style">
      <RadioGroupPrimitive aria-label="Style" className={styles.strip()} onValueChange={onStyleChange} value={style}>
        {styleValues.map((option) => (
          <OptionRadio isSelected={option === style} key={option} shape={styles.styleOption()} value={option}>
            <span aria-hidden="true" className={styles.styleSample()} data-style={option}>
              <span className={styles.sampleCard()}>
                <span className={styles.sampleLine()} />
                <span className={styles.sampleField()} />
                <span className={styles.sampleButton()}>Save</span>
              </span>
            </span>
            <span className={styles.optionText()}>
              <span className={styles.optionName()}>{customizer.styleOptions[option].name}</span>
              <span className={styles.optionFeel()}>{customizer.styleOptions[option].feel}</span>
            </span>
          </OptionRadio>
        ))}
      </RadioGroupPrimitive>
    </PickerSection>
  );
}
