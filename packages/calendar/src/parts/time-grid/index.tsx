"use client";

import type { RefObject } from "react";

import type { EventOccurrence } from "../../types";
import { AllDayRow } from "./all-day-row";
import { BodyRow } from "./body-row";
import type { GridColumn } from "./columns";
import type { FoldEdge } from "./fold";
import { FoldPill } from "./fold-pill";
import { hourHeightStyle } from "./geometry";
import { HeaderRow } from "./header-row";
import type { GridModel } from "./model";
import { timeGridStyles } from "./style";
import type { GridKeyboard } from "./use-grid-keyboard";

export type TimeGridActions = {
  onOpen: (occurrence: EventOccurrence) => void;
  onOpenDay: ((column: GridColumn) => void) | null;
  onToggleFold: (edge: FoldEdge) => void;
};

type TimeGridProps = {
  model: GridModel;
  gridRef: RefObject<HTMLDivElement | null>;
  keyboard: GridKeyboard;
  isBusy: boolean;
  actions: TimeGridActions;
};

const styles = timeGridStyles();

function TimeGrid({ model, gridRef, keyboard, isBusy, actions }: TimeGridProps) {
  const [earlier, later] = model.pills;
  const columnCount = model.columns.length;

  return (
    <div
      ref={gridRef}
      aria-busy={isBusy}
      aria-label={`${model.heading.title}, ${model.heading.subtitle}`}
      className={styles.root()}
      data-slot="time-grid"
      onBlur={keyboard.onBlur}
      onFocusCapture={keyboard.onFocusCapture}
      onKeyDown={keyboard.onKeyDown}
      role="grid"
      style={hourHeightStyle(model.blockView.hourHeight)}
    >
      <div className={styles.sticky()} role="rowgroup">
        <HeaderRow model={model} onOpenDay={actions.onOpenDay} />
        <AllDayRow focus={keyboard.focus} model={model} onOpen={actions.onOpen} />
      </div>
      <div role="rowgroup">
        {earlier && <FoldPill columnCount={columnCount} onToggle={actions.onToggleFold} pill={earlier} />}
        <BodyRow focus={keyboard.focus} isBusy={isBusy} model={model} onOpen={actions.onOpen} />
        {later && <FoldPill columnCount={columnCount} onToggle={actions.onToggleFold} pill={later} />}
      </div>
    </div>
  );
}

export { TimeGrid };
