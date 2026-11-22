import { testZones } from "../../testing";
import { Frequency } from "../../types";
import { PaymentGlyph, PaymentKind, type Payment } from "./payment";
import type { MoneyOptions } from "./props";

export enum MoneyExampleState {
  Payment = "payment",
  NothingDue = "nothingDue",
}

export const moneyExampleChoices = [
  { kind: MoneyExampleState.Payment, label: "Day with a payment" },
  { kind: MoneyExampleState.NothingDue, label: "Nothing due" },
];

export const moneyExampleCopy = {
  states: "Money calendar state",
};

export const moneyExampleDates: Record<MoneyExampleState, string> = {
  [MoneyExampleState.Payment]: "2026-11-20",
  [MoneyExampleState.NothingDue]: "2026-11-18",
};

export const moneyExampleOptions: MoneyOptions = {
  locale: "en-US",
  timeZone: testZones.losAngeles,
  currency: "USD",
  now: "2026-11-18T09:40",
};

type PaymentSeed = [string, string, string, number, PaymentKind, PaymentGlyph];

const seeds: PaymentSeed[] = [
  ["rent", "Rent", "2026-11-01", 92900, PaymentKind.Bill, PaymentGlyph.Home],
  ["insurance", "Renter insurance", "2026-11-04", 1850, PaymentKind.Bill, PaymentGlyph.Reminder],
  ["card", "Card payment", "2026-11-10", 25000, PaymentKind.Debt, PaymentGlyph.Card],
  ["streaming", "Streaming", "2026-11-12", 1599, PaymentKind.Subscription, PaymentGlyph.Streaming],
  ["music", "Music", "2026-11-16", 1099, PaymentKind.Subscription, PaymentGlyph.Music],
  ["design-tools", "Design tools", "2026-11-17", 2400, PaymentKind.Subscription, PaymentGlyph.Software],
  ["gym", "Gym membership", "2026-11-20", 3900, PaymentKind.Subscription, PaymentGlyph.Gym],
  ["groceries", "Grocery box", "2026-11-27", 8921, PaymentKind.Subscription, PaymentGlyph.Groceries],
  ["utilities", "Utilities", "2026-11-30", 12400, PaymentKind.Bill, PaymentGlyph.Bills],
  ["loan", "Student loan", "2026-11-30", 30100, PaymentKind.Debt, PaymentGlyph.Card],
];

export const examplePayments: Payment[] = seeds.map(([id, title, date, amountCents, kind, glyph]) => ({
  id,
  title,
  date,
  amountCents,
  kind,
  glyph,
  repeat: Frequency.Monthly,
}));
