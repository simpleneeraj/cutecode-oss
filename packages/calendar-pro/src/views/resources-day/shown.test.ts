import { makeResource } from "@cutecode/calendar/testing";
import { ResourceKind } from "@cutecode/calendar/types";
import { describe, expect, it } from "vitest";

import { pickerLabelOf, selectedResourceOf, shownResources } from "./shown";

const atlas = makeResource({ id: "atlas", name: "Atlas" });
const cove = makeResource({ id: "cove", name: "Cove" });
const sam = makeResource({ id: "sam", name: "Sam", kind: ResourceKind.Person });

describe("selectedResourceOf", () => {
  it("finds the picked resource", () => {
    expect(selectedResourceOf([atlas, cove], "cove")).toBe(cove);
  });

  it("falls back to the first resource when the pick is gone", () => {
    expect(selectedResourceOf([atlas, cove], "missing")).toBe(atlas);
    expect(selectedResourceOf([atlas, cove], null)).toBe(atlas);
  });

  it("returns null without resources", () => {
    expect(selectedResourceOf([], "atlas")).toBeNull();
  });
});

describe("shownResources", () => {
  it("shows every resource on wide screens", () => {
    expect(shownResources([atlas, cove], cove, false)).toEqual([atlas, cove]);
  });

  it("shows one resource at a time on phone", () => {
    expect(shownResources([atlas, cove], cove, true)).toEqual([cove]);
  });

  it("shows nothing extra without a pick", () => {
    expect(shownResources([], null, true)).toEqual([]);
  });
});

describe("pickerLabelOf", () => {
  it("names a single kind", () => {
    expect(pickerLabelOf([atlas, cove])).toBe("Rooms");
    expect(pickerLabelOf([sam])).toBe("People");
  });

  it("falls back for mixed kinds or none", () => {
    expect(pickerLabelOf([atlas, sam])).toBe("Resources");
    expect(pickerLabelOf([])).toBe("Resources");
  });
});
