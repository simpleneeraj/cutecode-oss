import { describe, expect, it } from "vitest";
import { occurrencesInRange } from "../../event";
import { createLayoutRange } from "../../layout";
import { resolveSettings } from "../../locale";
import { viewRange } from "../../range";
import { makeAllDayEvent, makeEvent, makeResource } from "../../testing";
import { FocusTarget, ViewKind, type ColumnSource, type Resource, type SlotFocus } from "../../types";
import { slotKey } from "../roving-focus/focus-key";
import { exampleCalendars, exampleDate, exampleOptions } from "./example-data";
import { columnOfFocus, focusForKey, focusGridOf, startingFocus } from "./focus";
import { buildGridModel } from "./model";

const settings = resolveSettings(exampleOptions);

const resources: Resource[] = [
  makeResource({ id: "atlas", name: "Atlas", bookableHours: { start: "07:00", end: "19:00" } }),
  makeResource({ id: "lab", name: "Lab", bookableHours: { start: "22:00", end: "06:00" } }),
  makeResource({ id: "open", name: "Open" }),
];

const byResource: ColumnSource = (dates) =>
  dates.flatMap((date) => resources.map((resource) => ({ key: `${date}:${resource.id}`, date, resourceId: resource.id })));

const events = [
  makeEvent({ id: "crit", resourceIds: ["atlas"] }),
  makeEvent({ id: "loose" }),
  makeAllDayEvent(exampleDate, "2026-11-19", { id: "offsite", resourceIds: ["atlas", "open"] }),
  makeAllDayEvent(exampleDate, "2026-11-19", { id: "unbooked" }),
];

function resourceModel() {
  const range = viewRange(ViewKind.Day, exampleDate, settings);
  const occurrences = occurrencesInRange(events, { range: range.instants, dates: range.dates, timeZone: settings.timeZone });
  const layoutOptions = { maxColumns: 4, minimumMinutes: 17, hiddenCalendarIds: [], columns: byResource };
  const layout = createLayoutRange()(occurrences, range, layoutOptions);
  const options = { ...exampleOptions, shownHours: undefined };
  const input = { range, settings, layout, occurrences, options, calendars: exampleCalendars, resources };
  return buildGridModel({ ...input, selected: exampleDate, now: null, open: { earlier: false, later: false } });
}

const model = resourceModel();

describe("resource columns on the time grid", () => {
  it("gives each resource its own column and focus key", () => {
    expect(model.columns.map((column) => column.focusKey)).toEqual(["atlas", "lab", "open"]);
    expect(model.columns.map((column) => column.resource?.name)).toEqual(["Atlas", "Lab", "Open"]);
  });

  it("only books events into their resource", () => {
    expect(model.columns.map((column) => column.column.boxes.length)).toEqual([1, 0, 0]);
  });

  it("shades outside bookable hours instead of working hours", () => {
    expect(model.columns[0]?.offHours).toEqual([
      { top: 0, height: 7 },
      { top: 19, height: 5 },
    ]);
    expect(model.columns[1]?.offHours).toEqual([{ top: 6, height: 16 }]);
    expect(model.columns[2]?.offHours).toEqual([]);
  });

  it("lays all-day bars only into the resources they book", () => {
    expect(model.bars.map((bar) => [bar.key, bar.startIndex, bar.length])).toEqual([
      [expect.stringContaining("offsite"), 0, 1],
      [expect.stringContaining("offsite"), 2, 1],
    ]);
  });

  it("moves keyboard focus across resources", () => {
    const grid = focusGridOf(model);
    expect(grid.dates).toEqual([exampleDate]);
    expect(grid.columnKeys).toEqual(["atlas", "lab", "open"]);
    expect(startingFocus(model, null).columnKey).toBe("atlas");
  });

  it("finds the column of a focused slot", () => {
    const focus: SlotFocus = { target: FocusTarget.Slot, date: exampleDate, minute: 600, columnKey: "lab" };
    expect(columnOfFocus(focus, model)?.focusKey).toBe("lab");
    expect(focusForKey(slotKey(exampleDate, "open"), model, focus)).toMatchObject({ columnKey: "open" });
  });
});
