"use client";

import { use, useState } from "react";

import { announce as announcementText } from "../../announce";
import type { Announcement, ViewSettings } from "../../types";
import { SpeakContext } from "./speak-context";

export type LiveMessage = {
  text: string;
  sequence: number;
};

const silentMessage: LiveMessage = { text: "", sequence: 0 };

export function useLiveMessage() {
  const [message, setMessage] = useState(silentMessage);
  const speak = (text: string) => setMessage((current) => ({ text, sequence: current.sequence + 1 }));
  return { message, speak };
}

export function useAnnouncer(settings: ViewSettings) {
  const shared = use(SpeakContext);
  const own = useLiveMessage();
  const speak = shared ?? own.speak;
  const announce = (announcement: Announcement) => speak(announcementText(announcement, settings));
  return { announce, message: shared === null ? own.message : null };
}
