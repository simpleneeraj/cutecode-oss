"use client";

import { AltArrowLeftIcon } from "@solar-icons/react/linear/alt-arrow-left";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { ListIcon } from "@solar-icons/react/linear/list";
import { Widget2Icon } from "@solar-icons/react/linear/widget-2";
import { Button } from "@cutecode/ui/components/button";
import { ToggleGroup, ToggleGroupItem } from "@cutecode/ui/components/toggle-group";

import { monthNavCopy } from "../../parts/picker-frame/month-nav";
import { CompactLayout, compactMonthCopy } from "./model";
import { compactMonthStyles } from "./style";

type MonthHeadProps = {
  title: string;
  layout: CompactLayout;
  onLayoutChange: (layout: CompactLayout) => void;
  onStep: (offset: number) => void;
};

const styles = compactMonthStyles();
const layouts = [CompactLayout.Grid, CompactLayout.List];

function MonthHead({ title, layout, onLayoutChange, onStep }: MonthHeadProps) {
  const chooseLayout = (values: unknown[]) => {
    const next = layouts.find((candidate) => candidate === values[0]);
    if (next !== undefined) {
      onLayoutChange(next);
    }
  };

  return (
    <div className={styles.head()}>
      <h3 aria-live="polite" className={styles.title()}>
        {title}
      </h3>
      <div className={styles.steps()}>
        <Button aria-label={monthNavCopy.previousMonth} onClick={() => onStep(-1)} size="icon-sm" variant="ghost">
          <AltArrowLeftIcon aria-hidden="true" className={styles.arrow()} />
        </Button>
        <Button aria-label={monthNavCopy.nextMonth} onClick={() => onStep(1)} size="icon-sm" variant="ghost">
          <AltArrowRightIcon aria-hidden="true" className={styles.arrow()} />
        </Button>
      </div>
      <ToggleGroup aria-label={compactMonthCopy.layout} onValueChange={chooseLayout} value={[layout]}>
        <ToggleGroupItem aria-label={compactMonthCopy.grid} value={CompactLayout.Grid}>
          <Widget2Icon aria-hidden="true" className={styles.toggleIcon()} />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label={compactMonthCopy.list} value={CompactLayout.List}>
          <ListIcon aria-hidden="true" className={styles.toggleIcon()} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export { MonthHead };
