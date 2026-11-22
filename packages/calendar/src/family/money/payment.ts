import { formatPlainDate } from "../../locale";
import { addMonths, compareDates, daysBetween, eachDate, startOfMonth, toUtcDate } from "../../time";
import { Frequency, type PlainDate, type ViewSettings } from "../../types";

export enum PaymentKind {
  Bill = "bill",
  Subscription = "subscription",
  Debt = "debt",
}

export enum PaymentFilter {
  All = "all",
  Bill = "bill",
  Subscription = "subscription",
  Debt = "debt",
}

export enum PaymentGlyph {
  Home = "home",
  Reminder = "reminder",
  Card = "card",
  Streaming = "streaming",
  Music = "music",
  Software = "software",
  Gym = "gym",
  Groceries = "groceries",
  Bills = "bills",
}

export type Payment = {
  id: string;
  title: string;
  date: PlainDate;
  amountCents: number;
  kind: PaymentKind;
  glyph: PaymentGlyph;
  repeat?: Frequency;
};

export type MonthTotals = {
  totalCents: number;
  upcomingCents: number;
};

export const paymentFilters = [PaymentFilter.All, PaymentFilter.Bill, PaymentFilter.Subscription, PaymentFilter.Debt];

const filterKinds: Record<PaymentFilter, PaymentKind[]> = {
  [PaymentFilter.All]: [PaymentKind.Bill, PaymentKind.Subscription, PaymentKind.Debt],
  [PaymentFilter.Bill]: [PaymentKind.Bill],
  [PaymentFilter.Subscription]: [PaymentKind.Subscription],
  [PaymentFilter.Debt]: [PaymentKind.Debt],
};

const kindLabels: Record<PaymentKind, string> = {
  [PaymentKind.Bill]: "Bill",
  [PaymentKind.Subscription]: "Subscription",
  [PaymentKind.Debt]: "Debt",
};

const repeatLabels: Record<Frequency, string> = {
  [Frequency.Daily]: "daily",
  [Frequency.Weekly]: "weekly",
  [Frequency.Monthly]: "monthly",
  [Frequency.Yearly]: "yearly",
};

const centsPerUnit = 100;

export function paymentsShown(payments: Payment[], filter: PaymentFilter): Payment[] {
  const kinds = filterKinds[filter];
  return payments.filter((payment) => kinds.includes(payment.kind));
}

const monthsPerYear = 12;

const dayStep: Record<Frequency.Daily | Frequency.Weekly, number> = {
  [Frequency.Daily]: 1,
  [Frequency.Weekly]: 7,
};

function monthsBetween(start: PlainDate, end: PlainDate): number {
  const from = toUtcDate(start);
  const to = toUtcDate(end);
  return (to.getUTCFullYear() - from.getUTCFullYear()) * monthsPerYear + to.getUTCMonth() - from.getUTCMonth();
}

function everyDays(date: PlainDate, first: PlainDate, step: number): PlainDate[] {
  return eachDate({ start: first, end: addMonths(first, 1) }).filter(
    (day) => compareDates(day, date) >= 0 && daysBetween(date, day) % step === 0,
  );
}

const repeatDates: Record<Frequency, (date: PlainDate, first: PlainDate) => PlainDate[]> = {
  [Frequency.Daily]: (date, first) => everyDays(date, first, dayStep[Frequency.Daily]),
  [Frequency.Weekly]: (date, first) => everyDays(date, first, dayStep[Frequency.Weekly]),
  [Frequency.Monthly]: (date, first) => [addMonths(date, monthsBetween(date, first))],
  [Frequency.Yearly]: (date, first) => {
    const offset = monthsBetween(date, first);
    return offset % monthsPerYear === 0 ? [addMonths(date, offset)] : [];
  },
};

function datesInMonth(payment: Payment, first: PlainDate): PlainDate[] {
  const isBeforeStart = compareDates(first, startOfMonth(payment.date)) < 0;
  if (isBeforeStart) {
    return [];
  }
  if (payment.repeat === undefined) {
    return startOfMonth(payment.date) === first ? [payment.date] : [];
  }
  return repeatDates[payment.repeat](payment.date, first);
}

export function paymentsInMonth(payments: Payment[], month: PlainDate): Payment[] {
  const first = startOfMonth(month);
  return payments.flatMap((payment) => datesInMonth(payment, first).map((date) => ({ ...payment, date })));
}

export function paymentsByDate(payments: Payment[]): Map<PlainDate, Payment[]> {
  const byDate = new Map<PlainDate, Payment[]>();
  for (const payment of payments) {
    byDate.set(payment.date, [...(byDate.get(payment.date) ?? []), payment]);
  }
  return byDate;
}

export function monthTotals(payments: Payment[], month: PlainDate, today: PlainDate): MonthTotals {
  const inMonth = payments.filter((payment) => startOfMonth(payment.date) === startOfMonth(month));
  const upcoming = inMonth.filter((payment) => compareDates(payment.date, today) >= 0);
  const sum = (list: Payment[]) => list.reduce((total, payment) => total + payment.amountCents, 0);
  return { totalCents: sum(inMonth), upcomingCents: sum(upcoming) };
}

export function formatAmount(cents: number, settings: ViewSettings, currency: string): string {
  return new Intl.NumberFormat(settings.locale, { style: "currency", currency }).format(cents / centsPerUnit);
}

export function paymentDetail(payment: Payment): string {
  const kind = kindLabels[payment.kind];
  return payment.repeat === undefined ? kind : `${kind}, ${repeatLabels[payment.repeat]}`;
}

export function paymentCountLabel(count: number): string {
  if (count === 0) {
    return "no payments";
  }
  return count === 1 ? "1 payment" : `${count} payments`;
}

export function dayPaymentsLabel(date: PlainDate, count: number, settings: ViewSettings): string {
  const day = formatPlainDate(date, settings, { weekday: "long", month: "long", day: "numeric" });
  return `${day}, ${paymentCountLabel(count)}`;
}
