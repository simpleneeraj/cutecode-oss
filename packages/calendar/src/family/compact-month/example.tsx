"use client";

import { useState } from "react";

import { familyExampleOptions } from "../../parts/family-options/example-options";
import { StateSwitch } from "../../parts/family-options/state-switch";
import { familyExampleStyles } from "../../parts/family-options/style";
import { monthEvents } from "../../parts/month-grid/example-data";
import { exampleCalendars, exampleDate } from "../../parts/time-grid/example-data";
import { CompactMonth } from "./index";

enum CompactMonthState {
  Selected = "selected",
  Loading = "loading",
  EmptyMonth = "emptyMonth",
}

const choices = [
  { kind: CompactMonthState.Selected, label: "Selected" },
  { kind: CompactMonthState.Loading, label: "Loading" },
  { kind: CompactMonthState.EmptyMonth, label: "Empty month" },
];

const stateDates: Record<CompactMonthState, string> = {
  [CompactMonthState.Selected]: exampleDate,
  [CompactMonthState.Loading]: exampleDate,
  [CompactMonthState.EmptyMonth]: "2026-12-14",
};

const exampleCopy = {
  states: "Compact month states",
};

const data = { events: monthEvents, calendars: exampleCalendars };
const styles = familyExampleStyles();

function CompactMonthExample() {
  const [shown, setShown] = useState({ kind: CompactMonthState.Selected, date: exampleDate });
  const choose = (kind: CompactMonthState) => setShown({ kind, date: stateDates[kind] });

  return (
    <div className={styles.root()}>
      <StateSwitch choices={choices} label={exampleCopy.states} onValueChange={choose} value={shown.kind} />
      <div className={styles.stage()}>
        <CompactMonth
          data={data}
          isLoading={shown.kind === CompactMonthState.Loading}
          onValueChange={(date) => setShown({ ...shown, date })}
          options={familyExampleOptions}
          value={shown.date}
        />
        <p className={styles.result()}>{shown.date}</p>
      </div>
    </div>
  );
}

export { CompactMonthExample };
