"use client";

import { useSyncExternalStore } from "react";

import type { ChangeProposal } from "../../drag";
import { VerdictKind, type DragResult, type PlainDate } from "../../types";
import { isReadOnlyRefusal, isRefusal } from "./feedback";

export enum DragPhase {
  Idle = "idle",
  Dragging = "dragging",
  Asking = "asking",
}

export enum SlotLook {
  Rest = "rest",
  Lifted = "lifted",
  Refused = "refused",
  Locked = "locked",
}

export type DragState =
  | { phase: DragPhase.Idle }
  | { phase: DragPhase.Dragging; key: string | null; date: PlainDate; result: DragResult }
  | { phase: DragPhase.Asking; key: string; date: PlainDate; proposal: ChangeProposal };

export type DragStore = {
  get: () => DragState;
  set: (next: DragState) => void;
  subscribe: (listener: () => void) => () => void;
};

export const idleDrag: DragState = { phase: DragPhase.Idle };

export function createDragStore(): DragStore {
  let state = idleDrag;
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set: (next) => {
      state = next;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

function isSameResult(first: DragResult, second: DragResult): boolean {
  const isSamePlace = first.proposal.start === second.proposal.start && first.proposal.end === second.proposal.end;
  const firstReason = first.kind === VerdictKind.Refused ? first.verdict.reason : null;
  const secondReason = second.kind === VerdictKind.Refused ? second.verdict.reason : null;
  return isSamePlace && firstReason === secondReason;
}

export function showResult(store: DragStore, key: string | null, date: PlainDate, result: DragResult) {
  const current = store.get();
  const isSame = current.phase === DragPhase.Dragging && current.key === key && isSameResult(current.result, result);
  if (!isSame) {
    store.set({ phase: DragPhase.Dragging, key, date, result });
  }
}

function isSlot(state: DragState, key: string, date: PlainDate): boolean {
  return state.phase !== DragPhase.Idle && state.key === key && state.date === date;
}

export function slotLookOf(state: DragState, key: string, date: PlainDate): SlotLook {
  if (!isSlot(state, key, date)) {
    return SlotLook.Rest;
  }
  if (state.phase === DragPhase.Dragging && isReadOnlyRefusal(state.result)) {
    return SlotLook.Locked;
  }
  if (state.phase === DragPhase.Dragging && isRefusal(state.result)) {
    return SlotLook.Refused;
  }
  return SlotLook.Lifted;
}

export function slotResultOf(state: DragState, key: string, date: PlainDate): DragResult | null {
  return state.phase === DragPhase.Dragging && isSlot(state, key, date) ? state.result : null;
}

export function createResultOf(state: DragState, date: PlainDate): DragResult | null {
  const isCreating = state.phase === DragPhase.Dragging && state.key === null && state.date === date;
  return isCreating ? state.result : null;
}

export function askedProposalOf(state: DragState): ChangeProposal | null {
  return state.phase === DragPhase.Asking ? state.proposal : null;
}

export function isMovingLook(look: SlotLook): boolean {
  return look === SlotLook.Lifted || look === SlotLook.Refused;
}

export function useDragState<Selected>(store: DragStore, select: (state: DragState) => Selected): Selected {
  return useSyncExternalStore(
    store.subscribe,
    () => select(store.get()),
    () => select(idleDrag),
  );
}
