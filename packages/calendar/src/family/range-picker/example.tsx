"use client";

import { useState } from "react";

import { familyExampleOptions } from "../../parts/family-options/example-options";
import { StateSwitch } from "../../parts/family-options/state-switch";
import { familyExampleStyles } from "../../parts/family-options/style";
import { FrameTone } from "../../parts/picker-frame/choices";
import { Weekday, type DateRange } from "../../types";
import { RangePicker, type RangePickerSetup } from "./index";

enum RangePickerState {
  Range = "range",
  StartOnly = "startOnly",
  Disabled = "disabled",
  Invalid = "invalid",
}

type RangeState = {
  value: Partial<DateRange> | null;
  setup: RangePickerSetup;
};

const choices = [
  { kind: RangePickerState.Range, label: "Range" },
  { kind: RangePickerState.StartOnly, label: "Start only" },
  { kind: RangePickerState.Disabled, label: "Disabled dates" },
  { kind: RangePickerState.Invalid, label: "Invalid range" },
];

const states: Record<RangePickerState, RangeState> = {
  [RangePickerState.Range]: { value: { start: "2026-11-20", end: "2026-11-28" }, setup: { label: "Trip dates" } },
  [RangePickerState.StartOnly]: { value: { start: "2026-11-20" }, setup: { label: "Trip dates" } },
  [RangePickerState.Disabled]: {
    value: null,
    setup: {
      label: "Stay",
      tone: FrameTone.Accent,
      rules: { min: "2026-11-18", disabledWeekdays: [Weekday.Saturday], disabledDates: ["2026-11-26"] },
    },
  },
  [RangePickerState.Invalid]: { value: { start: "2026-11-27", end: "2026-11-20" }, setup: { label: "Trip dates" } },
};

const exampleCopy = {
  states: "Range picker states",
  picked: "Picked",
  cancelled: "Cancelled",
};

const styles = familyExampleStyles();

function RangePickerExample() {
  const [shown, setShown] = useState({ kind: RangePickerState.Range, value: states[RangePickerState.Range].value });
  const [result, setResult] = useState("");
  const choose = (kind: RangePickerState) => setShown({ kind, value: states[kind].value });
  const pick = (range: DateRange) => {
    setShown({ ...shown, value: range });
    setResult(`${exampleCopy.picked} ${range.start} to ${range.end}`);
  };

  return (
    <div className={styles.root()}>
      <StateSwitch choices={choices} label={exampleCopy.states} onValueChange={choose} value={shown.kind} />
      <div className={styles.stage()}>
        <RangePicker
          key={shown.kind}
          onCancel={() => setResult(exampleCopy.cancelled)}
          onValueChange={pick}
          options={familyExampleOptions}
          setup={states[shown.kind].setup}
          value={shown.value}
        />
        <p aria-live="polite" className={styles.result()}>
          {result}
        </p>
      </div>
    </div>
  );
}

export { RangePickerExample };
