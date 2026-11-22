"use client";

import { SpeakContext } from "@cutecode/calendar/parts/live-region/speak-context";
import type { Instant } from "@cutecode/calendar/types";
import { Button } from "@cutecode/ui/components/button";
import { motion as motionTokens } from "@cutecode/ui/tokens/motion";
import { GlobalIcon } from "@solar-icons/react/linear/global";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { use, useRef, useSyncExternalStore } from "react";

import { dismissalKey, isZoneMismatch, zoneBannerCopy } from "./copy";
import { dismissForSession, isDismissed, readDeviceZone, subscribeDismissals, subscribeNever } from "./session";
import { zoneBannerStyles } from "./style";

type ZoneBannerProps = {
  timeZone: string;
  now: Instant;
  onTimeZoneChange: (timeZone: string) => void;
};

const bannerRise = 8;

const hiddenOnServer = () => true;

const unknownOnServer = () => null;

const styles = zoneBannerStyles();

function useZoneBanner(calendarZone: string, now: Instant, onUse: (timeZone: string) => void) {
  const deviceZone = useSyncExternalStore<string | null>(subscribeNever, readDeviceZone, unknownOnServer);
  const key = dismissalKey(deviceZone ?? "", calendarZone);
  const isHidden = useSyncExternalStore(subscribeDismissals, () => isDismissed(key), hiddenOnServer);
  const isShown = !isHidden && isZoneMismatch(deviceZone, calendarZone, now);
  const keep = () => dismissForSession(key);
  const use = () => {
    dismissForSession(key);
    if (deviceZone !== null) {
      onUse(deviceZone);
    }
  };
  return { key, isShown, copy: zoneBannerCopy(deviceZone ?? calendarZone, calendarZone), keep, use };
}

function useAnnounceOnce(key: string, text: string) {
  const speak = use(SpeakContext);
  const announcedRef = useRef<string | null>(null);
  return (element: HTMLElement | null) => {
    const isNew = element !== null && announcedRef.current !== key;
    if (isNew) {
      announcedRef.current = key;
      speak?.(text);
    }
  };
}

function ZoneBanner({ timeZone, now, onTimeZoneChange }: ZoneBannerProps) {
  const banner = useZoneBanner(timeZone, now, onTimeZoneChange);
  const announce = useAnnounceOnce(banner.key, `${banner.copy.title}. ${banner.copy.description}`);
  const isReducedMotion = useReducedMotion() ?? false;
  const rise = isReducedMotion ? 0 : bannerRise;
  const transition = isReducedMotion ? motionTokens.fade : motionTokens.springGentle;

  return (
    <AnimatePresence initial={false}>
      {banner.isShown && (
        <motion.div
          ref={announce}
          animate={{ opacity: 1, y: 0 }}
          className={styles.root()}
          data-slot="zone-banner"
          exit={{ opacity: 0, y: -rise, transition: motionTokens.fade }}
          initial={{ opacity: 0, y: -rise }}
          transition={transition}
        >
          <GlobalIcon aria-hidden="true" className={styles.icon()} />
          <span className={styles.text()}>
            <strong className={styles.title()}>{banner.copy.title}</strong>
            <span className={styles.description()}>{banner.copy.description}</span>
          </span>
          <span className={styles.actions()}>
            <Button onClick={banner.use} size="sm" variant="tinted">
              {banner.copy.use}
            </Button>
            <Button onClick={banner.keep} size="sm" variant="ghost">
              {banner.copy.keep}
            </Button>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { ZoneBanner };
