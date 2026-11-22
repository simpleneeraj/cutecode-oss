import { describe, expect, it } from "vitest";
import { occurrenceOf } from "../../event";
import { instantAt, makeAllDayEvent, makeCalendar, makeEvent, makeSettings } from "../../testing";
import { groupCalendars, occurrenceWhen, resultWhen, searchEvents, upNextSummary } from "./model";

const settings = makeSettings();

const events = [
  makeEvent({ id: "crit", title: "Design crit", location: "Atlas" }),
  makeEvent({
    id: "sync",
    title: "Roadmap sync",
    start: "2026-11-17T13:00:00-08:00",
    end: "2026-11-17T14:00:00-08:00",
  }),
  makeEvent({ id: "pickup", title: "School pickup", calendarId: "family", notes: "Bring the design kit" }),
];

const searchNow = instantAt("2026-11-01", "09:00");

describe("searchEvents", () => {
  it("matches title, place and notes in start order", () => {
    const found = searchEvents({ events, hiddenCalendarIds: [], query: " DESIGN ", now: searchNow }, settings);
    expect(found.map((occurrence) => occurrence.event.id)).toEqual(["crit", "pickup"]);
    expect(searchEvents({ events, hiddenCalendarIds: [], query: "atlas", now: searchNow }, settings)).toHaveLength(1);
  });

  it("skips hidden calendars, empty queries and an unknown clock", () => {
    expect(
      searchEvents({ events, hiddenCalendarIds: ["family"], query: "design", now: searchNow }, settings),
    ).toHaveLength(1);
    expect(searchEvents({ events, hiddenCalendarIds: [], query: "  ", now: searchNow }, settings)).toEqual([]);
    expect(searchEvents({ events, hiddenCalendarIds: [], query: "design", now: null }, settings)).toEqual([]);
  });

  it("puts the next match first and past matches after, latest first", () => {
    const past = makeEvent({
      id: "old",
      title: "Design review",
      start: "2026-06-01T09:00:00-07:00",
      end: "2026-06-01T10:00:00-07:00",
    });
    const later = makeEvent({
      id: "later",
      title: "Design review",
      start: "2026-08-01T09:00:00-07:00",
      end: "2026-08-01T10:00:00-07:00",
    });
    const found = searchEvents(
      {
        events: [past, later, ...events],
        hiddenCalendarIds: [],
        query: "design",
        now: instantAt("2026-11-18", "09:00"),
      },
      settings,
    );
    expect(found.map((occurrence) => occurrence.event.id)).toEqual(["crit", "pickup", "later", "old"]);
  });
});

describe("groupCalendars", () => {
  it("puts read-only and shared calendars under Other", () => {
    const calendars = [
      makeCalendar(),
      makeCalendar({ id: "team", name: "Team" }),
      makeCalendar({ id: "holidays", name: "US holidays", readOnly: true }),
    ];
    const groups = groupCalendars(calendars, ["team"]);
    expect(groups.mine.map((calendar) => calendar.id)).toEqual(["work"]);
    expect(groups.other.map((calendar) => calendar.id)).toEqual(["team", "holidays"]);
  });
});

describe("upNextSummary", () => {
  const crit = occurrenceOf(events[0] ?? makeEvent());

  it("says how soon and where", () => {
    expect(upNextSummary(crit, instantAt("2026-11-18", "09:40"), settings)).toEqual({
      title: "Next: Design crit",
      detail: "In 20 minutes, Atlas",
    });
  });

  it("says now, a later time today, or the day", () => {
    expect(occurrenceWhen(crit, instantAt("2026-11-18", "10:15"), settings)).toBe("Now");
    expect(occurrenceWhen(crit, instantAt("2026-11-18", "07:00"), settings)).toBe("10 AM");
    expect(occurrenceWhen(crit, instantAt("2026-11-17", "07:00"), settings)).toBe("Wed, 10 AM");
    const trip = occurrenceOf(makeAllDayEvent("2026-11-20", "2026-11-22"));
    expect(occurrenceWhen(trip, instantAt("2026-11-18", "07:00"), settings)).toBe("Fri, all day");
  });
});

describe("resultWhen", () => {
  it("dates each result", () => {
    expect(resultWhen(occurrenceOf(makeEvent()), settings)).toBe("Wed, Nov 18, 10 AM");
    expect(resultWhen(occurrenceOf(makeAllDayEvent("2026-11-20", "2026-11-22")), settings)).toBe(
      "Fri, Nov 20, all day",
    );
  });
});
