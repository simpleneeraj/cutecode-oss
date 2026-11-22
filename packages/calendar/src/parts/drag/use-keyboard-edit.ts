"use client";

import { flushSync } from "react-dom";

import {
  AnnouncementKind,
  ChangeSource,
  DragKind,
  OccurrenceKind,
  VerdictKind,
  type AllDayOccurrence,
  type Announcement,
  type CreateIntent,
  type EventOccurrence,
  type SlotPoint,
} from "../../types";
import type { NewEventSlot } from "../quick-event/target";
import type { GridModel } from "../time-grid/model";
import { isShownDate, lanePose, lanesSelector } from "./all-day-session";
import { columnSelector, originOf, slotSelector, snappedPose } from "./grid-geometry";
import { carryIntentAt, carrySessionOf, movedSelector, type Carry } from "./keyboard-carry";
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

function carryTarget(session: DragSession): string {
  const { intent } = session.result.proposal;
  return intent.kind === DragKind.Move ? intent.target.date : session.origin.date;
}

function focusMoved(root: Element | null, session: DragSession, model: GridModel) {
  const { date, prefix } = movedSelector(session, model.settings.timeZone);
  const isAllDay = session.occurrence.kind === OccurrenceKind.AllDay;
  const selector = isAllDay
    ? `${lanesSelector} [data-occurrence-key^="${prefix}"]`
    : `${columnSelector}[data-date="${date}"] [data-occurrence-key^="${prefix}"] ${blockSelector}`;
  const moved = root?.querySelector<HTMLElement>(selector) ?? null;
  const fallback = root?.querySelector<HTMLElement>(`${columnSelector}[data-date="${date}"]`) ?? null;
  (moved ?? fallback)?.focus();
}

function timedCarry(occurrence: EventOccurrence, element: HTMLElement, gridId: string, options: KeyboardEditOptions) {
  const slot = element.closest<HTMLElement>(slotSelector);
  const origin = slot === null ? null : originOf(slot);
  if (slot === null || origin === null) {
    return null;
  }
  const intent = carryIntentAt(occurrence, origin.date, options.model.settings.timeZone);
  const session = carrySessionOf({ occurrence, element: slot, origin, gridId, flow: options.flow }, intent);
  return { intent, session, poseOf: (moved: DragSession) => snappedPose(moved, options.model) };
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

function createAt(options: KeyboardEditOptions, point: SlotPoint, grid: HTMLElement | null, onCreate: SlotHandler) {
  const calendarId = defaultCalendarId(options.model.calendars);
  if (calendarId === null) {
    return;
  }
  const intent: CreateIntent = { kind: DragKind.Create, source: ChangeSource.Keyboard, calendarId, anchor: point, target: point };
  const result = options.flow.resolve(intent);
  if (result.kind === VerdictKind.Refused) {
    const { reason, allowedHours } = result.verdict;
    options.announce({ kind: AnnouncementKind.CreateRefused, reason, allowedHours });
    return;
  }
  flushSync(() => showResult(options.store, null, point.date, result));
  const ghost = grid?.querySelector<HTMLElement>(`${columnSelector}[data-date="${point.date}"] ${ghostSelector}`);
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
