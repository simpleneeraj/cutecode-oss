"use client";

import { useState } from "react";

import { familyExampleOptions } from "../../parts/family-options/example-options";
import { StateSwitch } from "../../parts/family-options/state-switch";
import { familyExampleStyles } from "../../parts/family-options/style";
import { FrameTone } from "../../parts/picker-frame/choices";
import { Weekday } from "../../types";
import { DatePicker, type DatePickerSetup } from "./index";

enum DatePickerState {
  Single = "single",
  Neutral = "neutral",
  Disabled = "disabled",
}

const choices = [
  { kind: DatePickerState.Single, label: "Single" },
  { kind: DatePickerState.Neutral, label: "Neutral frame" },
  { kind: DatePickerState.Disabled, label: "Disabled dates" },
];

const setups: Record<DatePickerState, DatePickerSetup> = {
  [DatePickerState.Single]: { label: "Start date" },
  [DatePickerState.Neutral]: { label: "Start date", tone: FrameTone.Neutral },
  [DatePickerState.Disabled]: {
    label: "Booking date",
    rules: { min: "2026-11-18", disabledWeekdays: [Weekday.Sunday], disabledDates: ["2026-11-26"] },
  },
};

const exampleCopy = {
  states: "Date picker states",
  picked: "Picked",
  cancelled: "Cancelled",
};

const styles = familyExampleStyles();

function DatePickerExample() {
  const [state, setState] = useState(DatePickerState.Single);
  const [value, setValue] = useState<string | null>("2026-11-24");
  const [result, setResult] = useState("");
  const pick = (date: string) => {
    setValue(date);
    setResult(`${exampleCopy.picked} ${date}`);
  };

  return (
    <div className={styles.root()}>
      <StateSwitch choices={choices} label={exampleCopy.states} onValueChange={setState} value={state} />
      <div className={styles.stage()}>
        <DatePicker
          onCancel={() => setResult(exampleCopy.cancelled)}
          onValueChange={pick}
          options={familyExampleOptions}
          setup={setups[state]}
          value={value}
        />
        <p aria-live="polite" className={styles.result()}>
          {result}
        </p>
      </div>
    </div>
  );
}

export { DatePickerExample };
