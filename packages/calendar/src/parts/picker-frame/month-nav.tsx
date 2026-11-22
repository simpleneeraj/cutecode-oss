"use client";

import { AltArrowLeftIcon } from "@solar-icons/react/linear/alt-arrow-left";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { Button } from "@cutecode/ui/components/button";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@cutecode/ui/components/select";
import type { ReactNode } from "react";

import type { DateRules } from "../../picker";
import { addMonths, startOfMonth } from "../../time";
import type { PlainDate, ViewSettings } from "../../types";
import { isMonthAllowed, monthChoices, yearChoices, type MonthChoice } from "./choices";
import { monthNavStyles } from "./style";

type MonthNavProps = {
  month: PlainDate;
  settings: ViewSettings;
  rules: DateRules;
  onMonthChange: (month: PlainDate) => void;
};

type ChoiceSelectProps = {
  label: string;
  value: PlainDate;
  choices: MonthChoice[];
  onMonthChange: (month: PlainDate) => void;
};

type StepButtonProps = {
  label: string;
  target: PlainDate;
  rules: DateRules;
  onMonthChange: (month: PlainDate) => void;
  children: ReactNode;
};

export const monthNavCopy = {
  previousMonth: "Previous month",
  nextMonth: "Next month",
  month: "Month",
  year: "Year",
};

const styles = monthNavStyles();

function ChoiceSelect({ label, value, choices, onMonthChange }: ChoiceSelectProps) {
  const choose = (next: PlainDate | null) => {
    if (next !== null) {
      onMonthChange(next);
    }
  };

  return (
    <Select items={choices} onValueChange={choose} value={value}>
      <SelectTrigger aria-label={label} className={styles.trigger()} size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectPopup>
        {choices.map((choice) => (
          <SelectItem key={choice.value} value={choice.value}>
            {choice.label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}

function StepButton({ label, target, rules, onMonthChange, children }: StepButtonProps) {
  return (
    <Button
      aria-label={label}
      disabled={!isMonthAllowed(target, rules)}
      onClick={() => onMonthChange(target)}
      size="icon-sm"
      variant="ghost"
    >
      {children}
    </Button>
  );
}

function MonthNav({ month, settings, rules, onMonthChange }: MonthNavProps) {
  const shown = startOfMonth(month);
  const step = { rules, onMonthChange };

  return (
    <div className={styles.root()}>
      <StepButton {...step} label={monthNavCopy.previousMonth} target={addMonths(shown, -1)}>
        <AltArrowLeftIcon aria-hidden="true" className={styles.arrow()} />
      </StepButton>
      <div className={styles.selects()}>
        <ChoiceSelect
          choices={monthChoices(shown, rules, settings)}
          label={monthNavCopy.month}
          onMonthChange={onMonthChange}
          value={shown}
        />
        <ChoiceSelect
          choices={yearChoices(shown, rules, settings)}
          label={monthNavCopy.year}
          onMonthChange={onMonthChange}
          value={shown}
        />
      </div>
      <StepButton {...step} label={monthNavCopy.nextMonth} target={addMonths(shown, 1)}>
        <AltArrowRightIcon aria-hidden="true" className={styles.arrow()} />
      </StepButton>
    </div>
  );
}

export { MonthNav };
