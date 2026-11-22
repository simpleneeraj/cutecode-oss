import type { CalendarData, CalendarNavigation } from "@cutecode/calendar/day";
import type { SettingsInput } from "@cutecode/calendar/locale";
import type { CalendarStatus } from "@cutecode/calendar/parts/state/status";
import type { IsoDateTime } from "@cutecode/calendar/types";

export type YearOptions = SettingsInput & {
  now?: IsoDateTime;
};

export type YearViewProps = {
  data: CalendarData;
  navigation: CalendarNavigation;
  options: YearOptions;
  status?: CalendarStatus;
};
