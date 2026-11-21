# CuteUI Calendar spec

Status: concept, coming soon. Nothing here is built. The canvas is `index.html` in this folder; every value below is in place there. It reuses the approved tokens, glass recipe and motion tokens from `../premium-design/` without changes. **NEW** marks something that does not exist yet.

## 1. Direction

- A full scheduler, not a date picker: five views, drag and resize, repeating events, time zones, rooms and people, natural-language add.
- Plus a family of small parts that share one core: compact month, week strip, date and range pickers, desk calendar, widgets, task agenda, heat month, money calendar.
- Neutrals carry it. One accent per page. One warm glow behind. Very round shapes, low-contrast edges, long soft shadows.
- Red only where it means something: the now line, Delete.
- Apple HIG: 44pt targets, system text styles, Reduce Motion and Reduce Transparency handled for every part.

## 2. Color rules for calendars

Calendars never pick a color. They pick a **tone** (NEW `CalendarTone`), and tones come only from the accent and greys:

| Tone | Body | Text | Bar and toggle |
|---|---|---|---|
| `accent` | `brandSoft` | `brandInk` | `brand` |
| `ink` | `foreground` 7% on `card` | `foreground` | `foreground` 70% |
| `grey` | `foreground` 4% on `card` | `foreground` | `foreground` 26% |
| `line` | `card` with a 1px `foreground` 12% edge | `foreground` | `foreground` 14% |

