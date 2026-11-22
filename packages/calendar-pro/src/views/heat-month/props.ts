import type { CalendarData } from "@cutecode/calendar/day";
import type { SettingsInput } from "@cutecode/calendar/locale";
import type { IsoDateTime, PlainDate } from "@cutecode/calendar/types";

import type { HeatLook } from "./model";

export type HeatMonthOptions = SettingsInput & {
  now?: IsoDateTime;
  look?: HeatLook;
};

export type HeatMonthSelection = {
  value: PlainDate;
  onValueChange: (date: PlainDate) => void;
};

export type HeatMonthProps = {
  data: CalendarData;
  selection: HeatMonthSelection;
  options: HeatMonthOptions;
  loading?: boolean;
};
