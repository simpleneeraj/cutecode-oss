"use client";

import { useState } from "react";

import { familyExampleOptions } from "../../parts/family-options/example-options";
import { StateSwitch } from "../../parts/family-options/state-switch";
import { familyExampleStyles } from "../../parts/family-options/style";
import { monthEvents } from "../../parts/month-grid/example-data";
import { exampleDate } from "../../parts/time-grid/example-data";
import { IslandPill } from "./island-pill";
import { WeekStrip, WeekStripLook } from "./index";

enum WeekStripState {
  Selected = "selected",
  PastLocked = "pastLocked",
}

const choices = [
  { kind: WeekStripState.Selected, label: "Selected" },
  { kind: WeekStripState.PastLocked, label: "Past locked" },
];

const exampleCopy = {
  states: "Week strip states",
};

const styles = familyExampleStyles();

function WeekStripExample() {
  const [state, setState] = useState(WeekStripState.Selected);
  const [date, setDate] = useState(exampleDate);
  const isPastLocked = state === WeekStripState.PastLocked;
  const strip = { value: date, onValueChange: setDate, options: familyExampleOptions, isPastLocked };

  return (
    <div className={styles.root()}>
      <StateSwitch choices={choices} label={exampleCopy.states} onValueChange={setState} value={state} />
      <div className={styles.stage()}>
        <WeekStrip {...strip} look={WeekStripLook.Soft} />
        <WeekStrip {...strip} look={WeekStripLook.Island} />
        <IslandPill events={monthEvents} options={familyExampleOptions} />
        <p className={styles.result()}>{date}</p>
      </div>
    </div>
  );
}

export { WeekStripExample };
