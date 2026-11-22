"use client";

import { use, type MouseEvent } from "react";

import { dayCellName } from "../../announce";
import { calendarOf } from "../../event";
import { formatPlainDate } from "../../locale";
import type { Calendar, PlainDate } from "../../types";
import { DragContext } from "../drag/context";
import { useDropCellRef } from "../drag/source";
import type { BlockView } from "../event-block/appearance";
import { eventKey, focusPropsOf } from "../roving-focus/focus-key";
import { SpanBar } from "../time-grid/span-bar";
import { dayKey, daySlot } from "./focus";
import { chipsStyle } from "./geometry";
import { monthMetrics } from "./metrics";
import { MonthChip, stopBubble } from "./month-chip";
import { BarItem, ChipItem } from "./month-items";
import type { MonthDay } from "./model";
import { monthCellStyles } from "./style";
import type { MonthActions } from "./use-month-view";

export type MonthCellContext = {
  view: BlockView;
  calendars: Calendar[];
  activeDate: PlainDate;
};

type MonthCellProps = {
  day: MonthDay;
  lanes: number;
  context: MonthCellContext;
  actions: MonthActions;
};

type CellPartProps = {
  cell: MonthCellProps;
  tabIndex: number;
  styles: ReturnType<typeof monthCellStyles>;
};

const monthCellCopy = {
  more: "more",
};

function CellBars({ cell, tabIndex }: CellPartProps) {
  const { day, context, actions } = cell;
  return day.bars.map((bar) => (
    <BarItem key={bar.key} bar={bar} date={day.date} settings={context.view.settings}>
      <SpanBar
        bar={bar}
        calendar={calendarOf(bar.occurrence.event, context.calendars)}
        focusProps={{ tabIndex, "data-focus-key": eventKey(bar.key, day.date) }}
        onOpen={actions.onOpen}
        view={context.view}
      />
    </BarItem>
  ));
}

function CellChips({ cell, tabIndex, styles }: CellPartProps) {
  const { day, lanes, context, actions } = cell;
  const openMore = (event: MouseEvent) => {
    event.stopPropagation();
    actions.onOpenDay(day.date);
  };

  return (
    <span className={styles.chips()} data-slot="month-chips" style={chipsStyle(lanes)}>
      {day.chips.map((occurrence) => (
        <ChipItem key={occurrence.key} date={day.date} itemKey={occurrence.key} settings={context.view.settings}>
          <MonthChip
            calendar={calendarOf(occurrence.event, context.calendars)}
            occurrence={occurrence}
            onOpen={actions.onOpen}
            tabIndex={tabIndex}
            view={context.view}
          />
        </ChipItem>
      ))}
      {day.hiddenCount > 0 && (
        <button className={styles.more()} onClick={openMore} onDoubleClick={stopBubble} tabIndex={tabIndex} type="button">
          +{day.hiddenCount} {monthCellCopy.more}
        </button>
      )}
    </span>
  );
}

function CellDots({ cell, styles }: CellPartProps) {
  const ids = Array.from({ length: Math.min(cell.day.eventCount, monthMetrics.dotLimit) }, (_, index) => index);
  return (
    <span aria-hidden="true" className={styles.dots()}>
      {ids.map((id) => (
        <span key={id} className={styles.dot()} />
      ))}
    </span>
  );
}

function MonthCell(props: MonthCellProps) {
  const { day, context, actions } = props;
  const styles = monthCellStyles({
    inMonth: day.inMonth,
    isSelected: day.isSelected,
    isToday: day.isToday,
    isWeekend: day.isWeekend,
  });
  const tabIndex = day.date === context.activeDate ? 0 : -1;
  const parts = { cell: props, tabIndex, styles };
  const dropRef = useDropCellRef(use(DragContext)?.gridId ?? null, day.date);

  return (
    <div
      ref={dropRef}
      {...focusPropsOf(dayKey(day.date), daySlot(context.activeDate))}
      aria-current={day.isToday ? "date" : undefined}
      aria-label={dayCellName(day.date, day.eventCount, context.view.settings)}
      aria-selected={day.isSelected}
      className={styles.root()}
      data-date={day.date}
      data-slot="month-cell"
      onClick={() => actions.onSelect(day.date)}
      onDoubleClick={() => actions.onOpenDay(day.date)}
      role="gridcell"
    >
      <span aria-hidden="true" className={styles.number()}>
        {formatPlainDate(day.date, context.view.settings, { day: "numeric" })}
      </span>
      <CellBars {...parts} />
      <CellChips {...parts} />
      <CellDots {...parts} />
    </div>
  );
}

export { MonthCell };
