import type { ChangeSource, ClockRange, Instant, PlainDate } from "./model";
import type { EventOccurrence, TimedOccurrence } from "./occurrence";

export enum DragKind {
  Move = "move",
  Resize = "resize",
  Create = "create",
}

export enum MoveStep {
  Slot = "slot",
  Day = "day",
}

export enum VerdictKind {
  Accepted = "accepted",
  Refused = "refused",
}

export enum RefusalReason {
  ReadOnly = "readOnly",
  OutsideBookableHours = "outsideBookableHours",
  OutsideAllowedHours = "outsideAllowedHours",
  TooShort = "tooShort",
  Unchanged = "unchanged",
}

export type SlotPoint = {
  date: PlainDate;
  minute: number;
  columnKey: string;
  resourceId?: string;
};

export type MoveIntent = {
  kind: DragKind.Move;
  source: ChangeSource;
  occurrence: EventOccurrence;
  grab: SlotPoint;
  target: SlotPoint;
  step?: MoveStep;
};

export type ResizeIntent = {
  kind: DragKind.Resize;
  source: ChangeSource;
  occurrence: TimedOccurrence;
  grab: SlotPoint;
  target: SlotPoint;
};

export type CreateIntent = {
  kind: DragKind.Create;
  source: ChangeSource;
  calendarId: string;
  anchor: SlotPoint;
  target: SlotPoint;
};

export type DragIntent = MoveIntent | ResizeIntent | CreateIntent;

export type DragSettings = {
  snapMinutes: number;
  createSnapMinutes: number;
  defaultDurationMinutes: number;
  minimumDurationMinutes: number;
  allowedHours?: ClockRange;
};

export type DropProposal = {
  intent: DragIntent;
  start: Instant;
  end: Instant;
  allDay: boolean;
  resourceId?: string;
};

export type AcceptedVerdict = {
  kind: VerdictKind.Accepted;
};

export type RefusedVerdict = {
  kind: VerdictKind.Refused;
  reason: RefusalReason;
  allowedHours?: ClockRange;
  calendarName?: string;
};

export type DropVerdict = AcceptedVerdict | RefusedVerdict;

export type DragResult =
  | { kind: VerdictKind.Accepted; proposal: DropProposal }
  | { kind: VerdictKind.Refused; proposal: DropProposal; verdict: RefusedVerdict };
