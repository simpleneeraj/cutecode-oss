"use client";

import { useState } from "react";

import { StateSwitch } from "../../parts/family-options/state-switch";
import {
  examplePayments,
  MoneyExampleState,
  moneyExampleCopy,
  moneyExampleDates,
  moneyExampleOptions,
  moneyExampleChoices,
} from "./example-data";
import { MoneyCalendar } from "./index";
import { moneyExampleStyles } from "./style";

const styles = moneyExampleStyles();

function MoneyCalendarExample() {
  const [state, setState] = useState(MoneyExampleState.Payment);
  const [date, setDate] = useState(moneyExampleDates[MoneyExampleState.Payment]);
  const chooseState = (next: MoneyExampleState) => {
    setState(next);
    setDate(moneyExampleDates[next]);
  };

  return (
    <div className={styles.root()}>
      <StateSwitch
        choices={moneyExampleChoices}
        label={moneyExampleCopy.states}
        onValueChange={chooseState}
        value={state}
      />
      <div className={styles.stage()}>
        <MoneyCalendar
          options={moneyExampleOptions}
          payments={examplePayments}
          selection={{ value: date, onValueChange: setDate }}
        />
      </div>
    </div>
  );
}

export { MoneyCalendarExample };
