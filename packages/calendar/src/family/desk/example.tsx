"use client";

import { useState } from "react";

import { familyExampleOptions } from "../../parts/family-options/example-options";
import { StateSwitch } from "../../parts/family-options/state-switch";
import { familyExampleStyles } from "../../parts/family-options/style";
import { monthEvents } from "../../parts/month-grid/example-data";
import { exampleDate } from "../../parts/time-grid/example-data";
import { DeskCalendar } from "./index";

enum DeskState {
  Today = "today",
  NextDay = "nextDay",
  NothingPlanned = "nothingPlanned",
}

const choices = [
  { kind: DeskState.Today, label: "Today" },
  { kind: DeskState.NextDay, label: "Next day" },
  { kind: DeskState.NothingPlanned, label: "Nothing planned" },
];

const stateDates: Record<DeskState, string> = {
  [DeskState.Today]: exampleDate,
  [DeskState.NextDay]: "2026-11-19",
  [DeskState.NothingPlanned]: "2026-11-08",
};

const exampleCopy = {
  states: "Desk calendar states",
  added: "Add to",
};

const styles = familyExampleStyles();

function DeskCalendarExample() {
  const [shown, setShown] = useState({ kind: DeskState.Today, date: exampleDate });
  const [result, setResult] = useState("");
  const choose = (kind: DeskState) => setShown({ kind, date: stateDates[kind] });

  return (
    <div className={styles.root()}>
      <StateSwitch choices={choices} label={exampleCopy.states} onValueChange={choose} value={shown.kind} />
      <div className={styles.stage()}>
        <DeskCalendar
          events={monthEvents}
          onAdd={(date) => setResult(`${exampleCopy.added} ${date}`)}
          onValueChange={(date) => setShown({ ...shown, date })}
          options={familyExampleOptions}
          value={shown.date}
        />
        <p aria-live="polite" className={styles.result()}>
          {result}
        </p>
      </div>
    </div>
  );
}

export { DeskCalendarExample };
