import type { FocusGrid } from "../../keyboard";
import { dateOf, milliseconds, minutes, parseClockTime, toInstant } from "../../time";
import {
  FocusTarget,
  KeyCommand,
  type EventFocus,
  type GridFocus,
  type Instant,
  type OverflowChip,
  type SlotFocus,
  type SpanBar,
  type TimedBox,
} from "../../types";
import { focusKeyOf, slotKey } from "../roving-focus/focus-key";
import { AxisSide, sideOf } from "./axis";
import { anchorColumn, dayColumnKey, type GridColumn } from "./columns";
import type { GridModel } from "./model";

export { dayColumnKey } from "./columns";

const fallbackClock = "09:00";

const chipKeyPrefix = "chip-";

export function focusGridOf(model: GridModel): FocusGrid {
  return {
    dates: [...new Set(model.columns.map((column) => column.column.day.date))],
    columnKeys: [...new Set(model.columns.map((column) => column.focusKey))],
    stepMinutes: minutes.hour,
    days: model.columns.map((column) => column.column.day),
    timeZone: model.settings.timeZone,
  };
}

function startingMinute(column: GridColumn, model: GridModel, now: Instant | null): number {
  const { day } = column.column;
  if (column.isToday && now !== null) {
    const elapsed = (now - day.start) / milliseconds.minute;
    return Math.floor(elapsed / minutes.hour) * minutes.hour;
  }
  const { settings } = model;
  const shownStart = model.visible.window.fromMinute;
  const isFolded = shownStart > 0;
  const clock = isFolded ? shownStart : parseClockTime(settings.workingHours?.start ?? fallbackClock);
  return (toInstant({ date: day.date, minute: clock }, settings.timeZone) - day.start) / milliseconds.minute;
}

export function startingFocus(model: GridModel, now: Instant | null): SlotFocus {
  const column = anchorColumn(model.columns);
  const date = column?.column.day.date ?? model.range.anchor;
  const minute = column === undefined ? 0 : startingMinute(column, model, now);
  return { target: FocusTarget.Slot, date, minute, columnKey: column?.focusKey ?? dayColumnKey };
}

export function columnOfFocus(focus: GridFocus, model: GridModel): GridColumn | undefined {
  const onDate = model.columns.filter((column) => column.column.day.date === focus.date);
  return onDate.find((column) => column.focusKey === focus.columnKey) ?? onDate[0];
}

export function shownBars(model: GridModel): SpanBar[] {
  return model.bars.filter((bar) => bar.week === 0);
}

export function eventFocusOf(box: TimedBox, columnKey: string = dayColumnKey): EventFocus {
  return {
    target: FocusTarget.Event,
    date: box.date,
    minute: box.startMinute,
    columnKey,
    occurrenceKey: box.key,
  };
}

function chipFocusOf(chip: OverflowChip, columnKey: string): EventFocus {
  return {
    target: FocusTarget.Event,
    date: chip.date,
    minute: chip.startMinute,
    columnKey,
    occurrenceKey: chipKeyPrefix + chipIdOf(chip, columnKey),
  };
}

function chipIdOf(chip: OverflowChip, columnKey: string): string {
  return columnKey === dayColumnKey ? String(chip.startMinute) : `${columnKey}-${chip.startMinute}`;
}

function barFocusOf(bar: SpanBar, model: GridModel): EventFocus | null {
  const column = model.columns[bar.startIndex];
  if (column === undefined) {
    return null;
  }
  const { date } = column.column.day;
  return { target: FocusTarget.Event, date, minute: 0, columnKey: column.focusKey, occurrenceKey: bar.key };
}

export function chipKeyOf(chip: OverflowChip, columnKey: string = dayColumnKey): string {
  return focusKeyOf(chipFocusOf(chip, columnKey));
}

export function barKeyOf(bar: SpanBar, model: GridModel): string {
  const focus = barFocusOf(bar, model);
  return focus === null ? bar.key : focusKeyOf(focus);
}

function columnTargets(column: GridColumn): EventFocus[] {
  const blocks = column.blocks.map((placement) => eventFocusOf(placement.box, column.focusKey));
  const chips = column.chips.map((placement) => chipFocusOf(placement.chip, column.focusKey));
  return [...blocks, ...chips];
}

