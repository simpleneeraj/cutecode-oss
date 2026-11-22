"use client";

import type { ElementEventBasePayload } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useId, useState } from "react";

import type { Announcement } from "../../types";
import type { MonthModel } from "../month-grid/model";
import type { MonthState } from "../month-grid/use-month-model";
import type { CalendarViewProps } from "../time-grid/props";
import type { DragBinding } from "./context";
import { isReadOnlyRefusal } from "./feedback";
import { pointerPose } from "./grid-geometry";
import { monthMoveIntent } from "./month-intent";
import { cellOf, cellPose, monthIntentOf, monthItemSelector, monthSessionOf, occurrencesOf } from "./month-session";
import { dragSourceOf, dropCellOf } from "./source";
import { createDragStore } from "./store";
import { useMonthCarry } from "./use-month-carry";
import { useDeleteAsk } from "./use-delete-ask";
import { useDragMonitor, type DragHandlers } from "./use-drag-monitor";
import { useDropFlow, type DragSession, type DropFlow } from "./use-drop-flow";
import { applyPose, restPose } from "./visual";

type MonthDragOptions = {
  month: MonthState;
  calendar: CalendarViewProps;
  announce: (announcement: Announcement) => void;
};

type MonthContext = {
  model: MonthModel;
  timeZone: string;
  flow: DropFlow;
  gridId: string;
};

function sessionOf(payload: ElementEventBasePayload, context: MonthContext): DragSession | null {
  const { flow, gridId, timeZone } = context;
  const source = dragSourceOf(payload.source.data, gridId);
  const occurrence = source === null ? undefined : occurrencesOf(context.model).get(source.key);
  const element = payload.source.element.closest<HTMLElement>(monthItemSelector);
  const origin =
    dropCellOf(payload.location.initial.dropTargets, gridId) ?? (element === null ? null : cellOf(element));
  if (occurrence === undefined || element === null || origin === null) {
    return null;
  }
  const item = { occurrence, element, origin };
  const session = monthSessionOf(item, monthIntentOf(item, origin.date, timeZone), flow, gridId);
  const { input } = payload.location.initial;
  session.pointer = { x: input.clientX, y: input.clientY };
  return session;
}

function followPointer(session: DragSession, payload: ElementEventBasePayload, context: MonthContext) {
  const { flow, gridId, timeZone } = context;
  session.target = dropCellOf(payload.location.current.dropTargets, gridId) ?? session.target;
  session.result = flow.resolve(
    monthMoveIntent(session.occurrence, session.origin.date, session.target.date, timeZone),
  );
  if (!isReadOnlyRefusal(session.result)) {
    session.pose = flow.isReducedMotion ? cellPose(session) : pointerPose(session, payload.location.current.input);
    applyPose(session.element, session.pose);
  }
  flow.show(session);
}

function monthHandlers(context: MonthContext, cancelCarry: () => void): DragHandlers {
  const { flow } = context;
  return {
    start: (payload) => {
      cancelCarry();
      const session = sessionOf(payload, context);
      if (session !== null) {
        flow.begin(session);
      }
    },
    move: (payload) => {
      const session = flow.sessionRef.current;
      if (session !== null) {
        followPointer(session, payload, context);
      }
    },
    drop: (payload) => {
      const session = flow.sessionRef.current;
      const isDropped = payload.location.current.dropTargets.length > 0;
      flow.finish(isDropped, session === null ? restPose : cellPose(session));
    },
  };
}

export function useMonthInteraction({ month, calendar, announce }: MonthDragOptions) {
  const gridId = useId();
  const [store] = useState(createDragStore);
  const { settings, calendars } = month;
  const { options, actions } = calendar;
  const flow = useDropFlow({ store, settings, calendars, allowedHours: options.allowedHours, actions, announce });
  const isEditable = actions.onEventChange !== undefined;
  const context: MonthContext = { model: month.model, timeZone: settings.timeZone, flow, gridId };
  const deleteAsk = useDeleteAsk(actions.onEventDelete, announce);
  const carryOptions = { model: month.model, timeZone: settings.timeZone, direction: month.direction, flow, announce };
  const carry = useMonthCarry(carryOptions, isEditable ? gridId : null);

  useDragMonitor(gridId, isEditable, monthHandlers(context, carry.cancel));

  const binding: DragBinding = {
    gridId: isEditable ? gridId : null,
    store,
    draft: null,
    handlersFor: null,
    scope: { choose: flow.choose, cancel: flow.cancelAsk },
    deleteAsk,
    moveHintId: null,
  };
  return { binding, carry };
}
