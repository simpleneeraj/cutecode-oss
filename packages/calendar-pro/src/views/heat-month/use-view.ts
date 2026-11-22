"use client";

import { resolveSettings, textDirectionOf } from "@cutecode/calendar/locale";
import { useAnnouncer } from "@cutecode/calendar/parts/live-region/use-announcer";
import { useMinuteClock } from "@cutecode/calendar/parts/now-line/clock";
import { useGridFocus } from "@cutecode/calendar/parts/roving-focus/use-grid-focus";
import { pickerMonth, SelectionMode } from "@cutecode/calendar/picker";
import { addMonths, dateOf, parseDateTime, startOfMonth } from "@cutecode/calendar/time";
import {
  AnnouncementKind,
  type DaySpan,
  type GridFocus,
  type KeyCommand,
  type PlainDate,
} from "@cutecode/calendar/types";
import { useState } from "react";

import { tabStopOf, tileFocus, tileKey, moveInMonth } from "./focus";
import { countShown, HeatLook, heatMonthModel } from "./model";
import type { HeatMonthProps } from "./props";
import type { TileFocusProps } from "./tile";

const noRules = {};

const noDays: DaySpan[] = [];

function useMonthBrowse(value: PlainDate) {
  const [browse, setBrowse] = useState({ value, month: startOfMonth(value) });
  const month = browse.value === value ? browse.month : startOfMonth(value);
  const step = (offset: number) => setBrowse({ value, month: addMonths(month, offset) });
  return { month, step };
}

function useTileFocus(dates: PlainDate[], active: PlainDate, direction: ReturnType<typeof textDirectionOf>) {
  const grid = { dates, columnKeys: [], stepMinutes: 0, days: noDays, timeZone: "UTC" };
  const move = (focus: GridFocus, command: KeyCommand) => moveInMonth(focus, command, dates);
  const { focus, gridRef, onKeyDown, select } = useGridFocus({
    grid,
    initialFocus: tileFocus(active),
    direction,
    move,
  });
  const tabStop = tabStopOf(focus.date, active, dates);
  const propsFor = (date: PlainDate): TileFocusProps => ({
    tabIndex: date === tabStop ? 0 : -1,
    "data-focus-key": tileKey(date),
    onFocus: () => select(tileFocus(date)),
  });
  return { gridRef, onKeyDown, propsFor };
}

export function useHeatMonth({ data, selection, options }: HeatMonthProps) {
  const settings = resolveSettings(options);
  const direction = textDirectionOf(settings.locale);
  const pinned = options.now === undefined ? undefined : parseDateTime(options.now, settings.timeZone);
  const now = useMinuteClock(pinned);
  const today = now === null ? "" : dateOf(now, settings.timeZone);
  const { month, step } = useMonthBrowse(selection.value);
  const picked = pickerMonth(month, settings, { mode: SelectionMode.Single, date: selection.value }, noRules, today);
  const model = heatMonthModel(picked, countShown(data, picked, settings.timeZone), settings);
  const dates = picked
    .flat()
    .filter((day) => day.inMonth)
    .map((day) => day.date);
  const isSelectedShown = dates.includes(selection.value);
  const focus = useTileFocus(dates, isSelectedShown ? selection.value : (dates[0] ?? ""), direction);
  const { announce, message } = useAnnouncer(settings);
  const select = (date: PlainDate) => {
    const eventCount = model.weeks.flat().find((tile) => tile.date === date)?.count ?? 0;
    announce({ kind: AnnouncementKind.DayFocused, date, eventCount });
    selection.onValueChange(date);
  };
  return { settings, direction, month, step, model, focus, select, message, look: options.look ?? HeatLook.Count };
}

export type HeatMonthView = ReturnType<typeof useHeatMonth>;
