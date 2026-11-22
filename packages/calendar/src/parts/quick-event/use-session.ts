"use client";

import { useState } from "react";

import type { EventOccurrence } from "../../types";
import {
  QuickEventMode,
  type NewEventSlot,
  type QuickEventActions,
  type QuickEventSession,
  type QuickEventTarget,
} from "./target";

export function useQuickEvent(actions: QuickEventActions) {
  const [target, setTarget] = useState<QuickEventTarget | null>(null);
  const close = () => setTarget(null);
  const session: QuickEventSession = { target, isSaving: false, onClose: close };
  const closingActions: QuickEventActions = {
    onSave: (draft) => {
      actions.onSave(draft);
      close();
    },
    onDelete: (occurrence, scope) => {
      actions.onDelete(occurrence, scope);
      close();
    },
  };
  const openEvent = (occurrence: EventOccurrence, anchor: HTMLElement | null) =>
    setTarget({ mode: QuickEventMode.Read, occurrence, anchor });
  const openNew = (slot: NewEventSlot, anchor: HTMLElement | null) =>
    setTarget({ mode: QuickEventMode.Create, slot, anchor });
  return { session, actions: closingActions, openEvent, openNew };
}

export type QuickEventControl = ReturnType<typeof useQuickEvent>;
