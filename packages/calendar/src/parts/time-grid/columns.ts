import { isWeekend, workingMinutes } from "../../range";
import type { ClockRange, DayColumn, Instant, PlainDate, Resource, ViewSettings, Weekday } from "../../types";
import { nowMinute } from "../now-line/position";
import { AxisSide, gapRows, missingRows, offsetAt, sideOf, type DayTrack, type VisibleAxis } from "./axis";
import { bandOf, placeBlocks, placeChips, type Band, type BlockPlacement, type ChipPlacement } from "./placement";

export const dayColumnKey = "day";

export type GridColumn = {
  column: DayColumn;
  focusKey: string;
  resource: Resource | null;
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
  resources: Resource[];
};

function isOvernight(hours: ClockRange): boolean {
  return hours.end < hours.start;
}

function bandsOutside(track: DayTrack, hours: ClockRange, timeZone: string, visible: VisibleAxis): Band[] {
  const overnight = isOvernight(hours);
  const forward = overnight ? { start: hours.end, end: hours.start } : hours;
  const working = workingMinutes(track.day, forward, timeZone);
  const bands = overnight
    ? [bandOf(track, working.startMinute, working.endMinute, visible)]
    : [bandOf(track, 0, working.startMinute, visible), bandOf(track, working.endMinute, track.day.minutes, visible)];
  return bands.filter((band) => band !== null);
}

function offHoursOf(track: DayTrack, isWeekendDay: boolean, resource: Resource | null, context: ColumnContext): Band[] {
  const { workingHours, timeZone } = context.settings;
  if (resource !== null) {
    const hours = resource.bookableHours;
    return hours === undefined ? [] : bandsOutside(track, hours, resource.timeZone ?? timeZone, context.visible);
  }
  if (workingHours === undefined || isWeekendDay) {
    return [];
  }
  return bandsOutside(track, workingHours, timeZone, context.visible);
}

function resourceOf(column: DayColumn, resources: Resource[]): Resource | null {
  const { resourceId } = column;
  return resourceId === undefined ? null : (resources.find((resource) => resource.id === resourceId) ?? null);
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
  const resource = resourceOf(column, context.resources);
  return {
    column,
    focusKey: resource?.id ?? dayColumnKey,
    resource,
    track,
    isToday: nowMinute(context.now, column.day) !== null,
    isSelected: column.day.date === context.selected,
    isWeekend: isWeekendDay,
    blocks: placeBlocks(column, track, visible),
    chips: placeChips(column, track, visible),
    offHours: offHoursOf(track, isWeekendDay, resource, context),
    missingRows: missingRows(track, visible),
    gapRows: gapRows(track, visible),
    nowOffset,
  };
}

export function anchorColumn(columns: GridColumn[]): GridColumn | undefined {
  return columns.find((column) => column.isToday) ?? columns.find((column) => column.isSelected) ?? columns[0];
}
