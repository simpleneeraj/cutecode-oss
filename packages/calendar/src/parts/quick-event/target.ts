import type { ReactElement } from "react";

import type {
  Calendar,
  ChangeScope,
  EventDraft,
  EventOccurrence,
  Instant,
  IsoDateTime,
  Recurrence,
  ViewSettings,
} from "../../types";

export enum QuickEventMode {
  Create = "create",
  Read = "read",
}

export type NewEventSlot = {
  start: Instant;
  end: Instant;
  allDay: boolean;
  calendarId?: string;
  resourceId?: string;
};

export type QuickEventTarget =
  | { mode: QuickEventMode.Create; slot: NewEventSlot; anchor: HTMLElement | null }
  | { mode: QuickEventMode.Read; occurrence: EventOccurrence; anchor: HTMLElement | null };

export type QuickEventDraft = EventDraft & {
  eventId?: string;
  originalStart?: IsoDateTime;
  scope?: ChangeScope;
};

export type QuickEventSession = {
  target: QuickEventTarget | null;
  isSaving: boolean;
  onClose: () => void;
};

export type QuickEventContext = {
  calendars: Calendar[];
  settings: ViewSettings;
};

export type RepeatFieldProps = {
  value: Recurrence | null;
  onValueChange: (value: Recurrence | null) => void;
  start: string;
  settings: ViewSettings;
  isSeriesException?: boolean;
};

export type RepeatSlot = (field: RepeatFieldProps) => ReactElement;

export type QuickEventActions = {
  onSave: (draft: QuickEventDraft) => void;
  onDelete: (occurrence: EventOccurrence, scope?: ChangeScope) => void;
};