- One calendar gets `accent` (the user's main one). The rest share the three neutrals. More than four calendars share tones; the name, a glyph and grouping tell them apart.
- Today is an ink circle. Selected day is `brandSoft` with `brandInk`. The now line is `destructive`.
- Year heat map and heat month: 5 steps of `brand` mixed into `card` (0, 22, 45, 70, 100 percent).
- Event status is drawn with neutrals, never new colors: tentative is a soft hatch, declined is an outline with strike, cancelled is a grey fill with strike. The word is in the label too.
- Variants: the date picker frame may be the accent (one tinted frame, the one accent in that frame). Money glyphs are neutral icon tiles, never brand logos.
- NEW tokens: `island` (#1d1d1f light, #000000 dark) and `islandInk` (#f5f5f7) for the Dynamic Island style week bar. Nothing else new for color.

## 3. Data model

TypeScript, `type` over `interface`, fixed sets as string enums. Times are ISO 8601 strings so shapes stay flat and store well (works in DynamoDB or Postgres JSON as is).

```ts
enum CalendarTone { Accent = "accent", Ink = "ink", Grey = "grey", Line = "line" }
enum EventStatus { Confirmed = "confirmed", Tentative = "tentative", Cancelled = "cancelled" }
enum Attendance { Accepted = "accepted", Tentative = "tentative", Declined = "declined", Pending = "pending" }
enum ResourceKind { Room = "room", Person = "person", Equipment = "equipment" }
enum Frequency { Daily = "daily", Weekly = "weekly", Monthly = "monthly", Yearly = "yearly" }
enum Weekday { Monday = "MO", Tuesday = "TU", Wednesday = "WE", Thursday = "TH", Friday = "FR", Saturday = "SA", Sunday = "SU" }
enum ChangeScope { This = "this", Following = "following", All = "all" }
enum ChangeSource { Drag = "drag", Resize = "resize", Keyboard = "keyboard", Form = "form", QuickAdd = "quickAdd" }

type Calendar = {
  id: string;
  name: string;
  tone: CalendarTone;
  readOnly: boolean;
  visible: boolean;
  timeZone?: string;
};

type Attendee = { id: string; name: string; email?: string; attendance: Attendance; organizer?: boolean };

type CalendarEvent = {
  id: string;
  calendarId: string;
  title: string;
  start: string;           // "2026-11-18T10:00:00-08:00", or "2026-11-18" when allDay
  end: string;             // exclusive; equal to start for a zero-minute marker
  allDay: boolean;
  timeZone: string;        // IANA zone the event was made in, "America/Los_Angeles"
  location?: string;
  notes?: string;
  resourceIds?: string[];
  attendees?: Attendee[];
  status: EventStatus;
  recurrence?: Recurrence;
  seriesId?: string;       // set on an exception of a repeating event
  originalStart?: string;  // which occurrence this exception replaces
  version: number;         // sync and conflict check
  updatedAt: string;
};

type Recurrence = {
  frequency: Frequency;
  interval: number;                 // every 2 weeks = 2
  byWeekday?: Weekday[];
  byMonthDay?: number[];
  bySetPosition?: number;           // "second Tuesday" = 2 with byWeekday TU
  count?: number;
  until?: string;
  exceptionDates?: string[];        // EXDATE: occurrences removed
};

type Resource = {
  id: string;
  kind: ResourceKind;
  name: string;
  detail?: string;                  // "8 seats", "Phone booth"
  capacity?: number;
  bookableHours?: { start: string; end: string };   // "08:00" to "18:00"
  timeZone?: string;
};

type EventChange = {
  eventId: string;
  start: string;
  end: string;
  resourceId?: string;
  scope: ChangeScope;               // asked only for repeating events
  source: ChangeSource;
};
```

Rules:
- Recurrence is an RFC 5545 RRULE subset. Occurrences are expanded per visible range, never stored. Editing "This event" writes an exception (`seriesId` and `originalStart`). "This and following" splits the series: the old one gets `until`, a new series starts. "All events" edits the series.
- `end` is exclusive. All-day events use plain dates; a three-day trip is `2026-11-20` to `2026-11-23`.
- Rendering zone is a view prop, not part of events. Events keep the zone they were made in, so a 9 AM standup stays 9 AM local across DST.

## 4. Views and interactions

| View | Layout | Interactions |
|---|---|---|
| Week | Day headers, all-day row, hour grid. Gutter shows one or two zones. Working hours plain, the rest shaded. Weekend shaded. Now line in today, a faint line across the week. | Drag to move (snaps 15 min, across days), drag the bottom grip to resize, click an empty slot to create (30 min snap, 1 hr default), click an event for its popover, overlapping events side by side up to 3 then a +N chip. |
| Day | Same grid, one day, up to 4 side by side. With resources, one column per room or person, headers carry a glyph or avatar and a detail line. | Same as week. Dragging across resource columns rebooks. Resources outside `bookableHours` refuse a drop with a hint. |
| Month | 7 columns, 5 or 6 rows sharing the height. Bars for multi-day events on lanes under the date. Chips: dot, title, time. | Fit as many chips as the row allows, then +N more which opens the day. Click a day to select, double click to open day view. |
| Year | 12 months, each day a square on the accent heat scale. Legend Less to More. Today ringed. | Click a day to open it. Hover shows a count. |
| Agenda | Grouped by day with sticky day headers (glass). All-day first, then time order. Past rows dimmed. | Infinite in both directions, virtualized. Click opens details. |
| Sidebar | Search, mini month with this week banded, calendar toggles grouped My calendars and Other, a small Up next card. | Toggles hide a calendar everywhere. Search replaces the mini month with results until cleared. Read-only calendars show a lock. |
| Phone | Large title, day strip in a glass pill (selected day is a raised tile), all-day pills, timeline, floating add button, glass tab bar. | Tap a day, swipe the timeline for the next or previous day, long-press to pick up an event then drag with auto-scroll at the edges, pinch or the zoom control for hour height (44, 64, 92), tap an event for the details Drawer, + opens the new event Drawer. |
| Tablet | Week without the sidebar; the sidebar opens as an overlay from the toolbar button. | Same as desktop. |
| Phone landscape | 5-day week, compact header, side safe-area insets. | Same as phone. |

Overlays:
- Quick event popover (desktop): glass layer 3, 344 wide, anchored to the slot, opens on the side with room. Title, time, repeat, calendar, invitees as chips, place. Return adds, Esc closes.
- On phone every popover becomes a coss Drawer, always mounted, driven by `open`.
- Recurring edit: Dialog on desktop, Drawer on phone. Three options as radio cards: This event, This and following (default), All events.
- Natural-language add: one field, parses as you type into chips (title, day, time, length, repeat, with, where). States: empty (example hint), typing, parsed, missing day (goes on today), missing time (all-day), unknown text (stays in the title). Chips are tappable to fix. The parser is lazy-loaded on focus.

## 5. Edge cases and their rules

| Case | Rule |
|---|---|
| 5 or more overlap | Columns by start order, longest first. Max 3 in week, 4 in day. The rest fold into a +N chip that opens a list. |
| Long titles and places | Title clamps to 2 lines on tall blocks, 1 on short ones. Place ends in an ellipsis. Full text in the accessible name and in the popover. |
| 0 and 5 minute events | Drawn at least 18px tall. The time shown stays true. Zero minutes is a deadline marker. |
| Crossing midnight | One event, two pieces with squared cut corners. Month shows it on both days. Agenda says Continues from Tue. Drag moves the whole event. |
| Multi-week span | The bar breaks at the week edge with a squared end and an arrow; the title repeats on each row; the lane is kept when possible. |
| DST days | Grids follow real elapsed time. The fall day has 25 hours and shows 1 AM twice with its zone. The spring day skips 2 AM with a torn line. |
| Time-zone mismatch | A banner once per session: device zone versus calendar zone, with Use and Keep. A second zone column can stay on. |
| 12 or 24 hour, week start | From the locale, overridable. Sunday or Monday start; Monday start makes November 2026 a 6-row month. |
| Outside working hours | Hours outside the shown range fold into a pill with a count ("2 earlier, from 6:30 AM"). Tap to open; remembered per user. |
| Past events | 50 percent opacity, still clickable. |
| Tentative, declined, cancelled | Neutral hatch, outline with strike, grey with strike. |
| Read-only calendars | Lock on the event, no grip, no drag, no delete. A drag attempt shows "Name is read only". |
| Refused drop | Snap every 15 min. Outside allowed hours the block hatches and a tip says why. On release it returns. |
| Offline | A banner; edits save locally and show a hollow dot until synced. |
| Sync conflict | Ask once: Yours versus Theirs, Keep mine or Use theirs. The other copy goes to history. |
| 6-row month | Rows share the height, so 5 and 6 row months fit the same box with no jump. |
| Right to left | Logical properties everywhere: gutter, bars, now dot, arrows (mirrored), popover side all flip. Clock and digits from the locale. |

## 6. Keyboard and accessibility

Shortcuts (Apple Calendar style, shown in a sheet with `?`):

| Key | Action |
|---|---|
| T | Today |
| Left, Right | Previous or next day (mirrored in RTL) |
| Up, Down | Previous or next hour |
| Shift + Left, Right | Previous or next week |
| D, W, M, Y, A | Day, Week, Month, Year, Agenda |
| N | New event at the focused slot |
| Return | Open the focused event |
| Delete, Backspace | Delete the focused event (not on read-only) |
| Cmd + D | Duplicate the focused event |
| Space on an event | Pick up; arrows move by 15 min or a day; Return drops; Esc cancels |
| / | Search |
| Cmd + K | Quick add |
| Esc | Close the popover, sheet or cancel a drag |

Roles and names:
- Week and day grid: `role="grid"`, header row of `columnheader`, each day column a `gridcell`. One tab stop into the grid (roving tabindex); arrows move a visible focus cell.
- Month: `role="grid"`, rows of `gridcell` days, each with its date and event count in the name.
- Events: `role="button"`, name = "Title, Day, Start to End, Place, read only" as needed.
- Popover and Drawer: `role="dialog"` with a name; Dialog and Drawer are modal; focus goes to the title field and returns to the slot or event on close.
- Toggles in the sidebar: `role="switch"` with `aria-checked`.
- Loading: `aria-busy="true"` on the grid; skeletons are decorative.

Announcements (one polite live region per calendar):
- View change: "Week view." Navigation: "Week of November 15."
- Focus move: "Wednesday, November 18, 10 AM. 2 events."
- Move: "Moved Design crit to Thursday, 11 AM to 12 PM." Resize: "Roadmap sync now ends at 12:45 PM."
- Refusal: "Can't move there. Hours are 7 AM to 7 PM. It went back." Read only: "Thanksgiving is on US holidays, which is read only."
- Delete: "Deleted Design crit. Press Command Z to undo." Toggle: "Family hidden."

Focus rings: 2px `focusGap` then 2px `ring`, on cells, events and every control. Touch: every target 44pt; VoiceOver users get Move up, Move down and Move to day actions in the rotor instead of long-press.

## 7. Motion

Uses the approved tokens: `--duration-fade` 150ms, `--duration-snappy` 405ms with `--ease-snappy` (spring 420/32), `--duration-gentle` 434ms with `--ease-gentle` (spring 260/30), and `--move` (0 under Reduce Motion). In React: `motion` with `useReducedMotion()`; no `@keyframes`, no idle loops.

| Motion | Full | Reduced |
|---|---|---|
| View switch | New view fades in and rises 10px, gentle. View Transitions API when present. | Opacity only, 150ms. |
| Drag | Lift: scale 1.02, raised shadow. Follows the pointer with transforms, snaps 15 min, settles with the snappy spring. | No scale. Snaps in place, no settle. |
| Resize | Grip height follows the pointer, time tip updates live. | Same; the tip only fades. |
| Popover | Scale 0.94 to 1 from the anchored slot plus opacity. | Opacity only. |
| Drawer | Slides up, gentle; scrim fades. | Fades in place. |
| Swipe days | Follows the finger, then slides 40px and fades. | Cross fade. |
| Desk flip | Day tile turns on X, new date lands. | Cross fade. |
| Segmented, switches | Thumb slides, snappy. | Thumb jumps; color fades 150ms. |
| Quick add chips | New chips rise 4px and fade in. | Fade only. |

Never animate: grid layout during drag, scroll position, text size, anything on a timer. Skeletons are static.

## 8. Variants

Each is its own entry, light and dark, phone and desktop. All take `events`, `value` or `onValueChange` where they apply, plus `locale`, `timeZone`, `weekStartsOn`.

| Part | What it is | States |
|---|---|---|
| Compact month | Soft tile days; busy days are filled tiles holding up to 3 event lines; Grid or List toggle; calendar filter chips with counts. | Selected, loading, empty month. |
| Week strip | Soft pill with a raised selected tile; Island look (black pill) and a compact Island pill for headers. | Selected, past locked. |
| Date picker, range picker | One tinted frame (accent or neutral), month and year selects, Confirm and Cancel. Range fills `brandSoft` between ends. | Single, range start only, disabled dates, invalid range. |
| Desk calendar | Tactile flip-date tiles with binder rings on warm paper. Tap to flip. | Next day, nothing planned. |
| Widgets | Small (today), medium (date tile with next 2), medium with a folder-tab notch holding the time, large (month glance and 3 events). | Day done, placeholder, busy. |
| Task agenda | Week strip, To do, Completed, Pending segmented, groups Morning, Workload, Night with checkboxes and neutral glyph tiles, floating tab bar with a round add button. | Completed, loading, all done. |
| Heat month | Count badge on busy days or accent heat by count; the selected day is a solid ink tile. | Quiet month, loading. |
| Money calendar | Total and Upcoming, filter chips (All, Bill, Subscription, Debt), a neutral glyph per payment, +N when more. | Day with a payment, nothing due ("No payments due. Tap another day."). |

## 9. Engineering

### 9.1 Layers and entries

- `core`: headless and pure. Date math on a Temporal-shaped API, recurrence expansion, overlap layout, lane packing for bars, DST and zone handling, the keyboard grid model, the quick-add parser (separate entry). No React, no DOM.
- Views: one entry each. `week`, `day`, `month`, `year`, `agenda`, `resources`.
- Family: `picker`, `range-picker`, `week-strip`, `compact-month`, `heat-month`, `desk`, `widgets/*`, `task-agenda`, `money`. They import `core`, never a view.
- Package proposal: `@cutecode/calendar` with subpath `exports`, `sideEffects: false` except CSS. Apps import leaf entries only.

### 9.2 Budgets (gzip, targets checked in CI with size-limit or similar)

| Entry | Budget |
|---|---|
| core | 6 kB |
| week or day | 14 kB |
| month | 9 kB |
| agenda, virtualized | 8 kB |
| year | 5 kB |
| picker or range-picker | 6 kB |
| each widget | 3 kB |
| quick-add parser | 4 kB, loaded on focus |

No heavy dependencies: no moment, no date-fns locale bundles, no drag library. Base UI for overlays, Solar icons one import per icon.

### 9.3 Rendering

- Layout once per visible range: `layoutRange(events, range, options)` is pure and memoized on (events version, range, zone, hidden calendars). It returns positioned boxes. It can move to a Web Worker later without changing views.
- CSS first: grid for days and lanes, container queries for density (phone, tablet, desktop from the calendar's own width), logical properties for RTL, custom properties for hour height.
- Drag touches one element: `translate` while moving, no reflow of other events, no React render per frame. Commit on drop, then lay out once.
- Agenda and year virtualize past one screen. Month renders 6 rows at most.
- Long lists use `content-visibility: auto` where it helps.

### 9.4 Platform features and fallbacks

Support is not claimed here; each is feature-detected and has a fallback. Check current support before dropping any fallback.

| Feature | Use | Fallback |
|---|---|---|
| Temporal (`PlainDate`, `PlainDateTime`, `ZonedDateTime`, `Duration`) | All date math inside `core`. | Needs a fallback: a small polyfill or our own math behind the same `core` API. |
| `Intl.DateTimeFormat` with `timeZone` | Every label and zone name. | None planned; test every zone we show. |
| `Intl.Locale` week info | First day of week and weekend. | Needs a fallback table by region. |
| View Transitions (`document.startViewTransition`) | View switches. | Swap plus opacity fade. Skipped under Reduce Motion. |
| `popover` attribute | Light dismiss and top layer for event popovers. | Base UI Popover stays the baseline for focus and dismiss. |
| CSS anchor positioning | Placing popovers on slots. | Inside `@supports`; otherwise Base UI positioner math. |
| Container queries | View density. | Required by the design system already. |

### 9.5 React 19

- Views render a server-friendly shell (grid, labels, events) from props; no client state needed to paint.
- Client islands only where there is interaction: drag layer, popover, keyboard handler, quick add.
- Data in the app: SWR for events, writes `mutate` the range keys they change. Form state in react-hook-form with zod. Shared UI state (view, focused slot, hidden calendars) in jotai atoms; view choice can live in a cookie so the server renders the right view.
- No `useEffect` for layout; `useSyncExternalStore` for the now line clock (one minute ticks, paused when hidden).

### 9.6 Accessibility from the start

Roles, names, live region, roving focus and keyboard drag ship in phase 1, not later. Each phase adds its own announcements and tests.

## 10. API sketch (proposal, not a shipped API)

```tsx
import { Calendar } from "@cutecode/calendar/week";

<Calendar
  events={events}
  view="week"
  timeZone="America/Los_Angeles"
  secondaryTimeZone="Europe/London"
  workingHours={{ start: "09:00", end: "17:00" }}
  onEventChange={(change) => save(change)}
  onEventCreate={(draft) => create(draft)}
/>
```

`onEventChange` receives an `EventChange`. For repeating events the calendar asks for the scope first, then calls once. `onEventCreate` receives a draft with start, end, calendar and any quick-add fields.

## 11. Phased build plan

1. **Core views.** `core` date math and layout, week, day, month, agenda, year, sidebar, popover read-only, keyboard grid model, roles and live region, empty, loading and error states, light and dark, phone day view with strip and Drawer. Done when: budgets pass, axe has no violations, every frame in chapters A, D and E matches.
2. **Drag and resize.** Pointer drag with snap, across days, resize grip, refused drops, read-only hints, keyboard drag, long-press and edge auto-scroll on touch, quick event popover create and edit, undo. Done when: drag never reflows other events, all announcements fire, 44pt targets on phone.
3. **Recurrence and time zones.** RRULE subset expansion, exceptions, the three-way edit dialog and Drawer, second zone column, mismatch banner, DST days, midnight crossing, 12 or 24 hour and week start from locale. Done when: DST and recurrence test tables pass for at least 10 zones.
4. **Resources and natural language.** Resource day view, bookable hours, rebooking across columns, quick-add parser with chips, offline queue and sync conflict, RTL pass. Then the variants family on top of `core`.
