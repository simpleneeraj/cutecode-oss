import type { SettingsInput } from "../../locale";
import type {
  Calendar,
  CalendarEvent,
  ChangeScope,
  ClockRange,
  EventChange,
  IsoDateTime,
  EventOccurrence,
  InstantRange,
  OccurrenceExpander,
  PlainDate,
  ViewKind,
} from "../../types";
import type { NewEventSlot } from "../quick-event/target";
import type { CalendarStatus } from "../state/status";
import type { FoldOpen } from "./axis";
import type { SecondaryZone } from "./gutter-labels";

export enum HourZoom {
  Compact = "compact",
  Regular = "regular",
  Spacious = "spacious",
}

export const hourHeights: Record<HourZoom, number> = {
  [HourZoom.Compact]: 44,
  [HourZoom.Regular]: 64,
  [HourZoom.Spacious]: 92,
};

export type CalendarData = {
  events: CalendarEvent[];
  calendars: Calendar[];
  expand?: OccurrenceExpander;
};

export type CalendarNavigation = {
  date: PlainDate;
  onDateChange: (date: PlainDate) => void;
  view: ViewKind;
  onViewChange: (view: ViewKind) => void;
  views?: ViewKind[];
};

export type FoldState = {
  open: FoldOpen;
  onOpenChange: (open: FoldOpen) => void;
};

export type TimeGridOptions = SettingsInput & {
  shownHours?: ClockRange;
  hourZoom?: HourZoom;
  viewerId?: string;
  secondaryZone?: SecondaryZone;
  fold?: FoldState;
  now?: IsoDateTime;
  allowedHours?: ClockRange;
  draft?: InstantRange | null;
};

export type CalendarActions = {
  onEventOpen: (occurrence: EventOccurrence) => void;
  onEventChange?: (change: EventChange) => void;
  onSlotCreate?: (slot: NewEventSlot, anchor: HTMLElement | null) => void;
  onQuickAdd?: (slot: NewEventSlot, anchor: HTMLElement | null) => void;
  onEventDelete?: (occurrence: EventOccurrence, scope?: ChangeScope) => void;
  onEventDuplicate?: (occurrence: EventOccurrence) => void;
  onUndo?: () => boolean;
};

export type CalendarViewProps = {
  data: CalendarData;
  navigation: CalendarNavigation;
  options: TimeGridOptions;
  status?: CalendarStatus;
  actions: CalendarActions;
};
