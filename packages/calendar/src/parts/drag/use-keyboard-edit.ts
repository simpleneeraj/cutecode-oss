"use client";

import { flushSync } from "react-dom";

import { defaultDragSettings, nudgeIntent } from "../../drag";
import { moveFocus } from "../../keyboard";
import {
  AnnouncementKind,
  ChangeSource,
  DragKind,
  FocusTarget,
  KeyCommand,
  OccurrenceKind,
  VerdictKind,
  type AllDayOccurrence,
  type Announcement,
  type CreateIntent,
  type EventOccurrence,
  type MoveIntent,
  type SlotFocus,
  type SlotPoint,
} from "../../types";
import type { NewEventSlot } from "../quick-event/target";
import type { GridColumn } from "../time-grid/columns";
import { focusGridOf } from "../time-grid/focus";
import type { GridModel } from "../time-grid/model";
import { isShownDate, lanePose, lanesSelector } from "./all-day-session";
import { columnSelector, originOf, slotSelector, snappedPose } from "./grid-geometry";
import { carryIntentAt, carrySessionOf, movedSelector, type Carry } from "./keyboard-carry";
import type { DropCell } from "./source";
import { idleDrag, showResult, type DragStore } from "./store";
import { useCarry } from "./use-carry";
import type { DragSession, DropFlow } from "./use-drop-flow";
import { defaultCalendarId, ghostSelector, slotOf } from "./use-slot-create";

export type SlotHandler = (slot: NewEventSlot, anchor: HTMLElement | null) => void;

type KeyboardEditOptions = {
  model: GridModel;
  store: DragStore;
  flow: DropFlow;
  gridId: string | null;
  announce: (announcement: Announcement) => void;
};

const blockSelector = '[data-slot="event-block"]';
const gridSelector = '[role="grid"]';

const columnCommands: ReadonlySet<KeyCommand> = new Set([KeyCommand.PreviousDay, KeyCommand.NextDay]);

function carryTarget(session: DragSession): string {
  const { intent } = session.result.proposal;
  return intent.kind === DragKind.Move ? intent.target.date : session.origin.date;
}

function carryColumnKey(session: DragSession): string | undefined {
  const { intent } = session.result.proposal;
  return intent.kind === DragKind.Move ? intent.target.columnKey : session.origin.columnKey;
}

function columnCellSelector(date: string, columnKey: string | undefined): string {
  const byDate = `${columnSelector}[data-date="${date}"]`;
  return columnKey === undefined ? byDate : `${byDate}[data-column-key="${CSS.escape(columnKey)}"]`;
}

function focusMoved(root: Element | null, session: DragSession, model: GridModel) {
  const { date, prefix } = movedSelector(session, model.settings.timeZone);
  const isAllDay = session.occurrence.kind === OccurrenceKind.AllDay;
  const cell = columnCellSelector(date, carryColumnKey(session));
  const selector = isAllDay
    ? `${lanesSelector} [data-occurrence-key^="${prefix}"]`
    : `${cell} [data-occurrence-key^="${prefix}"] ${blockSelector}`;
  const moved = root?.querySelector<HTMLElement>(selector) ?? null;
  const fallback = root?.querySelector<HTMLElement>(cell) ?? null;
  (moved ?? fallback)?.focus();
}

function columnAtPoint(model: GridModel, point: Pick<SlotPoint, "date" | "columnKey">): GridColumn | undefined {
  return model.columns.find((column) => column.column.day.date === point.date && column.focusKey === point.columnKey);
}

function originColumnPoint(model: GridModel, origin: DropCell) {
  const { date, columnKey } = origin;
  return columnKey === undefined ? undefined : columnPointOf(columnAtPoint(model, { date, columnKey }), columnKey);
}

function columnPointOf(column: GridColumn | undefined, columnKey: string) {
  const resourceId = column?.resource?.id;
  return resourceId === undefined ? { columnKey } : { columnKey, resourceId };
}

function hasColumnsPerDate(model: GridModel): boolean {
  return model.columns.length > new Set(model.columns.map((column) => column.column.day.date)).size;
}

function columnNudge(model: GridModel) {
  const { timeZone } = model.settings;
  return (intent: MoveIntent, command: KeyCommand): MoveIntent => {
    const isAcross = columnCommands.has(command) && hasColumnsPerDate(model);
    if (!isAcross) {
      return nudgeIntent(intent, command, defaultDragSettings, timeZone);
    }
    const { date, minute, columnKey } = intent.target;
    const focus: SlotFocus = { target: FocusTarget.Slot, date, minute, columnKey };
    const next = moveFocus(focus, command, focusGridOf(model));
    const column = columnPointOf(columnAtPoint(model, next), next.columnKey);
    return { ...intent, target: { date: next.date, minute, ...column } };
  };
}

