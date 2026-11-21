export enum EventTone {
  Accent = "accent",
  Neutral = "neutral",
}

export const calendarHours = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM"];

export const calendarPoints = [
  "Day, week and month views",
  "Drag an event to a new time",
  "Same tokens and styles as every other part",
];

export const calendarViews = [
  { id: "day", label: "Day", isCurrent: false },
  { id: "week", label: "Week", isCurrent: true },
  { id: "month", label: "Month", isCurrent: false },
];

const standup = { id: "standup", title: "Standup", time: "", start: 1, span: 1, tone: EventTone.Neutral };

export const calendarDays = [
  {
    id: "mon",
    name: "Mon",
    date: 16,
    isToday: false,
    events: [
      standup,
      { id: "review", title: "Design review", time: "10:00 to 11:30", start: 3, span: 3, tone: EventTone.Accent },
    ],
  },
  {
    id: "tue",
    name: "Tue",
    date: 17,
    isToday: false,
    events: [
      standup,
      { id: "lunch", title: "Lunch with Ana", time: "12:00", start: 7, span: 2, tone: EventTone.Neutral },
    ],
  },
  {
    id: "wed",
    name: "Wed",
    date: 18,
    isToday: true,
    events: [
      standup,
      {
        id: "ship",
        title: "Ship folders",
        time: "10:30 to 12:00",
        start: 4,
        span: 3,
        tone: EventTone.Accent,
        isLifted: true,
      },
      { id: "lunch", title: "Lunch with Ana", time: "12:00", start: 7, span: 2, tone: EventTone.Neutral },
    ],
  },
  {
    id: "thu",
    name: "Thu",
    date: 19,
    isToday: false,
    events: [
      standup,
      { id: "interview", title: "Interview", time: "1:00 PM", start: 9, span: 2, tone: EventTone.Neutral },
    ],
  },
  {
    id: "fri",
    name: "Fri",
    date: 20,
    isToday: false,
    events: [
      { id: "planning", title: "Planning", time: "9:30 to 11:00", start: 2, span: 3, tone: EventTone.Accent },
      { id: "demo", title: "Demo day", time: "1:30 PM", start: 10, span: 1, tone: EventTone.Neutral },
    ],
  },
];

export const weekStrip = [
  { id: "mon", name: "Mon", date: 16 },
  { id: "tue", name: "Tue", date: 17 },
  { id: "wed", name: "Wed", date: 18 },
  { id: "thu", name: "Thu", date: 19 },
  { id: "fri", name: "Fri", date: 20 },
  { id: "sat", name: "Sat", date: 21 },
  { id: "sun", name: "Sun", date: 22 },
];

export const todayId = "wed";
