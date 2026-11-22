import type { PlainDate } from "../../types";

export function fallbackDateOf(dates: PlainDate[], preferred: (PlainDate | null)[]): PlainDate {
  const shown = preferred.find((date) => date !== null && dates.includes(date));
  return shown ?? dates[0] ?? "";
}
