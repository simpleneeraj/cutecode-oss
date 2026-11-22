"use client";

import { useRef, type FocusEvent, type KeyboardEvent, type RefObject } from "react";

import { defaultDragSettings, nudgeIntent } from "../../drag";
import { commandFor } from "../../keyboard";
import { AnnouncementKind, KeyboardMode, KeyCommand, type Announcement, type TextDirection } from "../../types";
import { readOnlyAnnouncement } from "./feedback";
import { carriedAnnouncement, isUnchanged, pickedUpAnnouncement, type Carry } from "./keyboard-carry";
import type { DropFlow } from "./use-drop-flow";
import { glideElement, restPose } from "./visual";

type CarryOptions = {
  flow: DropFlow;
  timeZone: string;
  direction: TextDirection;
  announce: (announcement: Announcement) => void;
};

type CarryContext = CarryOptions & {
  carryRef: RefObject<Carry | null>;
};

const tabKey = "Tab";

function start(context: CarryContext, carry: Carry): boolean {
  const { flow, carryRef } = context;
  const isFree = carryRef.current === null && flow.sessionRef.current === null;
  if (!isFree) {
    return false;
  }
  const readOnly = readOnlyAnnouncement(carry.session.result);
  if (readOnly !== null) {
    context.announce(readOnly);
    return true;
  }
  carryRef.current = carry;
  flow.begin(carry.session);
  context.announce(pickedUpAnnouncement(carry.session.occurrence, carry.session.result));
  return true;
}

function step(context: CarryContext, carry: Carry, command: KeyCommand) {
  const { flow, timeZone } = context;
  const { session } = carry;
  const next = carry.nudge?.(carry.intent, command) ?? nudgeIntent(carry.intent, command, defaultDragSettings, timeZone);
  if (!carry.canReach(next)) {
    return;
  }
  carry.intent = next;
  session.result = flow.resolve(next);
  const from = session.pose;
  session.pose = carry.poseOf(session);
  carry.glide?.stop();
  carry.glide = glideElement(session.element, from, session.pose, flow.isReducedMotion);
  flow.show(session);
  context.announce(carriedAnnouncement(session.result));
}

function cancel(context: CarryContext, carry: Carry) {
  context.carryRef.current = null;
  carry.glide?.stop();
  context.flow.finish(false, restPose);
  context.announce({ kind: AnnouncementKind.DropCancelled, title: carry.session.occurrence.event.title });
}

function drop(context: CarryContext, carry: Carry) {
  if (isUnchanged(carry.session.result)) {
    cancel(context, carry);
    return;
  }
  context.carryRef.current = null;
  carry.glide?.stop();
  context.flow.finish(true, carry.session.pose);
}

function handleKey(context: CarryContext, event: KeyboardEvent<HTMLElement>): boolean {
  const carry = context.carryRef.current;
  if (carry === null) {
    return false;
  }
  if (event.key === tabKey) {
    cancel(context, carry);
    return false;
  }
  event.preventDefault();
  const command = commandFor(event, KeyboardMode.Carrying, context.direction);
  if (command === KeyCommand.Drop) {
    drop(context, carry);
  } else if (command === KeyCommand.Cancel) {
    cancel(context, carry);
  } else if (command !== null) {
    step(context, carry, command);
  }
  return true;
}

function blur(context: CarryContext, event: FocusEvent<HTMLElement>) {
  const carry = context.carryRef.current;
  const next = event.relatedTarget;
  const isStillInside = next instanceof Node && carry?.session.element.contains(next);
  if (carry !== null && !isStillInside) {
    cancel(context, carry);
  }
}

export function useCarry(options: CarryOptions) {
  const carryRef = useRef<Carry | null>(null);
  const context: CarryContext = { ...options, carryRef };
  return {
    start: (carry: Carry) => start(context, carry),
    handleKey: (event: KeyboardEvent<HTMLElement>) => handleKey(context, event),
    onBlur: (event: FocusEvent<HTMLElement>) => blur(context, event),
    cancel: () => {
      const carry = carryRef.current;
      if (carry !== null) {
        cancel(context, carry);
      }
    },
  };
}

