"use client";

import type { ReactNode } from "react";

import { LiveRegion } from "./index";
import { SpeakContext } from "./speak-context";
import { useLiveMessage } from "./use-announcer";

type CalendarAnnouncerProps = {
  children: ReactNode;
};

function CalendarAnnouncer({ children }: CalendarAnnouncerProps) {
  const { message, speak } = useLiveMessage();

  return (
    <SpeakContext value={speak}>
      {children}
      <LiveRegion message={message} />
    </SpeakContext>
  );
}

export { CalendarAnnouncer };
