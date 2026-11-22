import type {
  Calendar,
  ChangeScope,
  EventDraft,
  EventOccurrence,
  Instant,
  IsoDateTime,
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

export type QuickEventActions = {
  onSave: (draft: QuickEventDraft) => void;
  onDelete: (occurrence: EventOccurrence, scope?: ChangeScope) => void;
};
