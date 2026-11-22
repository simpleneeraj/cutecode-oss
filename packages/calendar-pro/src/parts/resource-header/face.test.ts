import { makeResource } from "@cutecode/calendar/testing";
import { ResourceKind } from "@cutecode/calendar/types";
import { describe, expect, it } from "vitest";

import { detailOf, faceOf, headerLabel, initialsOf, ResourceFace } from "./face";

describe("faceOf", () => {
  it("draws rooms and equipment as glyphs and people as initials", () => {
    expect(faceOf(makeResource())).toBe(ResourceFace.Room);
    expect(faceOf(makeResource({ kind: ResourceKind.Equipment }))).toBe(ResourceFace.Equipment);
    expect(faceOf(makeResource({ kind: ResourceKind.Person }))).toBe(ResourceFace.Initials);
  });
});

describe("initialsOf", () => {
  it.each([
    ["Sam Rivera", "SR"],
    ["sam", "S"],
    ["  Ana  María de la Cruz ", "AC"],
    ["", ""],
  ])("turns %s into %s", (name, initials) => {
    expect(initialsOf(name)).toBe(initials);
  });
});

describe("detailOf", () => {
  it("prefers the written detail", () => {
    expect(detailOf(makeResource({ detail: "Phone booth" }))).toBe("Phone booth");
  });

  it("falls back to seats", () => {
    expect(detailOf(makeResource({ capacity: 8 }))).toBe("8 seats");
    expect(detailOf(makeResource({ capacity: 1 }))).toBe("1 seat");
  });

  it("returns null with nothing to say", () => {
    expect(detailOf(makeResource({ capacity: undefined }))).toBeNull();
  });
});

describe("headerLabel", () => {
  it("names the resource and its detail", () => {
    expect(headerLabel(makeResource())).toBe("Room A, 8 seats");
    expect(headerLabel(makeResource({ capacity: undefined }))).toBe("Room A");
  });
});
