"use client";

import { ToggleGroup, ToggleGroupItem } from "@cutecode/ui/components/toggle-group";

import { stateSwitchStyles } from "./style";

export type StateChoice<Kind extends string> = {
  kind: Kind;
  label: string;
};

type StateSwitchProps<Kind extends string> = {
  label: string;
  choices: StateChoice<Kind>[];
  value: Kind;
  onValueChange: (kind: Kind) => void;
};

const styles = stateSwitchStyles();

function StateSwitch<Kind extends string>({ label, choices, value, onValueChange }: StateSwitchProps<Kind>) {
  const choose = (values: unknown[]) => {
    const [next] = values;
    const choice = choices.find((candidate) => candidate.kind === next);
    if (choice !== undefined) {
      onValueChange(choice.kind);
    }
  };

  return (
    <div className={styles.strip()}>
      <ToggleGroup aria-label={label} onValueChange={choose} value={[value]}>
        {choices.map((choice) => (
          <ToggleGroupItem key={choice.kind} value={choice.kind}>
            {choice.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

export { StateSwitch };
