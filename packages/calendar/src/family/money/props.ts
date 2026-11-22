import type { SettingsInput } from "../../locale";
import type { IsoDateTime, PlainDate } from "../../types";
import type { Payment } from "./payment";

export type MoneyOptions = SettingsInput & {
  currency: string;
  now?: IsoDateTime;
};

export type MoneySelection = {
  value: PlainDate;
  onValueChange: (date: PlainDate) => void;
};

export type MoneyCalendarProps = {
  payments: Payment[];
  selection: MoneySelection;
  options: MoneyOptions;
};
