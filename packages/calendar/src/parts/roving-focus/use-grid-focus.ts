"use client";

import { type KeyboardEvent, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { commandFor, type FocusGrid, moveFocus } from "../../keyboard";
import { KeyboardMode, type GridFocus, type KeyCommand, type TextDirection } from "../../types";
import { focusKeyOf, focusPropsOf, navigationCommands } from "./focus-key";

export type FocusMove = (focus: GridFocus, command: KeyCommand, grid: FocusGrid) => GridFocus;

export type GridFocusOptions = {
  grid: FocusGrid;
  initialFocus: GridFocus;
  direction: TextDirection;
  onFocusChange?: (focus: GridFocus) => void;
  onCommand?: (command: KeyCommand, focus: GridFocus) => boolean;
  move?: FocusMove;
};

export function focusElement(container: HTMLElement | null, key: string) {
  const selector = `[data-focus-key="${CSS.escape(key)}"]`;
  container?.querySelector<HTMLElement>(selector)?.focus();
}

export function useGridFocus({
  grid,
  initialFocus,
  direction,
  onFocusChange,
  onCommand,
  move = moveFocus,
}: GridFocusOptions) {
  const [focus, setFocus] = useState(initialFocus);
  const gridRef = useRef<HTMLDivElement>(null);

  const moveTo = (next: GridFocus) => {
    flushSync(() => setFocus(next));
    focusElement(gridRef.current, focusKeyOf(next));
    onFocusChange?.(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const command = commandFor(event, KeyboardMode.Browse, direction);
    if (command === null) {
      return;
    }
    const isNavigation = navigationCommands.has(command);
    if (isNavigation) {
      event.preventDefault();
      moveTo(move(focus, command, grid));
      return;
    }
    const isHandled = onCommand?.(command, focus) ?? false;
    if (isHandled) {
      event.preventDefault();
    }
  };

  const focusPropsFor = (key: string) => focusPropsOf(key, focus);

  return { focus, gridRef, onKeyDown, focusPropsFor, select: setFocus, moveTo };
}