function targetForKey(key: string, model: GridModel): EventFocus | undefined {
  const bars = shownBars(model)
    .map((bar) => barFocusOf(bar, model))
    .filter((focus) => focus !== null);
  const targets = [...model.columns.flatMap(columnTargets), ...bars];
  return targets.find((target) => focusKeyOf(target) === key);
}

function slotFocusAt(focus: GridFocus): SlotFocus {
  return { target: FocusTarget.Slot, date: focus.date, minute: focus.minute, columnKey: focus.columnKey };
}

export function shownFocus(focus: GridFocus, model: GridModel, now: Instant | null): GridFocus {
  if (columnOfFocus(focus, model) === undefined) {
    return startingFocus(model, now);
  }
  const isEvent = focus.target === FocusTarget.Event;
  const isMissing = isEvent && targetForKey(focusKeyOf(focus), model) === undefined;
  return isMissing ? slotFocusAt(focus) : focus;
}

function overlapsSlot(startMinute: number, endMinute: number, minute: number): boolean {
  const end = Math.max(endMinute, startMinute + 1);
  return startMinute < minute + minutes.hour && end > minute;
}

export function boxesAtSlot(column: GridColumn, minute: number): TimedBox[] {
  return column.column.boxes.filter((box) => overlapsSlot(box.startMinute, box.endMinute, minute));
}

export function eventCountAtSlot(column: GridColumn, minute: number): number {
  const hidden = column.column.overflow
    .filter((chip) => overlapsSlot(chip.startMinute, chip.endMinute, minute))
    .reduce((total, chip) => total + chip.keys.length, 0);
  return boxesAtSlot(column, minute).length + hidden;
}

export function focusInstant(focus: GridFocus, column: GridColumn): Instant {
  return column.column.day.start + focus.minute * milliseconds.minute;
}

export function foldSideOf(focus: GridFocus, model: GridModel): AxisSide {
  const column = columnOfFocus(focus, model);
  if (column === undefined) {
    return AxisSide.Inside;
  }
  return sideOf(column.track, focus.minute, model.visible);
}

function slotFocusForKey(key: string, model: GridModel, current: GridFocus): SlotFocus | null {
  const column = model.columns.find((candidate) => slotKey(candidate.column.day.date, candidate.focusKey) === key);
  if (column === undefined) {
    return null;
  }
  const { day } = column.column;
  const lastMinute = Math.max(0, day.minutes - minutes.hour);
  const minute = Math.min(current.minute, lastMinute);
  return { target: FocusTarget.Slot, date: day.date, minute, columnKey: column.focusKey };
}

export function focusForKey(key: string, model: GridModel, current: GridFocus): GridFocus | null {
  return targetForKey(key, model) ?? slotFocusForKey(key, model, current);
}

export function todaySlot(focus: GridFocus, timeZone: string): SlotFocus {
  return {
    target: FocusTarget.Slot,
    date: dateOf(Date.now(), timeZone),
    minute: focus.minute,
    columnKey: dayColumnKey,
  };
}

function barOnColumn(column: GridColumn, model: GridModel): EventFocus | null {
  const index = model.columns.indexOf(column);
  const bar = shownBars(model).find((candidate) => {
    const end = candidate.startIndex + candidate.length;
    return candidate.startIndex <= index && index < end;
  });
  return bar === undefined ? null : barFocusOf(bar, model);
}

function slotEventFocus(focus: GridFocus, model: GridModel): EventFocus | null {
  const column = columnOfFocus(focus, model);
  if (column === undefined) {
    return null;
  }
  const block = column.blocks.find(({ box }) => overlapsSlot(box.startMinute, box.endMinute, focus.minute));
  if (block !== undefined) {
    return eventFocusOf(block.box, column.focusKey);
  }
  const chip = column.chips.find((placement) => overlapsSlot(placement.chip.startMinute, placement.chip.endMinute, focus.minute));
  return chip === undefined ? barOnColumn(column, model) : chipFocusOf(chip.chip, column.focusKey);
}

export function commandFocus(command: KeyCommand, focus: GridFocus, model: GridModel): GridFocus | null {
  if (command === KeyCommand.Today) {
    return todaySlot(focus, model.settings.timeZone);
  }
  const isSlotOpen = command === KeyCommand.OpenEvent && focus.target === FocusTarget.Slot;
  return isSlotOpen ? slotEventFocus(focus, model) : null;
}
