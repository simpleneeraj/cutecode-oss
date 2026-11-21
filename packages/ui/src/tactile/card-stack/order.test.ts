import { describe, expect, it } from "vitest";

import { bringBackToTop, bringToTop, moveStack, StackMove, sendTopToBack, syncStackOrder } from "./order";

const order = ["backend", "design", "frontend"];

describe("sendTopToBack", () => {
  it("moves the top card under the rest", () => {
    expect(sendTopToBack(order)).toEqual(["frontend", "backend", "design"]);
  });

  it("returns to the start after a full cycle", () => {
    expect(sendTopToBack(sendTopToBack(sendTopToBack(order)))).toEqual(order);
  });

  it("leaves an empty stack alone", () => {
    expect(sendTopToBack([])).toEqual([]);
  });
});

describe("bringBackToTop", () => {
  it("lifts the bottom card onto the top", () => {
    expect(bringBackToTop(order)).toEqual(["design", "frontend", "backend"]);
  });

  it("undoes sendTopToBack", () => {
    expect(bringBackToTop(sendTopToBack(order))).toEqual(order);
  });
});

describe("bringToTop", () => {
  it("moves one card to the top and keeps the others in place", () => {
    expect(bringToTop(order, "backend")).toEqual(["design", "frontend", "backend"]);
  });

  it("ignores unknown ids", () => {
    expect(bringToTop(order, "missing")).toEqual(order);
  });
});

describe("moveStack", () => {
  it("maps next and previous to the cycle", () => {
    expect(moveStack(order, StackMove.Next)).toEqual(sendTopToBack(order));
    expect(moveStack(order, StackMove.Previous)).toEqual(bringBackToTop(order));
  });
});

describe("syncStackOrder", () => {
  it("keeps the current order for known cards", () => {
    expect(syncStackOrder(["frontend", "backend", "design"], order)).toEqual(["frontend", "backend", "design"]);
  });

  it("drops removed cards and slips new ones under the stack", () => {
    expect(syncStackOrder(["frontend", "backend", "design"], ["design", "frontend", "notes"])).toEqual([
      "notes",
      "frontend",
      "design",
    ]);
  });
});
