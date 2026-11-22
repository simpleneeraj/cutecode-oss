"use client";

import type { ReactNode } from "react";

import type { PlainDate, SpanBar } from "../../types";
import { dragItemStyles } from "../drag/style";
import { useDragItem } from "../drag/use-drag-item";
import { barStyle } from "./geometry";
import { allDayStyles } from "./style";

type AllDayItemProps = {
  bar: SpanBar;
  date: PlainDate;
  children: ReactNode;
};

const styles = allDayStyles({ hasSecondaryZone: false });

function AllDayItem({ bar, date, children }: AllDayItemProps) {
  const { ref, look } = useDragItem(bar.key, date);

  return (
    <span ref={ref} className={dragItemStyles({ look, class: styles.item() })} data-slot="all-day-item" style={barStyle(bar)}>
      {children}
    </span>
  );
}

export { AllDayItem };
