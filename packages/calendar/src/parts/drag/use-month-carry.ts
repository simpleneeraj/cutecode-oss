"use client";

import { ChangeSource, DragKind, type Announcement, type MoveIntent, type TextDirection } from "../../types";
import { dayKey } from "../month-grid/focus";
import type { MonthModel } from "../month-grid/model";
import { movedSelector, type Carry } from "./keyboard-carry";
import { cellOn, cellPose, monthIntentOf, monthSessionOf, type MonthItem } from "./month-session";
import { useCarry } from "./use-carry";
import type { DragSession, DropFlow } from "./use-drop-flow";

type MonthCarryOptions = {
  model: MonthModel;
  timeZone: string;
  direction: TextDirection;
  flow: DropFlow;
  announce: (announcement: Announcement) => void;
};

const gridSelector = '[role="grid"]';

function targetPose(session: DragSession, root: Element | null) {
  const { intent } = session.result.proposal;
  const date = intent.kind === DragKind.Move ? intent.target.date : session.origin.date;
  session.target = cellOn(root, date) ?? session.target;
  return cellPose(session);
}

function focusMoved(root: Element | null, session: DragSession, timeZone: string) {
  const { date, prefix } = movedSelector(session, timeZone);
  const cell = root?.querySelector<HTMLElement>(`[data-focus-key="${CSS.escape(dayKey(date))}"]`) ?? null;
  const item = cell?.querySelector<HTMLElement>(`[data-occurrence-key^="${prefix}"] button`) ?? null;
  (item ?? cell)?.focus();
}

function monthCarryOf(item: MonthItem, gridId: string, options: MonthCarryOptions): Carry {
  const { model, timeZone, flow } = options;
  const root = item.element.closest(gridSelector);
  const intent: MoveIntent = { ...monthIntentOf(item, item.origin.date, timeZone), source: ChangeSource.Keyboard };
  const session = monthSessionOf(item, intent, flow, gridId);
  session.onEnd = (isCommitted) => {
    if (isCommitted) {
      focusMoved(root, session, timeZone);
    }
  };
  return {
    intent,
    session,
    glide: null,
    canReach: (next) => model.dates.includes(next.target.date),
    poseOf: (moved) => targetPose(moved, root),
  };
}

export function useMonthCarry(options: MonthCarryOptions, gridId: string | null) {
  const { flow, announce, timeZone, direction } = options;
  const carry = useCarry({ flow, announce, timeZone, direction });
  return {
    pickUp: (item: MonthItem) => gridId !== null && carry.start(monthCarryOf(item, gridId, options)),
    handleKey: carry.handleKey,
    onBlur: carry.onBlur,
    cancel: carry.cancel,
  };
}

export type MonthCarry = ReturnType<typeof useMonthCarry>;
