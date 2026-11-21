import { coveredDates } from "@cutecode/calendar/event";
import { daysBetween, eachDate } from "@cutecode/calendar/time";
import type { DayAggregator, PlainDate } from "@cutecode/calendar/types";

export enum HeatLevel {
  None = "none",
  Low = "low",
  Medium = "medium",
  High = "high",
  Peak = "peak",
}

export const heatScale: Record<HeatLevel, number> = {
  [HeatLevel.None]: 0,
  [HeatLevel.Low]: 22,
  [HeatLevel.Medium]: 45,
  [HeatLevel.High]: 70,
  [HeatLevel.Peak]: 100,
};

const heatThresholds: { level: HeatLevel; upTo: number }[] = [
  { level: HeatLevel.Low, upTo: 0.25 },
  { level: HeatLevel.Medium, upTo: 0.5 },
  { level: HeatLevel.High, upTo: 0.75 },
  { level: HeatLevel.Peak, upTo: 1 },
];

function clampIndex(value: number, length: number): number {
  return Math.min(length, Math.max(0, value));
}

export const aggregateDays: DayAggregator = (occurrences, dates, timeZone) => {
  const days: PlainDate[] = eachDate(dates);
  const counts = days.map(() => 0);
  for (const occurrence of occurrences) {
    const covered = coveredDates(occurrence, timeZone);
    const first = clampIndex(daysBetween(dates.start, covered.start), days.length);
    const last = clampIndex(daysBetween(dates.start, covered.end), days.length);
    for (let index = first; index < last; index += 1) {
      counts[index] = (counts[index] ?? 0) + 1;
    }
  }
  return days.map((date, index) => ({ date, count: counts[index] ?? 0 }));
};

export function heatLevel(count: number, maximum: number): HeatLevel {
  const isQuiet = count <= 0 || maximum <= 0;
  if (isQuiet) {
    return HeatLevel.None;
  }
  const ratio = Math.min(1, count / maximum);
  return heatThresholds.find((threshold) => ratio <= threshold.upTo)?.level ?? HeatLevel.Peak;
}
