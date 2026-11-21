import { describe, expect, it } from "vitest";
import { ViewKind } from "../types";
import { navigate } from "./navigate";

describe("navigate", () => {
  it("moves the day view one day", () => {
    expect(navigate(ViewKind.Day, "2026-12-31", 1)).toBe("2027-01-01");
    expect(navigate(ViewKind.Day, "2027-01-01", -1)).toBe("2026-12-31");
  });

  it("moves the week view seven days", () => {
    expect(navigate(ViewKind.Week, "2026-12-28", 1)).toBe("2027-01-04");
    expect(navigate(ViewKind.Week, "2026-11-18", -2)).toBe("2026-11-04");
  });

  it("clamps month moves to the last day of the month", () => {
    expect(navigate(ViewKind.Month, "2026-01-31", 1)).toBe("2026-02-28");
    expect(navigate(ViewKind.Month, "2028-01-31", 1)).toBe("2028-02-29");
    expect(navigate(ViewKind.Month, "2026-03-31", -1)).toBe("2026-02-28");
  });

  it("crosses the year boundary by month", () => {
    expect(navigate(ViewKind.Month, "2026-12-15", 1)).toBe("2027-01-15");
    expect(navigate(ViewKind.Month, "2027-01-15", -1)).toBe("2026-12-15");
  });

  it("moves the year view and clamps a leap day", () => {
    expect(navigate(ViewKind.Year, "2026-11-18", 1)).toBe("2027-11-18");
    expect(navigate(ViewKind.Year, "2028-02-29", 1)).toBe("2029-02-28");
    expect(navigate(ViewKind.Year, "2028-02-29", -4)).toBe("2024-02-29");
  });

  it("moves the agenda thirty days", () => {
    expect(navigate(ViewKind.Agenda, "2026-12-15", 1)).toBe("2027-01-14");
    expect(navigate(ViewKind.Agenda, "2026-12-15", -1)).toBe("2026-11-15");
  });

  it("stays put on a zero step", () => {
    Object.values(ViewKind).forEach((kind) => expect(navigate(kind, "2026-11-18", 0)).toBe("2026-11-18"));
  });

  it("is unaffected by a DST day", () => {
    expect(navigate(ViewKind.Day, "2026-03-08", 1)).toBe("2026-03-09");
    expect(navigate(ViewKind.Week, "2026-11-01", 1)).toBe("2026-11-08");
  });
});
