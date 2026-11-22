import { flushSync } from "react-dom";

import { AnnouncementKind, KeyCommand, type Announcement } from "../../types";
import type { CalendarActions } from "../time-grid/props";

export type SharedCommandContext = {
  root: HTMLElement | null;
  onUndo: CalendarActions["onUndo"];
  openShortcuts: () => void;
  announce: (announcement: Announcement) => void;
  refocus: () => void;
};

const searchSelector = "[data-calendar-search]";

function focusSearch(root: HTMLElement | null): boolean {
  const field = root?.ownerDocument.querySelector<HTMLElement>(searchSelector) ?? null;
  field?.focus();
  return field !== null;
}

function undo(context: SharedCommandContext): boolean {
  if (context.onUndo === undefined) {
    return false;
  }
  const { onUndo, root } = context;
  const isUndone = flushSync(onUndo);
  if (!isUndone) {
    return true;
  }
  const isFocusKept = root?.contains(root.ownerDocument.activeElement) ?? false;
  if (!isFocusKept) {
    context.refocus();
  }
  context.announce({ kind: AnnouncementKind.Undone });
  return true;
}

export function runSharedCommand(command: KeyCommand, context: SharedCommandContext): boolean {
  if (command === KeyCommand.Search) {
    return focusSearch(context.root);
  }
  if (command === KeyCommand.ShowShortcuts) {
    context.openShortcuts();
    return true;
  }
  if (command === KeyCommand.Undo) {
    return undo(context);
  }
  return false;
}
