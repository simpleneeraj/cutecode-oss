import type { ClockRange, Instant, PlainDate, Weekday } from "./model";

export enum ViewKind {
  Day = "day",
  Week = "week",
  Month = "month",
  Year = "year",
  Agenda = "agenda",
}

export enum HourCycle {
  Twelve = "h12",
  TwentyFour = "h23",
}

export enum TextDirection {
  LeftToRight = "ltr",
  RightToLeft = "rtl",
}

export type DateRange = {
  start: PlainDate;
  end: PlainDate;
};

export type InstantRange = {
  start: Instant;
  end: Instant;
};

export type WallClock = {
  date: PlainDate;
  minute: number;
};

export type WeekInfo = {
  firstDay: Weekday;
  weekend: Weekday[];
};

export type ViewSettings = {
  locale: string;
  timeZone: string;
  weekStartsOn: Weekday;
  hourCycle: HourCycle;
  workingHours?: ClockRange;
};

export type ViewRange = {
  kind: ViewKind;
  anchor: PlainDate;
  dates: DateRange;
  instants: InstantRange;
  timeZone: string;
  weekStartsOn: Weekday;
};

export type DaySpan = {
  date: PlainDate;
  start: Instant;
  end: Instant;
  minutes: number;
};

export type HourMark = {
  instant: Instant;
  minute: number;
  wallMinute: number;
  offsetMinutes: number;
  repeated: boolean;
  afterGap: boolean;
};
