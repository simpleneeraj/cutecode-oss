import type { Calendar, CalendarEvent, EventChange, Instant, PlainDate, Resource } from "./model";
import type { DropProposal, DropVerdict } from "./interaction";
import type { EventOccurrence } from "./occurrence";
import type { QuickAddContext, QuickAddResult } from "./quick-add";
import type { DateRange, DaySpan, InstantRange } from "./view";

export type ExpansionContext = {
  range: InstantRange;
  dates: DateRange;
  timeZone: string;
};

export type OccurrenceExpander = (events: CalendarEvent[], context: ExpansionContext) => EventOccurrence[];

export type ConstraintContext = {
  calendars: Calendar[];
  resources: Resource[];
  timeZone: string;
};

export type DropConstraint = (proposal: DropProposal, context: ConstraintContext) => DropVerdict;

export type ChangeApplier = (events: CalendarEvent[], change: EventChange, now: Instant) => CalendarEvent[];

export type ColumnDescriptor = {
  key: string;
  date: PlainDate;
  resourceId?: string;
};

export type ColumnSource = (dates: PlainDate[]) => ColumnDescriptor[];

export type ZoneMark = {
  minute: number;
  date: PlainDate;
  wallMinute: number;
  offsetMinutes: number;
  dayShift: number;
};

export type SecondaryZoneProvider = (day: DaySpan, timeZone: string) => ZoneMark[];

export type QuickAddParser = (text: string, context: QuickAddContext) => QuickAddResult;

export type QuickAddParserLoader = () => Promise<QuickAddParser>;

export type DayCount = {
  date: PlainDate;
  count: number;
};

export type DayAggregator = (occurrences: EventOccurrence[], dates: DateRange, timeZone: string) => DayCount[];

export type CalendarExtensions = {
  expand?: OccurrenceExpander;
  constraints?: DropConstraint[];
  applyChange?: ChangeApplier;
  columns?: ColumnSource;
  secondaryZone?: SecondaryZoneProvider;
  loadQuickAddParser?: QuickAddParserLoader;
  aggregateDays?: DayAggregator;
};
