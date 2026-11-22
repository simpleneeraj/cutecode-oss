import { describe, expect, it } from "vitest";
import { makeSettings } from "../../testing";
import { viewRange } from "../../range";
import { ViewKind } from "../../types";
import { rangeHeading } from "./heading";

const settings = makeSettings();

describe("rangeHeading", () => {
  it("names the month and the days of a week", () => {
    const heading = rangeHeading(viewRange(ViewKind.Week, "2026-11-18", settings), settings);
    expect(heading.title).toBe("November 2026");
    expect(heading.subtitle.replace(/\s/g, " ")).toBe("Nov 15 – 21");
  });

  it("spans two months when the week does", () => {
    const heading = rangeHeading(viewRange(ViewKind.Week, "2026-12-01", settings), settings);
    expect(heading.title.replace(/\s/g, " ")).toBe("Nov – Dec 2026");
  });

  it("names the date and weekday of a day", () => {
    const heading = rangeHeading(viewRange(ViewKind.Day, "2026-11-18", settings), settings);
    expect(heading).toEqual({ title: "November 18, 2026", subtitle: "Wednesday" });
  });
});
