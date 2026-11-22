"use client";

import { AddIcon } from "@solar-icons/react/linear/add";
import { CalendarIcon } from "@solar-icons/react/bold-duotone/calendar";
import { motion as motionTokens } from "@cutecode/ui/tokens/motion";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { formatPlainDate } from "../../locale";
import { useFamilySettings, type FamilyOptions } from "../../parts/family-options/use-family-settings";
import { addDays } from "../../time";
import type { CalendarEvent, PlainDate, ViewSettings } from "../../types";
import { deskCopy, deskTitle, relativeDayLabel } from "./model";
import { deskStyles } from "./style";

type DeskCalendarProps = {
  events: CalendarEvent[];
  value: PlainDate;
  onValueChange: (date: PlainDate) => void;
  options: FamilyOptions;
  onAdd?: (date: PlainDate) => void;
};

type FlipFaceProps = {
  faceKey: string;
  label: string;
  number: string;
};

type FlipsProps = {
  value: PlainDate;
  settings: ViewSettings;
  onFlip: () => void;
};

const styles = deskStyles();

const flipMotion = {
  full: {
    initial: { rotateX: -90, opacity: 0 },
    animate: { rotateX: 0, opacity: 1 },
    exit: { rotateX: 90, opacity: 0 },
  },
  reduced: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
};

function upper(text: string, settings: ViewSettings): string {
  return text.toLocaleUpperCase(settings.locale);
}

function FlipFace({ faceKey, label, number }: FlipFaceProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const flip = reduceMotion ? flipMotion.reduced : flipMotion.full;

  return (
    <AnimatePresence initial={false}>
      <motion.span
        key={faceKey}
        animate={flip.animate}
        className={styles.face()}
        exit={flip.exit}
        initial={flip.initial}
        transition={reduceMotion ? motionTokens.fade : motionTokens.springSnappy}
      >
        <small className={styles.faceLabel()}>{label}</small>
        <span className={styles.faceNumber()}>{number}</span>
      </motion.span>
    </AnimatePresence>
  );
}

function Flips({ value, settings, onFlip }: FlipsProps) {
  const month = formatPlainDate(value, settings, { month: "2-digit" });
  const day = formatPlainDate(value, settings, { day: "2-digit" });

  return (
    <div className={styles.flips()}>
      <span aria-hidden="true" className={styles.rings()}>
        <i className={styles.ring()} />
        <i className={styles.ring()} />
      </span>
      <span aria-hidden="true" className={styles.tile()}>
        <FlipFace
          faceKey={month}
          label={upper(formatPlainDate(value, settings, { month: "short" }), settings)}
          number={month}
        />
      </span>
      <button
        aria-label={deskCopy.nextDay}
        className={styles.tile({ class: styles.flipTile() })}
        onClick={onFlip}
        type="button"
      >
        <FlipFace
          faceKey={value}
          label={upper(formatPlainDate(value, settings, { weekday: "short" }), settings)}
          number={day}
        />
      </button>
    </div>
  );
}

function DeskCalendar({ events, value, onValueChange, options, onAdd }: DeskCalendarProps) {
  const { settings, today } = useFamilySettings(options);
  const dateText = formatPlainDate(value, settings, { weekday: "long", month: "long", day: "numeric" });

  return (
    <section aria-label={dateText} className={styles.root()} data-slot="desk-calendar">
      <div className={styles.head()}>
        <span aria-hidden="true" className={styles.glyph()}>
          <CalendarIcon className={styles.glyphIcon()} />
        </span>
        {relativeDayLabel(value, today, settings)}
      </div>
      <div className={styles.stage()}>
        {onAdd !== undefined && (
          <button aria-label={deskCopy.addToDay} className={styles.add()} onClick={() => onAdd(value)} type="button">
            <AddIcon aria-hidden="true" className={styles.addIcon()} />
          </button>
        )}
        <div aria-atomic="true" aria-live="polite" className={styles.text()}>
          <h3 className={styles.title()}>{deskTitle(events, value, settings.timeZone)}</h3>
          <p className={styles.date()}>{dateText}</p>
        </div>
        <Flips onFlip={() => onValueChange(addDays(value, 1))} settings={settings} value={value} />
      </div>
    </section>
  );
}

export { DeskCalendar };
