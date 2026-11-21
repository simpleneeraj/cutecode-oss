# @cutecode/calendar

The engine behind the CuteUI Calendar.

It does the hard calendar math and gives you plain data back. It draws nothing. You bring the view layer (React, Vue, plain DOM), and this package tells it where every event goes, what the keyboard should do, and what to say to screen readers.

- Written in TypeScript, no framework inside.
- Every part is its own import path, so an app only ships what it uses.
- Pure functions: same input, same output. Safe to memoize.
- Correct on daylight saving days, across midnight, with weeks that start on Sunday or Monday, and with 12 or 24 hour clocks.
- No left or right in the data. Layout works the same for right-to-left languages.

## Free and Pro

|                                                           | Free (`@cutecode/calendar`, MIT) | Pro (`@cutecode/calendar-pro`) |
| --------------------------------------------------------- | -------------------------------- | ------------------------------ |
| Dates, ranges, time zones for display                     | yes                              |                                |
| Day, week, month, agenda layout                           | yes                              |                                |
| Overlapping events, all-day and multi-day bars            | yes                              |                                |
| Drag and resize math (snap, limits, refusals)             | yes                              |                                |
| Date pickers and small widgets                            | yes                              |                                |
| Keyboard model and screen reader phrases                  | yes                              |                                |
| Repeating events (RRULE), "this / following / all" edits  |                                  | yes                            |
| Second time zone column, zone mismatch warning            |                                  | yes                            |
| Rooms and people as columns, bookable hours               |                                  | yes                            |
| Quick add from typed text ("Lunch with Sam tomorrow 1pm") |                                  | yes                            |
| Year heat map counts                                      |                                  | yes                            |

The free package never imports Pro. Pro plugs in through typed hooks in `@cutecode/calendar/types` (`CalendarExtensions`): an occurrence expander, drop constraints, a change applier, a column source, a second-zone provider, a quick-add parser loader and a day aggregator.

## Install

```sh
yarn add @cutecode/calendar
```

It uses `date-fns`, `@date-fns/tz`, `@date-fns/utc`, `memoize-one` and `@tanstack/virtual-core`. They install with it.

## Words used here

- **PlainDate**: a calendar date with no time, like `"2026-11-18"`.
- **Instant**: a moment in time, as milliseconds since 1970 (UTC).
- **Wall clock**: what a clock on the wall shows in a zone: a date plus minutes since midnight.
- **Occurrence**: one showing of an event on the calendar. A repeating event has many.

## Modules

Each heading is an import path.

### `@cutecode/calendar/time`

Dates, zones and ISO strings.

```ts
import { addDays, daySpan, formatDateTime, parseDateTime, toWallClock } from "@cutecode/calendar/time";

addDays("2026-03-07", 1); // "2026-03-08"
daySpan("2026-03-08", "America/Los_Angeles").minutes; // 1380, the spring day has 23 hours
const start = parseDateTime("2026-11-18T10:00:00-08:00", "America/Los_Angeles");
toWallClock(start, "Asia/Tokyo"); // { date: "2026-11-19", minute: 180 }
formatDateTime(start, "UTC"); // "2026-11-18T18:00:00Z"
```

### `@cutecode/calendar/event`

Turn stored events into occurrences for a range.

```ts
import { occurrencesInRange } from "@cutecode/calendar/event";

const occurrences = occurrencesInRange(events, {
  range: view.instants,
  dates: view.dates,
  timeZone: view.timeZone,
});
```

Pass Pro's `expandRecurrences` as the third argument to expand repeating events.

### `@cutecode/calendar/locale`

Settings from the user's locale, and labels through `Intl`.

```ts
import { formatTimeRange, resolveSettings } from "@cutecode/calendar/locale";

const settings = resolveSettings({ locale: "en-GB", timeZone: "Europe/London" });
// weekStartsOn Monday, 24 hour clock
formatTimeRange(start, end, settings); // "09:00–17:30"
```

### `@cutecode/calendar/range`

What dates a view shows, and how to step through them.

```ts
import { daySpans, hourMarks, navigate, viewRange } from "@cutecode/calendar/range";
import { ViewKind } from "@cutecode/calendar/types";

const view = viewRange(ViewKind.Week, "2026-11-18", settings);
const next = navigate(ViewKind.Week, view.anchor, 1); // "2026-11-25"
const days = daySpans(view);
const marks = hourMarks(days[0], settings.timeZone); // 23, 24 or 25 hour lines
```

### `@cutecode/calendar/layout`

Where every event goes in a range. Memoized: same arguments give the same object back.

```ts
import { createLayoutRange } from "@cutecode/calendar/layout";

const layoutRange = createLayoutRange();
const layout = layoutRange(occurrences, view, {
  maxColumns: 3,
  minimumMinutes: 30,
  hiddenCalendarIds: [],
});
// layout.columns: timed boxes per day, with overflow chips
// layout.bars: all-day and multi-day bars, by week and lane
```

The parts are also on their own paths:

