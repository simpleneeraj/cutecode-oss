"use client";

import { AltArrowLeftIcon } from "@solar-icons/react/linear/alt-arrow-left";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { Button } from "@cutecode/ui/components/button";
import { ToggleGroup, ToggleGroupItem } from "@cutecode/ui/components/toggle-group";

import type { ViewKind } from "../../types";
import type { ToolbarHeading } from "./heading";
import { calendarToolbarStyles } from "./style";
import { isViewKind, stepLabels, toolbarCopy, viewOptions } from "./view-options";

export type ToolbarSteps = {
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};

type CalendarToolbarProps = {
  heading: ToolbarHeading;
  view: ViewKind;
  onViewChange: (view: ViewKind) => void;
  steps: ToolbarSteps;
  views: ViewKind[];
};

const styles = calendarToolbarStyles();

function CalendarToolbar({ heading, view, onViewChange, steps, views }: CalendarToolbarProps) {
  const labels = stepLabels[view];
  const options = viewOptions.filter((option) => views.includes(option.view));
  const selectView = (values: unknown[]) => {
    const [next] = values;
    if (isViewKind(next)) {
      onViewChange(next);
    }
  };

  return (
    <div className={styles.root()} data-slot="calendar-toolbar">
      <div className={styles.heading()}>
        <h2 className={styles.title()}>{heading.title}</h2>
        <span className={styles.subtitle()}>{heading.subtitle}</span>
      </div>
      <div className={styles.stepper()}>
        <Button aria-label={labels.previous} onClick={steps.onPrevious} size="icon-sm" variant="outline">
          <AltArrowLeftIcon aria-hidden="true" className={styles.arrow()} />
        </Button>
        <Button onClick={steps.onToday} size="sm" variant="outline">
          {toolbarCopy.today}
        </Button>
        <Button aria-label={labels.next} onClick={steps.onNext} size="icon-sm" variant="outline">
          <AltArrowRightIcon aria-hidden="true" className={styles.arrow()} />
        </Button>
      </div>
      <ToggleGroup aria-label={toolbarCopy.viewGroup} onValueChange={selectView} value={[view]}>
        {options.map((option) => (
          <ToggleGroupItem key={option.view} aria-label={option.label} value={option.view}>
            <span className={styles.fullLabel()}>{option.label}</span>
            <span aria-hidden="true" className={styles.letter()}>
              {option.letter}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

export { CalendarToolbar };
