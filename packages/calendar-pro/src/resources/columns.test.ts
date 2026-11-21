import { describe, expect, it } from "vitest";
import { makeOccurrence, makeResource } from "@cutecode/calendar/testing";
import { occurrencesForResource, resourceColumns } from "./columns";

const roomA = makeResource();
const sam = makeResource({ id: "sam", name: "Sam" });

describe("resourceColumns", () => {
  it("puts dates outside and resources inside", () => {
    expect(resourceColumns([roomA, sam])(["2026-11-18", "2026-11-19"])).toEqual([
      { key: "2026-11-18:room-a", date: "2026-11-18", resourceId: "room-a" },
      { key: "2026-11-18:sam", date: "2026-11-18", resourceId: "sam" },
      { key: "2026-11-19:room-a", date: "2026-11-19", resourceId: "room-a" },
      { key: "2026-11-19:sam", date: "2026-11-19", resourceId: "sam" },
    ]);
  });

  it("gives unique keys", () => {
    const columns = resourceColumns([roomA, sam])(["2026-11-18", "2026-11-19", "2026-11-20"]);
    expect(new Set(columns.map((column) => column.key)).size).toBe(6);
  });

  it("falls back to one column per date without resources", () => {
    expect(resourceColumns([])(["2026-11-18"])).toEqual([{ key: "2026-11-18", date: "2026-11-18" }]);
  });

  it("gives no columns for no dates", () => {
    expect(resourceColumns([roomA])([])).toEqual([]);
  });
});

describe("occurrencesForResource", () => {
  const inRoom = makeOccurrence({ id: "in-room", resourceIds: ["room-a"] });
  const withSam = makeOccurrence({ id: "with-sam", resourceIds: ["sam", "room-a"] });
  const unbooked = makeOccurrence({ id: "unbooked" });

  it("keeps occurrences booked on the resource", () => {
    const keys = occurrencesForResource([inRoom, withSam, unbooked], "room-a").map((occurrence) => occurrence.event.id);
    expect(keys).toEqual(["in-room", "with-sam"]);
  });

  it("returns nothing for an unknown resource", () => {
    expect(occurrencesForResource([inRoom, withSam, unbooked], "room-b")).toEqual([]);
  });
});
