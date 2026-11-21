import { addDays, daySpan, milliseconds, toInstant, toWallClock } from "../time";
import { FocusTarget, KeyCommand, type DaySpan, type GridFocus, type PlainDate, type SlotFocus } from "../types";

export type FocusGrid = {
  dates: PlainDate[];
  columnKeys: string[];
  stepMinutes: number;
  days: DaySpan[];
  timeZone: string;
};

type ColumnPosition = { date: PlainDate; columnKey: string };

const eventCommands = new Set([
  KeyCommand.OpenEvent,
  KeyCommand.DeleteEvent,
  KeyCommand.DuplicateEvent,
  KeyCommand.PickUp,
]);

const writeCommands = new Set([KeyCommand.DeleteEvent, KeyCommand.DuplicateEvent, KeyCommand.PickUp]);

const weekLength = 7;

function daySpanOf(date: PlainDate, grid: FocusGrid): DaySpan {
  return grid.days.find((day) => day.date === date) ?? daySpan(date, grid.timeZone);
}

function clampMinute(minute: number, date: PlainDate, grid: FocusGrid): number {
  const lastMinute = Math.max(0, daySpanOf(date, grid).minutes - grid.stepMinutes);
  return Math.min(Math.max(minute, 0), lastMinute);
}

function sameClockMinute(focus: GridFocus, date: PlainDate, grid: FocusGrid): number {
  const isSameDay = date === focus.date;
  if (isSameDay) {
    return focus.minute;
  }
  const focusedInstant = daySpanOf(focus.date, grid).start + focus.minute * milliseconds.minute;
  const clock = toWallClock(focusedInstant, grid.timeZone);
  const targetInstant = toInstant({ date, minute: clock.minute }, grid.timeZone);
  return (targetInstant - daySpanOf(date, grid).start) / milliseconds.minute;
}

function slotKeepingClock(focus: GridFocus, position: ColumnPosition, grid: FocusGrid): SlotFocus {
  return slotAt(position, sameClockMinute(focus, position.date, grid), grid);
}

function slotAt(position: ColumnPosition, minute: number, grid: FocusGrid): SlotFocus {
  const { date, columnKey } = position;
  return { target: FocusTarget.Slot, date, columnKey, minute: clampMinute(minute, date, grid) };
}

function stepColumn(focus: GridFocus, offset: number, grid: FocusGrid): ColumnPosition {
  const index = grid.columnKeys.indexOf(focus.columnKey);
  const isKnownColumn = index !== -1;
  if (!isKnownColumn) {
    return { date: addDays(focus.date, offset), columnKey: focus.columnKey };
  }
  const columnCount = grid.columnKeys.length;
  const target = index + offset;
  const dayOffset = Math.floor(target / columnCount);
  const columnIndex = target - dayOffset * columnCount;
  return { date: addDays(focus.date, dayOffset), columnKey: grid.columnKeys[columnIndex] ?? focus.columnKey };
}

function stepDays(focus: GridFocus, days: number): ColumnPosition {
  return { date: addDays(focus.date, days), columnKey: focus.columnKey };
}

export function moveFocus(focus: GridFocus, command: KeyCommand, grid: FocusGrid): GridFocus {
  switch (command) {
    case KeyCommand.PreviousDay:
      return slotKeepingClock(focus, stepColumn(focus, -1, grid), grid);
    case KeyCommand.NextDay:
      return slotKeepingClock(focus, stepColumn(focus, 1, grid), grid);
    case KeyCommand.PreviousWeek:
      return slotKeepingClock(focus, stepDays(focus, -weekLength), grid);
    case KeyCommand.NextWeek:
      return slotKeepingClock(focus, stepDays(focus, weekLength), grid);
    case KeyCommand.PreviousHour:
      return slotAt(stepDays(focus, 0), focus.minute - grid.stepMinutes, grid);
    case KeyCommand.NextHour:
      return slotAt(stepDays(focus, 0), focus.minute + grid.stepMinutes, grid);
    default:
      return focus;
  }
}

export function isCommandAllowed(command: KeyCommand, focus: GridFocus, readOnly: boolean): boolean {
  const isOnEvent = focus.target === FocusTarget.Event;
  if (eventCommands.has(command) && !isOnEvent) {
    return false;
  }
  return !(readOnly && writeCommands.has(command));
}
