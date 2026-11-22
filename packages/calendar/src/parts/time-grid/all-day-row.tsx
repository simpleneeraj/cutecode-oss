"use client";

import { use } from "react";

import { calendarOf } from "../../event";
import type { EventOccurrence } from "../../types";
import { DragContext } from "../drag/context";
import { useLanesDropRef } from "../drag/source";
import { AllDayItem } from "./all-day-item";
import type { ColumnFocus } from "./day-column";
import { barKeyOf, shownBars } from "./focus";
import { columnsStyle } from "./geometry";
import type { GridModel } from "./model";
import { SpanBar } from "./span-bar";
import { allDayStyles } from "./style";

type AllDayRowProps = {
  model: GridModel;
  focus: ColumnFocus;
  onOpen: (occurrence: EventOccurrence) => void;
};

const allDayCopy = {
  label: "all-day",
};

function AllDayRow({ model, focus, onOpen }: AllDayRowProps) {
  const styles = allDayStyles({ hasSecondaryZone: model.secondary !== null });
  const lanesRef = useLanesDropRef(use(DragContext)?.gridId ?? null);

  return (
    <div className={styles.root()} data-slot="all-day-row" role="row">
      <span aria-hidden="true" className={styles.label()}>
        {allDayCopy.label}
      </span>
      <div
        ref={lanesRef}
        aria-colspan={model.columns.length}
        aria-label={allDayCopy.label}
        className={styles.lanes()}
        data-slot="all-day-lanes"
        role="gridcell"
        style={columnsStyle(model.columns.length)}
      >
        {shownBars(model).map((bar) => (
          <AllDayItem key={`${bar.key}|${bar.startIndex}`} bar={bar} date={model.columns[bar.startIndex]?.column.day.date ?? ""}>
            <SpanBar
              bar={bar}
              calendar={calendarOf(bar.occurrence.event, model.calendars)}
              focusProps={focus.focusPropsFor(barKeyOf(bar, model))}
              onOpen={onOpen}
              view={model.blockView}
            />
          </AllDayItem>
        ))}
      </div>
    </div>
  );
}

export { AllDayRow };
