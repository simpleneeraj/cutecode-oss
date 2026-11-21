import { dateTimeFormat } from "./format";
import { HourCycle, TextDirection, Weekday, type ClockRange, type ViewSettings, type WeekInfo } from "../types";

export type SettingsInput = {
  locale: string;
  timeZone: string;
  weekStartsOn?: Weekday;
  hourCycle?: HourCycle;
  workingHours?: ClockRange;
};

const isoWeekdays: readonly Weekday[] = [
  Weekday.Monday,
  Weekday.Tuesday,
  Weekday.Wednesday,
  Weekday.Thursday,
  Weekday.Friday,
  Weekday.Saturday,
  Weekday.Sunday,
];

const saturdaySunday = [Weekday.Saturday, Weekday.Sunday];
const fridaySaturday = [Weekday.Friday, Weekday.Saturday];

const fallbackRegions = {
  sundayStart: new Set([
    "AG",
    "AS",
    "BD",
    "BR",
    "BS",
    "BT",
    "BW",
    "BZ",
    "CA",
    "CN",
    "CO",
    "DM",
    "DO",
    "ET",
    "GT",
    "GU",
    "HK",
    "HN",
    "ID",
    "IL",
    "IN",
    "JM",
    "JP",
    "KE",
    "KH",
    "KR",
    "LA",
    "MH",
    "MM",
    "MO",
    "MT",
    "MX",
    "MZ",
    "NI",
    "NP",
    "PA",
    "PE",
    "PH",
    "PK",
    "PR",
    "PT",
    "PY",
    "SA",
    "SG",
    "SV",
    "TH",
    "TT",
    "TW",
    "UM",
    "US",
    "VE",
    "VI",
    "WS",
    "YE",
    "ZA",
    "ZW",
  ]),
  saturdayStart: new Set(["AE", "AF", "BH", "DJ", "DZ", "EG", "IQ", "IR", "JO", "KW", "LY", "OM", "QA", "SD", "SY"]),
  fridaySaturdayWeekend: new Set([
    "AE",
    "BH",
    "DZ",
    "EG",
    "IL",
    "IQ",
    "JO",
    "KW",
    "LY",
    "OM",
    "QA",
    "SA",
    "SD",
    "SY",
    "YE",
  ]),
};

const rightToLeftLanguages = new Set(["ar", "he", "fa", "ur"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readLocaleInfo(locale: Intl.Locale, method: string, property: string): unknown {
  const getter: unknown = Reflect.get(locale, method);
  if (typeof getter === "function") {
    return Reflect.apply(getter, locale, []);
  }
  return Reflect.get(locale, property);
}

function isoWeekdayOf(value: unknown): Weekday | undefined {
  if (typeof value !== "number") {
    return undefined;
  }
  return isoWeekdays[value - 1];
}

function parseWeekInfo(value: unknown): WeekInfo | undefined {
  if (!isRecord(value)) {
    return undefined;
  }
  const firstDay = isoWeekdayOf(value.firstDay);
  const weekendValues = Array.isArray(value.weekend) ? value.weekend : [];
  const weekend = weekendValues.map(isoWeekdayOf).filter((day) => day !== undefined);
  if (firstDay === undefined) {
    return undefined;
  }
  return { firstDay, weekend };
}

function firstDayOfRegion(region: string): Weekday {
  if (fallbackRegions.sundayStart.has(region)) {
    return Weekday.Sunday;
  }
  if (fallbackRegions.saturdayStart.has(region)) {
    return Weekday.Saturday;
  }
  return Weekday.Monday;
}

export function fallbackWeekInfo(region: string): WeekInfo {
  const isFridaySaturday = fallbackRegions.fridaySaturdayWeekend.has(region);
  return { firstDay: firstDayOfRegion(region), weekend: isFridaySaturday ? fridaySaturday : saturdaySunday };
}

export function weekInfo(locale: string): WeekInfo {
  const parsed = new Intl.Locale(locale);
  const reported = parseWeekInfo(readLocaleInfo(parsed, "getWeekInfo", "weekInfo"));
  return reported ?? fallbackWeekInfo(parsed.maximize().region ?? "");
}

export function hourCycleOf(locale: string): HourCycle {
  const { hourCycle } = dateTimeFormat(locale, { hour: "numeric" }).resolvedOptions();
  const isTwelveHour = hourCycle === "h11" || hourCycle === "h12";
  return isTwelveHour ? HourCycle.Twelve : HourCycle.TwentyFour;
}

export function fallbackTextDirection(language: string): TextDirection {
  return rightToLeftLanguages.has(language) ? TextDirection.RightToLeft : TextDirection.LeftToRight;
}

export function textDirectionOf(locale: string): TextDirection {
  const parsed = new Intl.Locale(locale);
  const textInfo = readLocaleInfo(parsed, "getTextInfo", "textInfo");
  const direction = isRecord(textInfo) ? textInfo.direction : undefined;
  if (direction === TextDirection.RightToLeft) {
    return TextDirection.RightToLeft;
  }
  if (direction === TextDirection.LeftToRight) {
    return TextDirection.LeftToRight;
  }
  return fallbackTextDirection(parsed.language);
}

export function resolveSettings(input: SettingsInput): ViewSettings {
  const settings: ViewSettings = {
    locale: input.locale,
    timeZone: input.timeZone,
    weekStartsOn: input.weekStartsOn ?? weekInfo(input.locale).firstDay,
    hourCycle: input.hourCycle ?? hourCycleOf(input.locale),
  };
  if (input.workingHours === undefined) {
    return settings;
  }
  return { ...settings, workingHours: input.workingHours };
}
