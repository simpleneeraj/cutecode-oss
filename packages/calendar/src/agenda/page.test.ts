import { describe, expect, it } from "vitest";
import { agendaPage } from ".";

describe("agendaPage", () => {
  it("starts the first page at the anchor", () => {
    expect(agendaPage("2026-11-18", 0, 7)).toEqual({ start: "2026-11-18", end: "2026-11-25" });
  });

  it("pages forward and backward without gaps or overlap", () => {
    const pages = [-2, -1, 0, 1, 2].map((direction) => agendaPage("2026-11-18", direction, 14));
    for (const [index, page] of pages.entries()) {
      const next = pages[index + 1];
      if (next) {
        expect(next.start).toBe(page.end);
      }
    }
    expect(pages[0]?.start).toBe("2026-10-21");
    expect(pages[4]?.end).toBe("2026-12-30");
  });

  it("crosses month, year and leap day edges", () => {
    expect(agendaPage("2026-12-28", 1, 7)).toEqual({ start: "2027-01-04", end: "2027-01-11" });
    expect(agendaPage("2028-02-26", 0, 5)).toEqual({ start: "2028-02-26", end: "2028-03-02" });
  });

  it("ignores DST because pages are calendar days", () => {
    expect(agendaPage("2026-11-01", -1, 1)).toEqual({ start: "2026-10-31", end: "2026-11-01" });
    expect(agendaPage("2026-03-08", 0, 1)).toEqual({ start: "2026-03-08", end: "2026-03-09" });
  });

  it.each([0, -3, 1.5, Number.NaN, Number.POSITIVE_INFINITY])("throws on page size %s", (size) => {
    expect(() => agendaPage("2026-11-18", 0, size)).toThrow(RangeError);
  });

  it.each([0.5, Number.NaN])("throws on page direction %s", (direction) => {
    expect(() => agendaPage("2026-11-18", direction, 7)).toThrow(RangeError);
  });
});
