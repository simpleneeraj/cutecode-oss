"use client";

import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";
import { useReducedMotion } from "motion/react";
import { useRef, type RefObject } from "react";
import { flushSync } from "react-dom";

import { defaultDragSettings, isChangeProposal, resolveDrop, toEventChange, type ChangeProposal } from "../../drag";
import {
  ChangeScope,
  DragKind,
  VerdictKind,
  type Announcement,
  type Calendar,
  type ClockRange,
  type DragIntent,
  type DragResult,
  type DropConstraint,
  type EventOccurrence,
  type Resource,
  type SlotPoint,
  type ViewSettings,
} from "../../types";
import { needsScope } from "../quick-event/scope";
import type { CalendarActions } from "../time-grid/props";
import { dropAnnouncement, readOnlyAnnouncement } from "./feedback";
import type { DragSourceData, DropCell } from "./source";
import { DragPhase, idleDrag, showResult, type DragStore } from "./store";
import { liftElement, releaseElement, settleElement, type Pose } from "./visual";

export type DragSession = {
  source: DragSourceData;
  element: HTMLElement;
  origin: DropCell;
  originRect: DOMRect;
  pointer: { x: number; y: number };
  home: { top: number; height: number };
  occurrence: EventOccurrence;
  grab: SlotPoint;
  target: DropCell;
  pose: Pose;
  blockSize: string;
  result: DragResult;
  unclip: () => void;
  onEnd: (isCommitted: boolean) => void;
};

export function ignoreEnd() {
  return undefined;
}

export type DropFlowOptions = {
  store: DragStore;
  settings: ViewSettings;
  calendars: Calendar[];
  allowedHours?: ClockRange;
  resources?: Resource[];
  constraints?: DropConstraint[];
  actions: CalendarActions;
  announce: (announcement: Announcement) => void;
};

const noConstraints: DropConstraint[] = [];

export function announceIf(announce: DropFlowOptions["announce"], announcement: Announcement | null) {
  if (announcement !== null) {
    announce(announcement);
  }
}

function homePose(session: DragSession): Pose {
  const isResize = session.source.kind === DragKind.Resize;
  return { x: 0, y: 0, height: isResize ? session.home.height : null };
}

type FlowContext = {
  sessionRef: RefObject<DragSession | null>;
  store: DragStore;
  actions: CalendarActions;
  announce: DropFlowOptions["announce"];
  isReducedMotion: boolean;
};

function endSession(flow: FlowContext, session: DragSession) {
  session.unclip();
  if (flow.sessionRef.current === session) {
    flow.sessionRef.current = null;
    flow.store.set(idleDrag);
  }
}

function sendHome(flow: FlowContext, session: DragSession) {
  settleElement(session.element, session.pose, homePose(session), flow.isReducedMotion).then(() => {
    releaseElement(session.element, session.blockSize);
    endSession(flow, session);
    session.onEnd(false);
  });
}

function commitChange(flow: FlowContext, session: DragSession, proposal: ChangeProposal, scope: ChangeScope) {
  releaseElement(session.element, session.blockSize);
  flushSync(() => {
    flow.actions.onEventChange?.(toEventChange(proposal, scope));
    endSession(flow, session);
  });
  session.onEnd(true);
  announceIf(flow.announce, dropAnnouncement({ kind: VerdictKind.Accepted, proposal }));
}

function settleAndCommit(flow: FlowContext, session: DragSession, proposal: ChangeProposal, settle: Pose) {
  settleElement(session.element, session.pose, settle, flow.isReducedMotion).then(() => {
    session.pose = settle;
    if (needsScope(session.occurrence)) {
      flow.store.set({ phase: DragPhase.Asking, key: session.source.key, date: session.source.date, proposal });
      return;
    }
    commitChange(flow, session, proposal, ChangeScope.All);
  });
}

function beginDrag(flow: FlowContext, session: DragSession) {
  flow.sessionRef.current = session;
  preventUnhandled.start();
  const readOnly = readOnlyAnnouncement(session.result);
  announceIf(flow.announce, readOnly);
  if (readOnly === null) {
    liftElement(session.element, flow.isReducedMotion);
  }
  showResult(flow.store, session.source.key, session.source.date, session.result);
}

function finishDrag(flow: FlowContext, isDropped: boolean, settle: Pose) {
  const session = flow.sessionRef.current;
  preventUnhandled.stop();
  if (session === null) {
    return;
  }
  const { proposal, kind } = session.result;
  const canCommit = isDropped && kind === VerdictKind.Accepted && flow.actions.onEventChange !== undefined;
  if (canCommit && isChangeProposal(proposal)) {
    settleAndCommit(flow, session, proposal, settle);
    return;
  }
  announceIf(flow.announce, isDropped ? dropAnnouncement(session.result) : null);
  sendHome(flow, session);
}

function chooseScope(flow: FlowContext, scope: ChangeScope) {
  const session = flow.sessionRef.current;
  const state = flow.store.get();
  if (session !== null && state.phase === DragPhase.Asking) {
    commitChange(flow, session, state.proposal, scope);
  }
}

export function useDropFlow(options: DropFlowOptions) {
  const { store, settings, calendars, allowedHours, actions, announce } = options;
  const sessionRef = useRef<DragSession | null>(null);
  const isReducedMotion = useReducedMotion() ?? false;
  const dragSettings = { ...defaultDragSettings, allowedHours };
  const context = { calendars, resources: options.resources ?? [], timeZone: settings.timeZone };
  const constraints = options.constraints ?? noConstraints;
  const flow: FlowContext = { sessionRef, store, actions, announce, isReducedMotion };

  return {
    sessionRef,
    isReducedMotion,
    resolve: (intent: DragIntent) => resolveDrop(intent, dragSettings, context, constraints),
    begin: (session: DragSession) => beginDrag(flow, session),
    show: (session: DragSession) => showResult(store, session.source.key, session.source.date, session.result),
    finish: (isDropped: boolean, settle: Pose) => finishDrag(flow, isDropped, settle),
    choose: (scope: ChangeScope) => chooseScope(flow, scope),
    cancelAsk: () => {
      const session = sessionRef.current;
      if (session !== null) {
        sendHome(flow, session);
      }
    },
  };
}

export type DropFlow = ReturnType<typeof useDropFlow>;
