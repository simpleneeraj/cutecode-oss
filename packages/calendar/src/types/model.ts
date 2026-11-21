export type Instant = number;
export type PlainDate = string;
export type IsoDateTime = string;
export type ClockTime = string;

export enum CalendarTone {
  Accent = "accent",
  Ink = "ink",
  Grey = "grey",
  Line = "line",
}

export enum EventStatus {
  Confirmed = "confirmed",
  Tentative = "tentative",
  Cancelled = "cancelled",
}

export enum Attendance {
  Accepted = "accepted",
  Tentative = "tentative",
  Declined = "declined",
  Pending = "pending",
}

export enum ResourceKind {
  Room = "room",
  Person = "person",
  Equipment = "equipment",
}

export enum Frequency {
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
  Yearly = "yearly",
}

export enum Weekday {
  Monday = "MO",
  Tuesday = "TU",
  Wednesday = "WE",
  Thursday = "TH",
  Friday = "FR",
  Saturday = "SA",
  Sunday = "SU",
}

export enum ChangeScope {
  This = "this",
  Following = "following",
  All = "all",
}

export enum ChangeSource {
  Drag = "drag",
  Resize = "resize",
  Keyboard = "keyboard",
  Form = "form",
  QuickAdd = "quickAdd",
}

export type Calendar = {
  id: string;
  name: string;
  tone: CalendarTone;
  readOnly: boolean;
  visible: boolean;
  timeZone?: string;
};

export type Attendee = {
  id: string;
  name: string;
  email?: string;
  attendance: Attendance;
  organizer?: boolean;
};

export type Recurrence = {
  frequency: Frequency;
  interval: number;
  byWeekday?: Weekday[];
  byMonthDay?: number[];
  bySetPosition?: number;
  count?: number;
  until?: string;
  exceptionDates?: string[];
  weekStartsOn?: Weekday;
};

export type CalendarEvent = {
  id: string;
  calendarId: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  timeZone: string;
  location?: string;
  notes?: string;
  resourceIds?: string[];
  attendees?: Attendee[];
  status: EventStatus;
  recurrence?: Recurrence;
  seriesId?: string;
  originalStart?: string;
  version: number;
  updatedAt: string;
};

export type ClockRange = {
  start: ClockTime;
  end: ClockTime;
};

export type Resource = {
  id: string;
  kind: ResourceKind;
  name: string;
  detail?: string;
  capacity?: number;
  bookableHours?: ClockRange;
  timeZone?: string;
};

export type EventChange = {
  eventId: string;
  originalStart: string;
  start: string;
  end: string;
  allDay: boolean;
  resourceId?: string;
  scope: ChangeScope;
  source: ChangeSource;
};

export type EventDraft = {
  calendarId: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  timeZone: string;
  location?: string;
  notes?: string;
  resourceIds?: string[];
  attendees?: Attendee[];
  recurrence?: Recurrence;
  source: ChangeSource;
};
