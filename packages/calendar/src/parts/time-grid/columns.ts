import { isWeekend, workingMinutes } from "../../range";
import type { DayColumn, Instant, PlainDate, ViewSettings, Weekday } from "../../types";
import { nowMinute } from "../now-line/position";
import { AxisSide, gapRows, missingRows, offsetAt, sideOf, type DayTrack, type VisibleAxis } from "./axis";
import { bandOf, placeBlocks, placeChips, type Band, type BlockPlacement, type ChipPlacement } from "./placement";

export type GridColumn = {
  column: DayColumn;
  track: DayTrack;
  isToday: boolean;
  isSelected: boolean;
  isWeekend: boolean;
  blocks: BlockPlacement[];
  chips: ChipPlacement[];
  offHours: Band[];
  missingRows: number[];
  gapRows: number[];
  nowOffset: number | null;
};

export type ColumnContext = {
  visible: VisibleAxis;
  settings: ViewSettings;
  weekend: Weekday[];
  selected: PlainDate;
  now: Instant | null;
};

function offHoursOf(track: DayTrack, isWeekendDay: boolean, context: ColumnContext): Band[] {
  const { workingHours, timeZone } = context.settings;
  if (workingHours === undefined || isWeekendDay) {
    return [];
  }
  const working = workingMinutes(track.day, workingHours, timeZone);
  const bands = [
    bandOf(track, 0, working.startMinute, context.visible),
    bandOf(track, working.endMinute, track.day.minutes, context.visible),
  ];
  return bands.filter((band) => band !== null);
}

function nowOffsetOf(track: DayTrack, context: ColumnContext): number | null {
  const minute = nowMinute(context.now, track.day);
  if (minute === null) {
    return null;
  }
  const isShown = sideOf(track, minute, context.visible) === AxisSide.Inside;
  return isShown ? offsetAt(track, minute, context.visible) : null;
}

export function gridColumnOf(column: DayColumn, track: DayTrack, context: ColumnContext): GridColumn {
  const { visible } = context;
  const isWeekendDay = isWeekend(column.day.date, context.weekend);
  const nowOffset = nowOffsetOf(track, context);
  return {
    column,
    track,
    isToday: nowMinute(context.now, column.day) !== null,
    isSelected: column.day.date === context.selected,
    isWeekend: isWeekendDay,
    blocks: placeBlocks(column, track, visible),
    chips: placeChips(column, track, visible),
    offHours: offHoursOf(track, isWeekendDay, context),
    missingRows: missingRows(track, visible),
    gapRows: gapRows(track, visible),
    nowOffset,
  };
}

export function anchorColumn(columns: GridColumn[]): GridColumn | undefined {
  return columns.find((column) => column.isToday) ?? columns.find((column) => column.isSelected) ?? columns[0];
}
