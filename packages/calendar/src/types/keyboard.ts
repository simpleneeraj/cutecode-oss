import type { PlainDate } from "./model";

export enum KeyCommand {
  Today = "today",
  PreviousDay = "previousDay",
  NextDay = "nextDay",
  PreviousHour = "previousHour",
  NextHour = "nextHour",
  PreviousWeek = "previousWeek",
  NextWeek = "nextWeek",
  ShowDay = "showDay",
  ShowWeek = "showWeek",
  ShowMonth = "showMonth",
  ShowYear = "showYear",
  ShowAgenda = "showAgenda",
  NewEvent = "newEvent",
  OpenEvent = "openEvent",
  DeleteEvent = "deleteEvent",
  DuplicateEvent = "duplicateEvent",
  PickUp = "pickUp",
  Drop = "drop",
  Cancel = "cancel",
  Search = "search",
  QuickAdd = "quickAdd",
  ShowShortcuts = "showShortcuts",
  Undo = "undo",
}

export enum FocusTarget {
  Slot = "slot",
  Event = "event",
}

export enum KeyboardMode {
  Browse = "browse",
  Carrying = "carrying",
}

export type KeyInput = {
  key: string;
  shiftKey: boolean;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
};

export type SlotFocus = {
  target: FocusTarget.Slot;
  date: PlainDate;
  minute: number;
  columnKey: string;
};

export type EventFocus = {
  target: FocusTarget.Event;
  date: PlainDate;
  minute: number;
  columnKey: string;
  occurrenceKey: string;
};

export type GridFocus = SlotFocus | EventFocus;
