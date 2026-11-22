import { describe, expect, it } from "vitest";

import { SelectionMode, type RangeSelection } from "../../picker";
import { makeSettings } from "../../testing";
import { rangePickerCopy, rangeSummary } from "./model";

const settings = makeSettings();

function range(start: string | null, end: string | null): RangeSelection {
  return { mode: SelectionMode.Range, start, end };
}

describe("rangeSummary", () => {
  it("asks for a start, then an end", () => {
    expect(rangeSummary(range(null, null), {}, settings)).toEqual({
      text: rangePickerCopy.pickStart,
      isInvalid: false,
      canConfirm: false,
    });
    expect(rangeSummary(range("2026-11-20", null), {}, settings).text).toBe("Nov 20. Pick an end date.");
  });

  it("counts nights with an exclusive end", () => {
    const summary = rangeSummary(range("2026-11-20", "2026-11-28"), {}, settings);
    expect(summary).toEqual({ text: "Nov 20 to Nov 27, 7 nights", isInvalid: false, canConfirm: true });
    expect(rangeSummary(range("2026-11-20", "2026-11-22"), {}, settings).text).toBe("Nov 20 to Nov 21, 1 night");
  });

  it("names a one day range", () => {
    expect(rangeSummary(range("2026-11-20", "2026-11-21"), {}, settings).text).toBe("Nov 20, one day");
  });

  it("refuses an end before the start", () => {
    const summary = rangeSummary(range("2026-11-27", "2026-11-20"), {}, settings);
    expect(summary).toEqual({ text: rangePickerCopy.endBeforeStart, isInvalid: true, canConfirm: false });
  });

  it("refuses a range over disabled dates", () => {
    const summary = rangeSummary(range("2026-11-20", "2026-11-28"), { disabledDates: ["2026-11-26"] }, settings);
    expect(summary).toEqual({ text: rangePickerCopy.unavailable, isInvalid: true, canConfirm: false });
  });
});
