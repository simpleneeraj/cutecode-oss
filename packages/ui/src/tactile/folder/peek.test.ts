import { describe, expect, it } from "vitest";

import { closedPeek, isFolderOpen, mergePeek, tapPeek } from "./peek";

describe("isFolderOpen", () => {
  it("is closed when nothing holds it open", () => {
    expect(isFolderOpen(closedPeek)).toBe(false);
  });

  it("opens for hover or a tap", () => {
    expect(isFolderOpen({ ...closedPeek, isHovered: true })).toBe(true);
    expect(isFolderOpen({ ...closedPeek, isTapped: true })).toBe(true);
  });
});

describe("mergePeek", () => {
  it("keeps the same object when nothing changes", () => {
    expect(mergePeek(closedPeek, { isTapped: false })).toBe(closedPeek);
    expect(mergePeek(closedPeek, {})).toBe(closedPeek);
  });

  it("returns a new peek when a field changes", () => {
    expect(mergePeek(closedPeek, { isHovered: true })).toEqual({ isHovered: true, isTapped: false });
  });
});

describe("tapPeek", () => {
  it("peeks on the first tap", () => {
    expect(tapPeek(closedPeek)).toEqual({ isHovered: false, isTapped: true });
  });

  it("closes on the second tap", () => {
    expect(tapPeek({ isHovered: false, isTapped: true })).toEqual(closedPeek);
  });

  it("leaves an open hovered folder as it is", () => {
    const hovered = { isHovered: true, isTapped: false };
    expect(tapPeek(hovered)).toBe(hovered);
  });
});
