import { describe, expect, it } from "vitest";
import { hiddenCalendarIdsOf, occurrenceOf, visibleEvents } from "../event";
import { makeCalendar, makeEvent } from "../testing";
import { visibleOccurrences } from "./visible";

describe("calendar visibility", () => {
  const calendars = [makeCalendar(), makeCalendar({ id: "family", visible: false })];
  const events = [
    makeEvent({ id: "work" }),
    makeEvent({ id: "family", calendarId: "family" }),
    makeEvent({ id: "unlisted", calendarId: "unlisted" }),
  ];

  it("hides the same events before and after expansion", () => {
    const shownEvents = visibleEvents(events, calendars).map((event) => event.id);
    const shownOccurrences = visibleOccurrences(events.map(occurrenceOf), hiddenCalendarIdsOf(calendars)).map(
      (occurrence) => occurrence.event.id,
    );
    expect(shownEvents).toEqual(["work", "unlisted"]);
    expect(shownOccurrences).toEqual(shownEvents);
  });
});
