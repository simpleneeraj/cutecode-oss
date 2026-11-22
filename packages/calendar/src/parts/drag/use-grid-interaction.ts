"use client";

import type { ElementEventBasePayload } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useId, useState } from "react";

import { DragKind, type Announcement, type DropConstraint } from "../../types";
import type { GridModel } from "../time-grid/model";
import type { CalendarActions, TimeGridOptions } from "../time-grid/props";
import { allDayItemSelector, allDaySessionOf, laneDateAt, laneIntent, lanePose, lanesSelector } from "./all-day-session";
import type { DragBinding } from "./context";
import { isReadOnlyRefusal } from "./feedback";
import { gridIntent, gridPointAt, originOf, pointerPose, slotSelector, snappedPose } from "./grid-geometry";
import { dragSourceOf, dropCellOf } from "./source";
import { createDragStore } from "./store";
import { useDeleteAsk } from "./use-delete-ask";
import { useDragMonitor, type DragHandlers } from "./use-drag-monitor";
import { ignoreEnd, useDropFlow, type DragSession, type DropFlow } from "./use-drop-flow";
import { useKeyboardEdit } from "./use-keyboard-edit";
import { useSlotCreate } from "./use-slot-create";
import { applyPose, restPose, type Pose } from "./visual";

type GridDragOptions = {
  model: GridModel;
  options: TimeGridOptions;
  actions: CalendarActions;
  announce: (announcement: Announcement) => void;
  constraints?: DropConstraint[];
};

function sessionOf(
  payload: ElementEventBasePayload,
  model: GridModel,
  flow: DropFlow,
  gridId: string,
): DragSession | null {
  const source = dragSourceOf(payload.source.data, gridId);
  const occurrence = source === null ? undefined : model.occurrenceByKey.get(source.key);
  const element = payload.source.element.closest<HTMLElement>(slotSelector);
  const origin = element === null ? null : originOf(element);
  const { input } = payload.location.initial;
  const grab = origin === null ? null : gridPointAt(input.clientY, origin, model);
  if (source === null || occurrence === undefined || element === null || origin === null || grab === null) {
    return null;
  }
  const base = { source, occurrence, origin, grab, target: origin };
  const intent = gridIntent(base, input, model);
  if (intent === null) {
    return null;
  }
  return {
    ...base,
    element,
    originRect: origin.element.getBoundingClientRect(),
    pointer: { x: input.clientX, y: input.clientY },
    home: { top: element.offsetTop, height: element.offsetHeight },
    pose: restPose,
    blockSize: element.style.blockSize,
    result: flow.resolve(intent),
    unclip: ignoreEnd,
    onEnd: ignoreEnd,
  };
}

function followPointer(session: DragSession, payload: ElementEventBasePayload, model: GridModel, flow: DropFlow) {
  const { input } = payload.location.current;
  session.target = dropCellOf(payload.location.current.dropTargets, session.source.gridId) ?? session.target;
  const intent = gridIntent(session, input, model);
  if (intent === null) {
    return;
  }
  session.result = flow.resolve(intent);
  if (!isReadOnlyRefusal(session.result)) {
    const isSnapped = flow.isReducedMotion && intent.kind !== DragKind.Resize;
    session.pose = isSnapped ? snappedPose(session, model) : pointerPose(session, input);
    applyPose(session.element, session.pose);
  }
  flow.show(session);
}

function startSession(payload: ElementEventBasePayload, model: GridModel, flow: DropFlow, gridId: string) {
  const source = dragSourceOf(payload.source.data, gridId);
  const item = payload.source.element.closest<HTMLElement>(allDayItemSelector);
  if (source === null || item === null) {
    return sessionOf(payload, model, flow, gridId);
  }
  const { clientX, clientY } = payload.location.initial.input;
  return allDaySessionOf({ source, element: item, clientX, clientY }, model, flow);
}

function isAllDaySession(session: DragSession): boolean {
  return session.origin.element.matches(lanesSelector);
}

function followLane(session: DragSession, payload: ElementEventBasePayload, model: GridModel, flow: DropFlow) {
  const { input } = payload.location.current;
  const date = laneDateAt(session.origin.element, input.clientX, model) ?? session.target.date;
  session.target = { date, element: session.origin.element };
  session.result = flow.resolve(laneIntent(session, date));
  if (!isReadOnlyRefusal(session.result)) {
    session.pose = flow.isReducedMotion ? lanePose(session, model, date) : pointerPose(session, input);
    applyPose(session.element, session.pose);
  }
  flow.show(session);
}

function settlePose(session: DragSession | null, model: GridModel): Pose {
  if (session === null) {
    return restPose;
  }
  return isAllDaySession(session) ? lanePose(session, model, session.target.date) : snappedPose(session, model);
}

function pointerHandlers(model: GridModel, flow: DropFlow, gridId: string, cancelCarry: () => void): DragHandlers {
  return {
    start: (payload) => {
      cancelCarry();
      const session = startSession(payload, model, flow, gridId);
      if (session !== null) {
        flow.begin(session);
      }
    },
    move: (payload) => {
      const session = flow.sessionRef.current;
      if (session === null) {
        return;
      }
      const follow = isAllDaySession(session) ? followLane : followPointer;
      follow(session, payload, model, flow);
    },
    drop: (payload) => {
      const isDropped = payload.location.current.dropTargets.length > 0;
      flow.finish(isDropped, settlePose(flow.sessionRef.current, model));
    },
  };
}

export function useGridInteraction({ model, options, actions, announce, constraints }: GridDragOptions) {
  const gridId = useId();
  const [store] = useState(createDragStore);
  const flow = useDropFlow({
    store,
    settings: model.settings,
    calendars: model.calendars,
    allowedHours: options.allowedHours,
    resources: model.resources,
    constraints,
    actions,
    announce,
  });
  const create = useSlotCreate({ model, store, flow, onSlotCreate: actions.onSlotCreate });
  const isEditable = actions.onEventChange !== undefined;
  const deleteAsk = useDeleteAsk(actions.onEventDelete, announce);
  const keyboardEdit = useKeyboardEdit({ model, store, flow, gridId: isEditable ? gridId : null, announce });

  useDragMonitor(gridId, isEditable, pointerHandlers(model, flow, gridId, keyboardEdit.cancel));

  const binding: DragBinding = {
    gridId: isEditable ? gridId : null,
    store,
    draft: options.draft ?? null,
    handlersFor: create,
    scope: { choose: flow.choose, cancel: flow.cancelAsk },
    deleteAsk,
    moveHintId: isEditable ? `${gridId}move-hint` : null,
  };
  return { binding, keyboardEdit };
}
