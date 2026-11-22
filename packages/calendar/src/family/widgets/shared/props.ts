import type { SettingsInput } from "../../../locale";
import type { CalendarData } from "../../../parts/time-grid/props";
import type { IsoDateTime } from "../../../types";

export type WidgetOptions = SettingsInput & {
  now?: IsoDateTime;
};

export type WidgetProps = {
  data: CalendarData;
  options: WidgetOptions;
  placeholder?: boolean;
};

export enum WidgetSize {
  Small = "small",
  Medium = "medium",
  Notch = "notch",
  Large = "large",
}
