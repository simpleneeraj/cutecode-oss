import { describe, expect, it } from "vitest";

import { defaultDragSettings, nudgeIntent, proposeDrop } from "../../drag";
import { instantAt, makeOccurrence, testZones } from "../../testing";
import { KeyCommand } from "../../types";
import { monthMoveIntent } from "./month-intent";

const zone = testZones.losAngeles;

const offGrid = makeOccurrence({ start: "2026-11-18T10:10:00-08:00", end: "2026-11-18T11:10:00-08:00" });

describe("monthMoveIntent", () => {
  it("keeps the time of day when a chip moves to another day", () => {
    const proposal = proposeDrop(monthMoveIntent(offGrid, "2026-11-18", "2026-11-20", zone), defaultDragSettings, zone);
    expect(proposal.start).toBe(instantAt("2026-11-20", "10:10"));
    expect(proposal.end).toBe(instantAt("2026-11-20", "11:10"));
  });

  it("moves a week when nudged up or down", () => {
    const intent = nudgeIntent(monthMoveIntent(offGrid, "2026-11-18", "2026-11-18", zone), KeyCommand.NextHour, defaultDragSettings, zone);
    expect(proposeDrop(intent, defaultDragSettings, zone).start).toBe(instantAt("2026-11-25", "10:10"));
  });
});
