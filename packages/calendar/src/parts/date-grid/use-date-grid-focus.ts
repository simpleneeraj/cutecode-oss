"use client";

import { flushSync } from "react-dom";

import { minutes } from "../../time";
import type { GridFocus, KeyCommand, PlainDate, TextDirection } from "../../types";
import { dayKey, daySlot, moveMonthFocus } from "../month-grid/focus";
import { focusElement, useGridFocus } from "../roving-focus/use-grid-focus";
import { dayColumnKey } from "../time-grid/focus";
import { moveWithin } from "./move";

export type DateGridFocusOptions = {
  dates: PlainDate[];
  fallbackDate: PlainDate;
  direction: TextDirection;
  timeZone: string;
  onReveal?: (date: PlainDate) => void;
};

export type DateCellFocus = {
  tabIndex: number;
  "data-focus-key": string;
  onFocus: () => void;
};

export function useDateGridFocus({ dates, fallbackDate, direction, timeZone, onReveal }: DateGridFocusOptions) {
  const grid = { dates, columnKeys: [dayColumnKey], stepMinutes: minutes.hour, days: [], timeZone };
  const reveal = (date: PlainDate) => {
    const isShown = dates.includes(date);
    if (isShown || onReveal === undefined) {
      return;
    }
    flushSync(() => onReveal(date));
    focusElement(gridFocus.gridRef.current, dayKey(date));
  };
  const moveInside = (focus: GridFocus, command: KeyCommand) => moveWithin(focus, command, dates);
  const gridFocus = useGridFocus({
    grid,
    initialFocus: daySlot(fallbackDate),
    direction,
    move: onReveal === undefined ? moveInside : moveMonthFocus,
    onFocusChange: (focus) => reveal(focus.date),
  });
  const isFocusShown = dates.includes(gridFocus.focus.date);
  const activeDate = isFocusShown ? gridFocus.focus.date : fallbackDate;
  const cellFocus = (date: PlainDate): DateCellFocus => ({
    tabIndex: date === activeDate ? 0 : -1,
    "data-focus-key": dayKey(date),
    onFocus: () => gridFocus.select(daySlot(date)),
  });
  return { gridRef: gridFocus.gridRef, onKeyDown: gridFocus.onKeyDown, cellFocus };
}
