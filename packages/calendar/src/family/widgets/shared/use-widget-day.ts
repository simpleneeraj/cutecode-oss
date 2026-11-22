"use client";

import { resolveSettings, textDirectionOf } from "../../../locale";
import { useMinuteClock } from "../../../parts/now-line/clock";
import { parseDateTime } from "../../../time";
import { widgetDay } from "./model";
import type { WidgetProps } from "./props";

export function useWidgetDay({ data, options, placeholder }: WidgetProps) {
  const settings = resolveSettings(options);
  const pinned = options.now === undefined ? undefined : parseDateTime(options.now, settings.timeZone);
  const now = useMinuteClock(pinned);
  const day = now === null ? null : widgetDay(data, now, settings.timeZone);
  const isPlaceholder = (placeholder ?? false) || day === null;
  return { settings, now, day, isPlaceholder, direction: textDirectionOf(settings.locale) };
}
