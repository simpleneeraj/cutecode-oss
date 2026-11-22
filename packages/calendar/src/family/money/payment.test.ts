import { describe, expect, it } from "vitest";
import { makeSettings } from "../../testing";
import { Frequency } from "../../types";
import {
  dayPaymentsLabel,
  formatAmount,
  monthTotals,
  paymentDetail,
  PaymentFilter,
  PaymentGlyph,
  PaymentKind,
  paymentsByDate,
  paymentsInMonth,
  paymentsShown,
  type Payment,
} from "./payment";

function payment(id: string, date: string, amountCents: number, kind = PaymentKind.Bill): Payment {
  return { id, title: id, date, amountCents, kind, glyph: PaymentGlyph.Bills };
}

const payments = [
  payment("rent", "2026-11-01", 120000),
  payment("gym", "2026-11-20", 3900, PaymentKind.Subscription),
  payment("card", "2026-11-30", 25010, PaymentKind.Debt),
  payment("phone", "2026-11-30", 4500),
  payment("next", "2026-12-01", 120000),
];

describe("paymentsShown", () => {
  it("keeps every kind under All and one kind otherwise", () => {
    expect(paymentsShown(payments, PaymentFilter.All)).toHaveLength(5);
    expect(paymentsShown(payments, PaymentFilter.Debt).map((item) => item.id)).toEqual(["card"]);
  });
});

describe("paymentsByDate", () => {
  it("groups several payments on one day in order", () => {
    expect(
      paymentsByDate(payments)
        .get("2026-11-30")
        ?.map((item) => item.id),
    ).toEqual(["card", "phone"]);
  });
});

describe("monthTotals", () => {
  it("sums the month and what is still ahead of today", () => {
    expect(monthTotals(payments, "2026-11-18", "2026-11-18")).toEqual({ totalCents: 153410, upcomingCents: 33410 });
  });

  it("counts a payment due today as upcoming", () => {
    expect(monthTotals(payments, "2026-11-01", "2026-11-30").upcomingCents).toBe(29510);
  });

  it("is zero for a month with nothing due", () => {
    expect(monthTotals(payments, "2027-01-01", "2026-11-18")).toEqual({ totalCents: 0, upcomingCents: 0 });
  });
});

describe("payment text", () => {
  it("formats money in the locale", () => {
    expect(formatAmount(157169, makeSettings(), "USD")).toBe("$1,571.69");
    expect(formatAmount(3900, makeSettings({ locale: "de-DE" }), "EUR")).toMatch(/^39,00\s€$/);
  });

  it("names the kind and how often it repeats", () => {
    expect(
      paymentDetail({ ...payment("gym", "2026-11-20", 3900, PaymentKind.Subscription), repeat: Frequency.Monthly }),
    ).toBe("Subscription, monthly");
    expect(paymentDetail(payment("fee", "2026-11-20", 100))).toBe("Bill");
  });

  it("labels a day for screen readers", () => {
    expect(dayPaymentsLabel("2026-11-20", 1, makeSettings())).toBe("Friday, November 20, 1 payment");
    expect(dayPaymentsLabel("2026-11-18", 0, makeSettings())).toBe("Wednesday, November 18, no payments");
  });
});

describe("paymentsInMonth", () => {
  const base = { amountCents: 1000, kind: PaymentKind.Bill, glyph: PaymentGlyph.Bills };

  it("keeps a one off payment in its own month only", () => {
    const once = { ...base, id: "once", title: "Once", date: "2026-11-20" };
    expect(paymentsInMonth([once], "2026-11-01").map((payment) => payment.date)).toEqual(["2026-11-20"]);
    expect(paymentsInMonth([once], "2026-12-01")).toEqual([]);
  });

  it("repeats a monthly payment on the same day and never before it starts", () => {
    const monthly = { ...base, id: "gym", title: "Gym", date: "2026-11-20", repeat: Frequency.Monthly };
    expect(paymentsInMonth([monthly], "2026-12-01").map((payment) => payment.date)).toEqual(["2026-12-20"]);
    expect(paymentsInMonth([monthly], "2026-10-01")).toEqual([]);
  });

  it("clamps a monthly payment on the 31st to the last day of a short month", () => {
    const rent = { ...base, id: "rent", title: "Rent", date: "2026-01-31", repeat: Frequency.Monthly };
    expect(paymentsInMonth([rent], "2026-02-01").map((payment) => payment.date)).toEqual(["2026-02-28"]);
    expect(paymentsInMonth([rent], "2026-03-01").map((payment) => payment.date)).toEqual(["2026-03-31"]);
  });

  it("repeats a yearly payment only in its month", () => {
    const yearly = { ...base, id: "domain", title: "Domain", date: "2026-02-28", repeat: Frequency.Yearly };
    expect(paymentsInMonth([yearly], "2027-02-01").map((payment) => payment.date)).toEqual(["2027-02-28"]);
    expect(paymentsInMonth([yearly], "2027-03-01")).toEqual([]);
  });

  it("repeats a weekly payment every seven days from its start", () => {
    const weekly = { ...base, id: "box", title: "Box", date: "2026-11-20", repeat: Frequency.Weekly };
    expect(paymentsInMonth([weekly], "2026-11-01").map((payment) => payment.date)).toEqual([
      "2026-11-20",
      "2026-11-27",
    ]);
    expect(paymentsInMonth([weekly], "2026-12-01")).toHaveLength(4);
  });
});
