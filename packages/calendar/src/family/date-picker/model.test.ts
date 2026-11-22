import { describe, expect, it } from "vitest";

import { SelectionMode } from "../../picker";
import { makeSettings } from "../../testing";
import { datePickerCopy, singleSummary } from "./model";

const settings = makeSettings();

describe("singleSummary", () => {
  it("asks for a date when none is picked", () => {
    const summary = singleSummary({ mode: SelectionMode.Single, date: null }, {}, settings);
    expect(summary).toEqual({ text: datePickerCopy.pickDate, isInvalid: false, canConfirm: false });
  });

  it("names the picked date and allows confirm", () => {
    const summary = singleSummary({ mode: SelectionMode.Single, date: "2026-11-24" }, {}, settings);
    expect(summary).toEqual({ text: "Tue, Nov 24", isInvalid: false, canConfirm: true });
  });

  it("refuses a disabled date", () => {
    const summary = singleSummary({ mode: SelectionMode.Single, date: "2026-11-24" }, { min: "2026-11-25" }, settings);
    expect(summary).toEqual({ text: datePickerCopy.unavailable, isInvalid: true, canConfirm: false });
  });
});
