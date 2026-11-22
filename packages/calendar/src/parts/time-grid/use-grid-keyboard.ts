"use client";

import type { FocusEvent, KeyboardEvent } from "react";
import { flushSync } from "react-dom";

import { AnnouncementKind, KeyCommand, ViewKind, type Announcement, type GridFocus, type Instant } from "../../types";
import { focusKeyOf, focusPropsOf } from "../roving-focus/focus-key";
import { useGridFocus } from "../roving-focus/use-grid-focus";
import { useShortcutSheet } from "../shortcuts/use-shortcut-sheet";
import { AxisSide, type FoldControl } from "./axis";
import {
  columnOfFocus,
  commandFocus,
  eventCountAtSlot,
  focusForKey,
  focusGridOf,
  focusInstant,
  foldSideOf,
  shownFocus,
  startingFocus,
} from "./focus";
import { runEditCommand, slotUnder, type GridEditing } from "./grid-commands";
import type { GridModel } from "./model";
import { NavigationSource, type GridNavigation } from "./use-grid-navigation";

type GridKeyboardOptions = {
  model: GridModel;
  now: Instant | null;
  fold: FoldControl;
  navigation: GridNavigation;
  announce: (announcement: Announcement) => void;
  editing: GridEditing;
};

export const viewCommands: Partial<Record<KeyCommand, ViewKind>> = {
  [KeyCommand.ShowDay]: ViewKind.Day,
  [KeyCommand.ShowWeek]: ViewKind.Week,
  [KeyCommand.ShowMonth]: ViewKind.Month,
  [KeyCommand.ShowYear]: ViewKind.Year,
  [KeyCommand.ShowAgenda]: ViewKind.Agenda,
};

function focusElement(container: HTMLElement | null, focus: GridFocus) {
  const selector = `[data-focus-key="${CSS.escape(focusKeyOf(focus))}"]`;
  container?.querySelector<HTMLElement>(selector)?.focus();
}

function openFoldFor(focus: GridFocus, model: GridModel, fold: FoldControl) {
  const side = foldSideOf(focus, model);
  if (side === AxisSide.Inside) {
    return;
  }
  const isEarlier = side === AxisSide.Before;
  const next = isEarlier ? { ...fold.open, earlier: true } : { ...fold.open, later: true };
  flushSync(() => fold.setOpen(next));
}

function changeFocus(focus: GridFocus, options: GridKeyboardOptions, container: HTMLElement | null) {
  const { model } = options;
  const column = columnOfFocus(focus, model);
  if (column === undefined) {
    options.navigation.goTo(focus.date, NavigationSource.Keyboard);
    focusElement(container, focus);
    return;
  }
  openFoldFor(focus, model, options.fold);
  const eventCount = eventCountAtSlot(column, focus.minute);
  const instant = focusInstant(focus, column);
  options.announce({ kind: AnnouncementKind.FocusMoved, instant, allDay: false, eventCount });
}

type CommandTarget = {
  root: HTMLElement | null;
  moveTo: (focus: GridFocus) => void;
  openShortcuts: () => void;
};

function runCommand(command: KeyCommand, focus: GridFocus, options: GridKeyboardOptions, target: CommandTarget): boolean {
  const view = viewCommands[command];
  const next = commandFocus(command, focus, options.model);
  if (view !== undefined) {
    options.navigation.changeView(view);
  }
  if (next !== null) {
    target.moveTo(next);
  }
  const isHandled = view !== undefined || next !== null;
  const { model, announce, editing } = options;
  const refocus = () => target.moveTo(slotUnder(focus));
  const context = { ...editing, ...target, model, announce, refocus, onUndo: editing.actions.onUndo };
  return isHandled || runEditCommand(command, focus, context);
}

function syncFocus(
  event: FocusEvent<HTMLElement>,
  model: GridModel,
  current: GridFocus,
  select: (focus: GridFocus) => void,
) {
  const key = event.target.dataset.focusKey;
  const next = key === undefined ? null : focusForKey(key, model, current);
  if (next !== null) {
    select(next);
  }
}

export function useGridKeyboard(options: GridKeyboardOptions) {
  const { model, now } = options;
  const shortcuts = useShortcutSheet();
  const gridFocus = useGridFocus({
    grid: focusGridOf(model),
    initialFocus: startingFocus(model, now),
    direction: model.direction,
    onFocusChange: (focus) => changeFocus(focus, options, gridFocus.gridRef.current),
    onCommand: (command, focus) =>
      runCommand(command, focus, options, {
        root: gridFocus.gridRef.current,
        moveTo: gridFocus.moveTo,
        openShortcuts: shortcuts.open,
      }),
  });
  const activeFocus = shownFocus(gridFocus.focus, model, now);
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const isCarried = options.editing.keyboardEdit.handleKey(event);
    if (!isCarried) {
      gridFocus.onKeyDown(event);
    }
  };

  return {
    gridRef: gridFocus.gridRef,
    shortcuts: shortcuts.sheet,
    keyboard: {
      onKeyDown,
      onBlur: options.editing.keyboardEdit.onBlur,
      onFocusCapture: (event: FocusEvent<HTMLElement>) => syncFocus(event, model, activeFocus, gridFocus.select),
      focus: { activeFocus, focusPropsFor: (key: string) => focusPropsOf(key, activeFocus) },
    },
  };
}

export type GridKeyboard = ReturnType<typeof useGridKeyboard>["keyboard"];
