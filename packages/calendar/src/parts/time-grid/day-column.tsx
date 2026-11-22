import { use } from "react";

import { formatDayLabel } from "../../locale";
import { FocusTarget, type EventOccurrence, type GridFocus } from "../../types";
import { DragContext } from "../drag/context";
import { useDropCellRef } from "../drag/source";
import { NowLine } from "../now-line";
import { NowEmphasis } from "../now-line/emphasis";
import { slotKey, type FocusProps } from "../roving-focus/focus-key";
import { offsetAt } from "./axis";
import { ColumnEvents } from "./column-events";
import { ColumnShading } from "./column-shading";
import type { GridColumn } from "./columns";
import { DraftGhost } from "./draft-ghost";
import { dayColumnKey } from "./focus";
import { rowsLength } from "./geometry";
import type { GridModel } from "./model";
import { dayColumnStyles } from "./style";

export type ColumnFocus = {
  activeFocus: GridFocus;
  focusPropsFor: (key: string) => FocusProps;
};

type DayColumnProps = {
  column: GridColumn;
  model: GridModel;
  focus: ColumnFocus;
  onOpen: (occurrence: EventOccurrence) => void;
};

function focusRingOffset(column: GridColumn, model: GridModel, focus: GridFocus): number | null {
  const isHere = focus.target === FocusTarget.Slot && focus.date === column.column.day.date;
  return isHere ? offsetAt(column.track, focus.minute, model.visible) : null;
}

function DayColumn({ column, model, focus, onOpen }: DayColumnProps) {
  const { date } = column.column.day;
  const styles = dayColumnStyles({ isWeekend: column.isWeekend });
  const drag = use(DragContext);
  const dropRef = useDropCellRef(drag?.gridId ?? null, date);

  return (
    <div
      ref={dropRef}
      {...focus.focusPropsFor(slotKey(date, dayColumnKey))}
      {...drag?.handlersFor?.(column)}
      aria-label={formatDayLabel(date, model.settings)}
      className={styles.root()}
      data-column-key={dayColumnKey}
      data-date={date}
      data-slot="day-column"
      role="gridcell"
      style={{ blockSize: rowsLength(model.visible.rows.length) }}
    >
      <ColumnShading column={column} ringOffset={focusRingOffset(column, model, focus.activeFocus)} />
      <ColumnEvents column={column} focusPropsFor={focus.focusPropsFor} model={model} onOpen={onOpen} />
      <DraftGhost column={column} model={model} />
      {column.nowOffset !== null && <NowLine emphasis={NowEmphasis.Today} offset={column.nowOffset} />}
    </div>
  );
}

export { DayColumn };
