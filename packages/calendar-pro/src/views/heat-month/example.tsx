"use client";

import { CalendarAnnouncer } from "@cutecode/calendar/parts/live-region/announcer";
import { StateSwitch } from "@cutecode/calendar/parts/family-options/state-switch";
import { useState } from "react";

import {
  HeatExampleState,
  heatExampleCopy,
  heatExampleDate,
  heatExampleProps,
  heatExampleStates,
} from "./example-data";
import { HeatMonth } from "./index";
import { heatExampleStyles } from "./style";

const styles = heatExampleStyles();

function HeatMonthExample() {
  const [state, setState] = useState(HeatExampleState.Count);
  const [date, setDate] = useState(heatExampleDate);

  return (
    <CalendarAnnouncer>
      <div className={styles.root()}>
        <div className={styles.controls()}>
          <StateSwitch
            choices={heatExampleStates}
            label={heatExampleCopy.states}
            onValueChange={setState}
            value={state}
          />
        </div>
        <div className={styles.stage()}>
          <HeatMonth {...heatExampleProps(state)} selection={{ value: date, onValueChange: setDate }} />
        </div>
      </div>
    </CalendarAnnouncer>
  );
}

export { HeatMonthExample };
