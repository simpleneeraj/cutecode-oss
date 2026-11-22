"use client";

import type { ReactNode } from "react";

import type { PlainDate, SpanBar, ViewSettings } from "../../types";
import { DragTip } from "../drag/tip";
import { dragItemStyles } from "../drag/style";
import { useDragItem } from "../drag/use-drag-item";
import { barSlotStyle } from "./geometry";
import { stopBubble } from "./month-chip";
import { monthCellStyles } from "./style";

type BarItemProps = {
  bar: SpanBar;
  date: PlainDate;
  settings: ViewSettings;
  children: ReactNode;
};

type ChipItemProps = {
  itemKey: string;
  date: PlainDate;
  settings: ViewSettings;
  children: ReactNode;
};

const cellStyles = monthCellStyles();

function BarItem({ bar, date, settings, children }: BarItemProps) {
  const { ref, look, store } = useDragItem(bar.key, date);

  return (
    <span
      ref={ref}
      className={dragItemStyles({ look, class: cellStyles.barSlot() })}
      data-occurrence-key={bar.key}
      data-slot="month-drag-item"
      onClick={stopBubble}
      onDoubleClick={stopBubble}
      style={barSlotStyle(bar)}
    >
      {children}
      <DragTip date={date} settings={settings} slotKey={bar.key} store={store} />
    </span>
  );
}

function ChipItem({ itemKey, date, settings, children }: ChipItemProps) {
  const { ref, look, store } = useDragItem(itemKey, date);

  return (
    <span
      ref={ref}
      className={dragItemStyles({ look, class: cellStyles.chipItem() })}
      data-occurrence-key={itemKey}
      data-slot="month-drag-item"
    >
      {children}
      <DragTip date={date} settings={settings} slotKey={itemKey} store={store} />
    </span>
  );
}

export { BarItem, ChipItem };
