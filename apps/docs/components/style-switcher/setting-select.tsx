"use client";

import { Field, FieldLabel } from "@cutecode/ui/components/field";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@cutecode/ui/components/select";

import { styleSwitcherStyles } from "./style";

type SettingSelectProps<Value extends string> = {
  label: string;
  value: Value;
  labels: Record<Value, string>;
  onValueChange: (value: Value) => void;
};

const styles = styleSwitcherStyles();

export function SettingSelect<Value extends string>({ label, value, labels, onValueChange }: SettingSelectProps<Value>) {
  const options = Object.entries<string>(labels);

  function selectValue(selected: Value | null) {
    const hasSelection = selected !== null;
    if (hasSelection) {
      onValueChange(selected);
    }
  }

  return (
    <Field className={styles.group()}>
      <FieldLabel className={styles.caption()}>{label}</FieldLabel>
      <Select items={labels} onValueChange={selectValue} value={value}>
        <SelectTrigger size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          {options.map(([optionValue, optionLabel]) => (
            <SelectItem key={optionValue} value={optionValue}>
              {optionLabel}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
    </Field>
  );
}
