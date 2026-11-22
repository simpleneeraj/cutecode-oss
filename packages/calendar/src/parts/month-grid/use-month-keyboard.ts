"use client";

import type { FocusEvent, KeyboardEvent } from "react";

import { dateOf, minutes } from "../../time";
import { commandFor } from "../../keyboard";
import { AnnouncementKind, KeyboardMode, KeyCommand, type Announcement, type GridFocus, type PlainDate } from "../../types";
import { monthItemOf } from "../drag/month-session";
import type { DeleteAsk } from "../drag/use-delete-ask";
import type { MonthCarry } from "../drag/use-month-carry";
import { focusElement, useGridFocus } from "../roving-focus/use-grid-focus";
import { dayColumnKey } from "../time-grid/focus";
import { viewCommands } from "../time-grid/use-grid-keyboard";
import { NavigationSource, type GridNavigation } from "../time-grid/use-grid-navigation";
import { dateForKey, dayKey, daySlot, moveMonthFocus, startingDate } from "./focus";
import { useShortcutSheet } from "../shortcuts/use-shortcut-sheet";
import type { SharedCommandContext } from "../shortcuts/shared-commands";
import type { CalendarActions } from "../time-grid/props";
import { runMonthEditCommand, runMonthItemCommand } from "./month-commands";
import type { MonthState } from "./use-month-model";

type CommandTarget = Pick<SharedCommandContext, "root" | "openShortcuts"> & {
  moveTo: (focus: GridFocus) => void;
};

type MonthKeyboardOptions = {
  month: MonthState;
  navigation: GridNavigation;
  announce: (announcement: Announcement) => void;
  onOpenDay: (date: PlainDate) => void;
  actions: CalendarActions;
  editing: { carry: MonthCarry; deleteAsk: DeleteAsk };
};

function cellDateOf(target: EventTarget, dates: PlainDate[]): PlainDate | undefined {
  const key = target instanceof HTMLElement ? target.dataset.focusKey : undefined;
  return key === undefined ? undefined : dateForKey(key, dates);
}

function eventCountOn(month: MonthState, date: PlainDate): number {
  const day = month.model.weeks.flatMap((week) => week.days).find((candidate) => candidate.date === date);
  return day?.eventCount ?? 0;
}

function changeFocus(focus: GridFocus, options: MonthKeyboardOptions, container: HTMLElement | null) {
  const isShown = options.month.model.dates.includes(focus.date);
  if (!isShown) {
    options.navigation.goTo(focus.date, NavigationSource.Keyboard);
    focusElement(container, dayKey(focus.date));
    return;
  }
  const eventCount = eventCountOn(options.month, focus.date);
  options.announce({ kind: AnnouncementKind.DayFocused, date: focus.date, eventCount });
}

function runCommand(
  command: KeyCommand,
  focus: GridFocus,
  options: MonthKeyboardOptions,
  target: CommandTarget,
): boolean {
  const view = viewCommands[command];
  if (view !== undefined) {
    options.navigation.changeView(view);
    return true;
  }
  if (command === KeyCommand.Today) {
    target.moveTo(daySlot(dateOf(Date.now(), options.month.settings.timeZone)));
    return true;
  }
  if (command === KeyCommand.OpenEvent) {
    options.onOpenDay(focus.date);
    return true;
  }
  const { month, announce, actions } = options;
  const refocus = () => target.moveTo(daySlot(focus.date));
  const context = { ...target, month, announce, actions, refocus, onUndo: actions.onUndo };
  return runMonthEditCommand(command, focus.date, context);
}

function runItemKey(event: KeyboardEvent<HTMLElement>, options: MonthKeyboardOptions, target: CommandTarget) {
  const { month, announce, actions, editing } = options;
  const item = monthItemOf(event.target, month.model);
  const command = item === null ? null : commandFor(event, KeyboardMode.Browse, month.direction);
  if (item === null || command === null) {
    return;
  }
  const refocus = () => target.moveTo(daySlot(item.origin.date));
  const context = { ...target, ...editing, month, announce, actions, refocus, onUndo: actions.onUndo };
  if (runMonthItemCommand(command, item, context)) {
    event.preventDefault();
  }
}

function routeKey(
  event: KeyboardEvent<HTMLElement>,
  options: MonthKeyboardOptions,
  onCellKey: (event: KeyboardEvent<HTMLElement>) => void,
  target: CommandTarget,
) {
  const isCarried = options.editing.carry.handleKey(event);
  const isOnCell = cellDateOf(event.target, options.month.model.dates) !== undefined;
  if (isCarried) {
    return;
  }
  if (isOnCell) {
    onCellKey(event);
    return;
  }
  runItemKey(event, options, target);
}

export function useMonthKeyboard(options: MonthKeyboardOptions) {
  const { model, settings, direction, anchor, selected } = options.month;
  const fallbackDate = startingDate(model.dates, selected, anchor);
  const grid = { dates: model.dates, columnKeys: [dayColumnKey], stepMinutes: minutes.hour, days: [], timeZone: settings.timeZone };
  const shortcuts = useShortcutSheet();
  const commandTarget = (): CommandTarget => ({
    root: gridFocus.gridRef.current,
    moveTo: gridFocus.moveTo,
    openShortcuts: shortcuts.open,
  });
  const gridFocus = useGridFocus({
    grid,
    initialFocus: daySlot(fallbackDate),
    direction,
    move: moveMonthFocus,
    onFocusChange: (focus) => changeFocus(focus, options, gridFocus.gridRef.current),
    onCommand: (command, focus) => runCommand(command, focus, options, commandTarget()),
  });
  const isFocusShown = model.dates.includes(gridFocus.focus.date);
  const activeDate = isFocusShown ? gridFocus.focus.date : fallbackDate;

  const onFocusCapture = (event: FocusEvent<HTMLElement>) => {
    const date = cellDateOf(event.target, model.dates);
    if (date !== undefined) {
      gridFocus.select(daySlot(date));
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => routeKey(event, options, gridFocus.onKeyDown, commandTarget());
  const onBlur = options.editing.carry.onBlur;

  return { gridRef: gridFocus.gridRef, shortcuts: shortcuts.sheet, keyboard: { onKeyDown, onBlur, onFocusCapture, activeDate } };
}

export type MonthKeyboard = ReturnType<typeof useMonthKeyboard>["keyboard"];
