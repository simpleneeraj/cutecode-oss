import type { CalendarEvent } from "../../types";

export enum CalendarStatusKind {
  Ready = "ready",
  Loading = "loading",
  Failed = "failed",
  Offline = "offline",
  Conflict = "conflict",
}

export enum ConflictChoice {
  KeepMine = "keepMine",
  UseTheirs = "useTheirs",
}

export type SyncConflict = {
  yours: CalendarEvent;
  theirs: CalendarEvent;
};

export type ConflictAsk = {
  conflict: SyncConflict;
  isSaving: boolean;
  onResolve: (choice: ConflictChoice) => void;
  onDismiss: () => void;
};

export type CalendarStatus =
  | { kind: CalendarStatusKind.Ready }
  | { kind: CalendarStatusKind.Loading }
  | { kind: CalendarStatusKind.Failed; onRetry: () => void }
  | { kind: CalendarStatusKind.Offline; pendingEventIds: string[] }
  | { kind: CalendarStatusKind.Conflict; ask: ConflictAsk };

export const readyStatus: CalendarStatus = { kind: CalendarStatusKind.Ready };

const noPendingEvents: ReadonlySet<string> = new Set();

export function pendingEventIdsOf(status: CalendarStatus): ReadonlySet<string> {
  return status.kind === CalendarStatusKind.Offline ? new Set(status.pendingEventIds) : noPendingEvents;
}

export function conflictAskOf(status: CalendarStatus): ConflictAsk | null {
  return status.kind === CalendarStatusKind.Conflict ? status.ask : null;
}

export function isShowingEvents(status: CalendarStatus): boolean {
  return status.kind !== CalendarStatusKind.Loading && status.kind !== CalendarStatusKind.Failed;
}