function timedCarry(occurrence: EventOccurrence, element: HTMLElement, gridId: string, options: KeyboardEditOptions) {
  const slot = element.closest<HTMLElement>(slotSelector);
  const origin = slot === null ? null : originOf(slot);
  if (slot === null || origin === null) {
    return null;
  }
  const { model } = options;
  const intent = carryIntentAt(occurrence, origin.date, model.settings.timeZone, originColumnPoint(model, origin));
  const session = carrySessionOf({ occurrence, element: slot, origin, gridId, flow: options.flow }, intent);
  return { intent, session, nudge: columnNudge(model), poseOf: (moved: DragSession) => snappedPose(moved, model) };
}

function firstShownDate(occurrence: AllDayOccurrence, model: GridModel): string | undefined {
  const dates = model.columns.map((column) => column.column.day.date);
  return dates.find((date) => date >= occurrence.startDate);
}

function allDayCarry(occurrence: AllDayOccurrence, element: HTMLElement, gridId: string, options: KeyboardEditOptions) {
  const lanes = element.closest(lanesSelector);
  const date = firstShownDate(occurrence, options.model);
  if (lanes === null || date === undefined) {
    return null;
  }
  const origin = { date, element: lanes };
  const intent = carryIntentAt(occurrence, date, options.model.settings.timeZone);
  const session = carrySessionOf({ occurrence, element, origin, gridId, flow: options.flow }, intent);
  return { intent, session, poseOf: (moved: DragSession) => lanePose(moved, options.model, carryTarget(moved)) };
}

function startOf(occurrence: EventOccurrence, element: HTMLElement, gridId: string, options: KeyboardEditOptions) {
  if (occurrence.kind === OccurrenceKind.AllDay) {
    return allDayCarry(occurrence, element, gridId, options);
  }
  return timedCarry(occurrence, element, gridId, options);
}

function carryOf(occurrence: EventOccurrence, element: HTMLElement, options: KeyboardEditOptions): Carry | null {
  const { gridId, model } = options;
  const start = gridId === null ? null : startOf(occurrence, element, gridId, options);
  if (start === null) {
    return null;
  }
  const grid = element.closest(gridSelector);
  start.session.onEnd = (isCommitted) => {
    if (isCommitted) {
      focusMoved(grid, start.session, model);
    }
  };
  return { ...start, glide: null, canReach: (intent) => isShownDate(model, intent.target.date) };
}

function createAt(options: KeyboardEditOptions, focusPoint: SlotPoint, grid: HTMLElement | null, onCreate: SlotHandler) {
  const calendarId = defaultCalendarId(options.model.calendars);
  if (calendarId === null) {
    return;
  }
  const column = columnAtPoint(options.model, focusPoint);
  const point = { ...focusPoint, ...columnPointOf(column, focusPoint.columnKey) };
  const intent: CreateIntent = { kind: DragKind.Create, source: ChangeSource.Keyboard, calendarId, anchor: point, target: point };
  const result = options.flow.resolve(intent);
  if (result.kind === VerdictKind.Refused) {
    const { reason, allowedHours } = result.verdict;
    options.announce({ kind: AnnouncementKind.CreateRefused, reason, allowedHours });
    return;
  }
  flushSync(() => showResult(options.store, null, point.date, result));
  const ghost = grid?.querySelector<HTMLElement>(`${columnCellSelector(point.date, column?.focusKey)} ${ghostSelector}`);
  onCreate(slotOf(result, calendarId), ghost ?? null);
  options.store.set(idleDrag);
}

export function useKeyboardEdit(options: KeyboardEditOptions) {
  const { flow, announce, model } = options;
  const carry = useCarry({ flow, announce, timeZone: model.settings.timeZone, direction: model.direction });
  return {
    pickUp: (occurrence: EventOccurrence, element: HTMLElement) => {
      const next = carryOf(occurrence, element, options);
      return next !== null && carry.start(next);
    },
    handleKey: carry.handleKey,
    onBlur: carry.onBlur,
    cancel: carry.cancel,
    createAt: (point: SlotPoint, grid: HTMLElement | null, onCreate: SlotHandler) =>
      createAt(options, point, grid, onCreate),
  };
}

export type KeyboardEdit = ReturnType<typeof useKeyboardEdit>;
