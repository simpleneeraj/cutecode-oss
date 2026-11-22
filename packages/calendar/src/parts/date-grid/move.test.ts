import { describe, expect, it } from "vitest";
import { KeyCommand } from "../../types";
import { daySlot } from "../month-grid/focus";
import { moveWithin } from "./move";

const week = ["2026-11-15", "2026-11-16", "2026-11-17", "2026-11-18", "2026-11-19", "2026-11-20", "2026-11-21"];

describe("moveWithin", () => {
  it("steps a day inside the shown dates", () => {
    expect(moveWithin(daySlot("2026-11-18"), KeyCommand.NextDay, week).date).toBe("2026-11-19");
    expect(moveWithin(daySlot("2026-11-18"), KeyCommand.PreviousDay, week).date).toBe("2026-11-17");
  });

  it("stays put when the step leaves the shown dates", () => {
    expect(moveWithin(daySlot("2026-11-21"), KeyCommand.NextDay, week).date).toBe("2026-11-21");
    expect(moveWithin(daySlot("2026-11-18"), KeyCommand.NextHour, week).date).toBe("2026-11-18");
  });
});
