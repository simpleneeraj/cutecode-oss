import { PaymentFilter } from "./payment";

export const moneyCopy = {
  total: "Total",
  upcoming: "Upcoming",
  filter: "Filter payments",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  nothingDue: "No payments due",
  tapAnother: "Tap another day.",
  more: (count: number) => `+${count}`,
};

export const filterLabels: Record<PaymentFilter, string> = {
  [PaymentFilter.All]: "All",
  [PaymentFilter.Bill]: "Bill",
  [PaymentFilter.Subscription]: "Subscription",
  [PaymentFilter.Debt]: "Debt",
};
