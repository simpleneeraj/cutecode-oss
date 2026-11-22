"use client";

import { resolveSettings, textDirectionOf, type SettingsInput } from "../../locale";
import { dateOf, parseDateTime } from "../../time";
import type { IsoDateTime } from "../../types";
import { useMinuteClock } from "../now-line/clock";

export type FamilyOptions = SettingsInput & {
  now?: IsoDateTime;
};

export function useFamilySettings(options: FamilyOptions) {
  const settings = resolveSettings(options);
  const pinned = options.now === undefined ? undefined : parseDateTime(options.now, settings.timeZone);
  const now = useMinuteClock(pinned);
  const today = now === null ? null : dateOf(now, settings.timeZone);
  return { settings, now, today, direction: textDirectionOf(settings.locale) };
}

export type FamilySettings = ReturnType<typeof useFamilySettings>;
