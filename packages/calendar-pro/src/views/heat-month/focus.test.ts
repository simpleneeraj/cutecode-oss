import { KeyCommand } from "@cutecode/calendar/types";
import { describe, expect, it } from "vitest";

import { moveInMonth, tabStopOf, tileFocus } from "./focus";

const november = Array.from({ length: 30 }, (_, index) => `2026-11-${String(index + 1).padStart(2, "0")}`);

describe("moveInMonth", () => {
  it("steps by day and by week", () => {
    expect(moveInMonth(tileFocus("2026-11-18"), KeyCommand.NextDay, november).date).toBe("2026-11-19");
    expect(moveInMonth(tileFocus("2026-11-18"), KeyCommand.PreviousHour, november).date).toBe("2026-11-11");
  });

  it("stays inside the month", () => {
    expect(moveInMonth(tileFocus("2026-11-30"), KeyCommand.NextDay, november).date).toBe("2026-11-30");
    expect(moveInMonth(tileFocus("2026-11-02"), KeyCommand.PreviousWeek, november).date).toBe("2026-11-02");
  });

  it("ignores keys that do not move", () => {
    expect(moveInMonth(tileFocus("2026-11-18"), KeyCommand.Today, november).date).toBe("2026-11-18");
  });
});

describe("tabStopOf", () => {
  it("falls back to the selected day after a month change", () => {
    expect(tabStopOf("2026-10-30", "2026-11-18", november)).toBe("2026-11-18");
    expect(tabStopOf("2026-11-04", "2026-11-18", november)).toBe("2026-11-04");
  });
});
