import type { DayColumn, OverflowChip, TimedBox } from "../../types";
import { AxisSide, offsetAt, sideOf, type DayTrack, type VisibleAxis } from "./axis";

export type BlockPlacement = {
  box: TimedBox;
  top: number;
  height: number;
  column: number;
  columnCount: number;
  isReserved: boolean;
};

export type ChipPlacement = {
  chip: OverflowChip;
  top: number;
};

export type Band = {
  top: number;
  height: number;
};

function overlapsChip(box: TimedBox, chips: OverflowChip[]): boolean {
  return chips.some((chip) => box.startMinute < chip.endMinute && box.endMinute > chip.startMinute);
}

function lastMinuteOf(box: TimedBox): number {
  return box.marker ? box.startMinute : Math.max(box.startMinute, box.endMinute - 1);
}

function isFolded(box: TimedBox, track: DayTrack, visible: VisibleAxis): boolean {
  const startSide = sideOf(track, box.startMinute, visible);
  const isSameSide = startSide === sideOf(track, lastMinuteOf(box), visible);
  return isSameSide && startSide !== AxisSide.Inside;
}

function placementOf(box: TimedBox, track: DayTrack, visible: VisibleAxis, isReserved: boolean): BlockPlacement {
  const top = offsetAt(track, box.startMinute, visible);
  const bottom = offsetAt(track, box.endMinute, visible);
  return { box, top, height: Math.max(0, bottom - top), column: box.column, columnCount: box.columnCount, isReserved };
}

export function placeBlocks(column: DayColumn, track: DayTrack, visible: VisibleAxis): BlockPlacement[] {
  return column.boxes
    .filter((box) => !isFolded(box, track, visible))
    .map((box) => placementOf(box, track, visible, overlapsChip(box, column.overflow)));
}

export function placeChips(column: DayColumn, track: DayTrack, visible: VisibleAxis): ChipPlacement[] {
  return column.overflow
    .filter((chip) => sideOf(track, chip.startMinute, visible) === AxisSide.Inside)
    .map((chip) => ({ chip, top: offsetAt(track, chip.startMinute, visible) }));
}

export function bandOf(track: DayTrack, fromMinute: number, toMinute: number, visible: VisibleAxis): Band | null {
  const top = offsetAt(track, fromMinute, visible);
  const height = offsetAt(track, toMinute, visible) - top;
  return height > 0 ? { top, height } : null;
}

export function canResize(box: TimedBox): boolean {
  return !box.marker && !box.continuesAfter;
}
