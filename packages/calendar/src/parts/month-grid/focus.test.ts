import { describe, expect, it } from "vitest";
import { KeyCommand } from "../../types";
import { dateForKey, daySlot, dayKey, moveMonthFocus, startingDate } from "./focus";

describe("moveMonthFocus", () => {
  const focus = daySlot("2026-11-18");

  it("steps a day sideways and a week up or down", () => {
    expect(moveMonthFocus(focus, KeyCommand.NextDay).date).toBe("2026-11-19");
    expect(moveMonthFocus(focus, KeyCommand.PreviousDay).date).toBe("2026-11-17");
    expect(moveMonthFocus(focus, KeyCommand.NextHour).date).toBe("2026-11-25");
    expect(moveMonthFocus(focus, KeyCommand.PreviousHour).date).toBe("2026-11-11");
    expect(moveMonthFocus(focus, KeyCommand.NextWeek).date).toBe("2026-11-25");
  });

  it("crosses into the next month", () => {
    expect(moveMonthFocus(daySlot("2026-11-30"), KeyCommand.NextDay).date).toBe("2026-12-01");
  });

  it("keeps focus for other commands", () => {
    expect(moveMonthFocus(focus, KeyCommand.Today)).toBe(focus);
  });
});

describe("month focus keys", () => {
  const dates = ["2026-11-01", "2026-11-02"];

  it("finds the date behind a key", () => {
    expect(dateForKey(dayKey("2026-11-02"), dates)).toBe("2026-11-02");
    expect(dateForKey(dayKey("2026-12-02"), dates)).toBeUndefined();
  });

  it("starts on the selected day when it is shown", () => {
    expect(startingDate(dates, "2026-11-02", "2026-11-01")).toBe("2026-11-02");
    expect(startingDate(dates, "2026-12-09", "2026-11-01")).toBe("2026-11-01");
  });
});
