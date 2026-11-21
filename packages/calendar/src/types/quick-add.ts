import type { EventDraft, Instant } from "./model";
import type { ViewSettings } from "./view";

export enum QuickAddField {
  Title = "title",
  Day = "day",
  Time = "time",
  Duration = "duration",
  Repeat = "repeat",
  With = "with",
  Where = "where",
}

export type TextSpan = {
  start: number;
  end: number;
};

export type QuickAddChip = {
  field: QuickAddField;
  label: string;
  span: TextSpan;
};

export type QuickAddContext = {
  now: Instant;
  settings: ViewSettings;
  calendarId: string;
};

export type QuickAddResult = {
  draft: EventDraft | null;
  chips: QuickAddChip[];
  missing: QuickAddField[];
};