- `@cutecode/calendar/layout/timed`: `layoutDayColumn`, `layoutTimedColumns`, `isShortTimed`.
- `@cutecode/calendar/layout/span`: `layoutSpans`, `isSpanning`, `laneCount`.
- `@cutecode/calendar/layout/month`: `layoutMonth`.

```ts
import { layoutMonth } from "@cutecode/calendar/layout/month";
import { monthWeeks } from "@cutecode/calendar/time";

const month = layoutMonth(occurrences, monthWeeks("2026-11-01", settings.weekStartsOn), {
  timeZone: settings.timeZone,
  month: "2026-11-01",
  chipCapacity: 4,
  hiddenCalendarIds: [],
});
```

### `@cutecode/calendar/drag`

Drag and resize math. No pointer code here: your drag library reports where the pointer is, this module says where the event would land and whether that is allowed.

```ts
import { defaultDragSettings, isChangeProposal, resolveDrop, toEventChange } from "@cutecode/calendar/drag";
import { ChangeScope, ChangeSource, DragKind } from "@cutecode/calendar/types";

const result = resolveDrop(
  { kind: DragKind.Move, source: ChangeSource.Drag, occurrence, grab, target },
  defaultDragSettings,
  { calendars, resources: [], timeZone: settings.timeZone },
  [],
);
```

`result.kind` is accepted or refused. Both carry the snapped `proposal`; a refusal also carries a `verdict` with the reason. For an accepted move or resize, check `isChangeProposal(result.proposal)`, then `toEventChange(result.proposal, ChangeScope.This)` gives the change to save.

### `@cutecode/calendar/keyboard`

Keys to commands, and commands to the next focused slot.

```ts
import { commandFor, moveFocus } from "@cutecode/calendar/keyboard";
import { KeyboardMode, TextDirection } from "@cutecode/calendar/types";

const command = commandFor(
  { key: "ArrowDown", shiftKey: false, metaKey: false, ctrlKey: false, altKey: false },
  KeyboardMode.Browse,
  TextDirection.LeftToRight,
);
if (command) {
  focus = moveFocus(focus, command, { dates, columnKeys, stepMinutes: 60, days, timeZone });
}
```

### `@cutecode/calendar/announce`

What to say in the live region, and the name of each event for screen readers.

```ts
import { announce, eventAccessibleName } from "@cutecode/calendar/announce";
import { AnnouncementKind, ViewKind } from "@cutecode/calendar/types";

announce({ kind: AnnouncementKind.ViewChanged, view: ViewKind.Week }, settings); // "Week view."
eventAccessibleName(occurrence, calendar, settings); // "Design crit, Wednesday, November 18, 10 AM to 11 AM"
```

### `@cutecode/calendar/agenda`

The agenda list: events grouped by day, in order, with "continues" flags.

```ts
import { groupAgenda } from "@cutecode/calendar/agenda";

const days = groupAgenda(occurrences, view.dates, Date.now(), settings.timeZone);
```

### `@cutecode/calendar/agenda/virtual`

Options for `@tanstack/virtual-core`, so a long agenda only renders what is on screen, with a sticky day header.

```ts
import { Virtualizer } from "@tanstack/virtual-core";
import { agendaItems, agendaVirtualizerOptions } from "@cutecode/calendar/agenda/virtual";

const items = agendaItems(days);
const virtualizer = new Virtualizer(agendaVirtualizerOptions(items, { header: 32, row: 56 }, () => scrollElement));
```

### `@cutecode/calendar/picker`

Date and date range pickers.

```ts
import { pickerMonth, selectDate, SelectionMode, type DateSelection } from "@cutecode/calendar/picker";

const rules = { min: "2026-11-01", disabledDates: ["2026-11-26"] };
let selection: DateSelection = { mode: SelectionMode.Range, start: null, end: null };
selection = selectDate(selection, "2026-11-18", rules);
const grid = pickerMonth("2026-11-01", settings, selection, rules, "2026-11-21");
```

### `@cutecode/calendar/widgets`

Data for small widgets: up next, a week strip and a compact month.

```ts
import { busyDayLines, upNext, weekStrip } from "@cutecode/calendar/widgets";

upNext(occurrences, Date.now(), 3, settings.timeZone);
weekStrip("2026-11-18", settings, "2026-11-21");
busyDayLines(occurrences, weeks, settings.timeZone, 3); // Map of date to { lines, hiddenCount }
```

### `@cutecode/calendar/types` and `@cutecode/calendar/testing`

`types` holds every shared type and enum, plus the Pro extension points. `testing` holds helpers for tests: `makeEvent`, `makeSettings`, `testZones`, and `dstTransitions2026` (every 2026 daylight saving day in the test zones).

## Pro in one example

```ts
import { occurrencesInRange } from "@cutecode/calendar/event";
import { expandRecurrences } from "@cutecode/calendar-pro/recurrence";

const occurrences = occurrencesInRange(events, context, expandRecurrences);
```

Pro paths: `/recurrence`, `/zones`, `/resources`, `/quick-add` (loads `chrono-node` only when first used) and `/heat`.
