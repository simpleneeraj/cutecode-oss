"use client";

import { useRef, type PointerEvent, type RefObject } from "react";

import { ChangeSource, DragKind, VerdictKind, type Calendar, type CreateIntent, type DragResult, type SlotPoint } from "../../types";
import type { NewEventSlot } from "../quick-event/target";
import type { GridColumn } from "../time-grid/columns";
import type { GridModel } from "../time-grid/model";
import type { CalendarActions } from "../time-grid/props";
import type { ColumnPointerHandlers } from "./context";
import { gridPointAt } from "./grid-geometry";
import { idleDrag, showResult, type DragStore } from "./store";
import type { DropFlow } from "./use-drop-flow";

type SlotCreateOptions = {
  model: GridModel;
  store: DragStore;
  flow: DropFlow;
  onSlotCreate: CalendarActions["onSlotCreate"];
};

type ScreenPoint = { x: number; y: number };

type CreateSession = {
  intent: CreateIntent;
  element: HTMLElement;
  pointerId: number;
  start: ScreenPoint;
  isTouch: boolean;
  result: DragResult;
  stopEscape: () => void;
};

const createLimits = {
  clickDistance: 4,
};

export const ghostSelector = '[data-slot="draft-ghost"]';

export function defaultCalendarId(calendars: Calendar[]): string | null {
  const writable = calendars.find((calendar) => calendar.visible && !calendar.readOnly);
  return writable?.id ?? null;
}

function listenForEscape(onEscape: () => void): () => void {
  const handleKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onEscape();
    }
  };
  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}

export function isTap(start: ScreenPoint, end: ScreenPoint): boolean {
  return Math.hypot(end.x - start.x, end.y - start.y) <= createLimits.clickDistance;
}

function hasMoved(session: CreateSession, event: PointerEvent<HTMLElement>): boolean {
  return !isTap(session.start, { x: event.clientX, y: event.clientY });
}

export function slotOf(result: DragResult, calendarId: string): NewEventSlot {
  const { start, end, resourceId } = result.proposal;
  return { start, end, allDay: false, calendarId, resourceId };
}

type CreateContext = SlotCreateOptions & {
  sessionRef: RefObject<CreateSession | null>;
  onSlotCreate: NonNullable<CalendarActions["onSlotCreate"]>;
};

function stopCreate(context: CreateContext) {
  const session = context.sessionRef.current;
  if (session === null) {
    return;
  }
  session.stopEscape();
  context.sessionRef.current = null;
  context.store.set(idleDrag);
}

function pointAt(context: CreateContext, event: PointerEvent<HTMLElement>, column: GridColumn): SlotPoint | null {
  const cell = { date: column.column.day.date, columnKey: column.focusKey, element: event.currentTarget };
  return gridPointAt(event.clientY, cell, context.model);
}

function beginCreate(context: CreateContext, event: PointerEvent<HTMLElement>, column: GridColumn) {
  const calendarId = defaultCalendarId(context.model.calendars);
  const anchor = pointAt(context, event, column);
  const isOnEmptySlot = event.target === event.currentTarget && event.button === 0;
  if (!isOnEmptySlot || calendarId === null || anchor === null || context.flow.sessionRef.current !== null) {
    return;
  }
  const intent: CreateIntent = { kind: DragKind.Create, source: ChangeSource.Drag, calendarId, anchor, target: anchor };
  const isTouch = event.pointerType === "touch";
  const session: CreateSession = {
    intent,
    element: event.currentTarget,
    pointerId: event.pointerId,
    start: { x: event.clientX, y: event.clientY },
    isTouch,
    result: context.flow.resolve(intent),
    stopEscape: listenForEscape(() => stopCreate(context)),
  };
  context.sessionRef.current = session;
  if (!isTouch) {
    event.currentTarget.setPointerCapture(event.pointerId);
    showResult(context.store, null, anchor.date, session.result);
  }
}

function moveCreate(context: CreateContext, event: PointerEvent<HTMLElement>, column: GridColumn) {
  const session = context.sessionRef.current;
  const target = pointAt(context, event, column);
  const isTracking = session !== null && !session.isTouch && session.pointerId === event.pointerId;
  if (!isTracking || target === null || !hasMoved(session, event)) {
    return;
  }
  session.intent = { ...session.intent, target };
  session.result = context.flow.resolve(session.intent);
  showResult(context.store, null, session.intent.anchor.date, session.result);
}

function finishCreate(context: CreateContext, event: PointerEvent<HTMLElement>) {
  const session = context.sessionRef.current;
  if (session === null || session.pointerId !== event.pointerId) {
    return;
  }
  const ghost = session.element.querySelector<HTMLElement>(ghostSelector);
  const isSwipe = session.isTouch && hasMoved(session, event);
  if (session.result.kind === VerdictKind.Accepted && !isSwipe) {
    context.onSlotCreate(slotOf(session.result, session.intent.calendarId), ghost);
  }
  stopCreate(context);
}

export function useSlotCreate(options: SlotCreateOptions) {
  const sessionRef = useRef<CreateSession | null>(null);
  const { onSlotCreate } = options;
  if (onSlotCreate === undefined) {
    return null;
  }
  const context: CreateContext = { ...options, sessionRef, onSlotCreate };
  return (column: GridColumn): ColumnPointerHandlers => ({
    onPointerDown: (event) => beginCreate(context, event, column),
    onPointerMove: (event) => moveCreate(context, event, column),
    onPointerUp: (event) => finishCreate(context, event),
    onPointerCancel: () => stopCreate(context),
  });
}
