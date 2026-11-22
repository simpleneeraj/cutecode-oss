"use client";

import { motion, useReducedMotion } from "motion/react";
import { motion as motionTokens } from "@cutecode/ui/tokens/motion";
import { useId } from "react";

import { formatDayLabel, formatPlainDate } from "../../locale";
import type { DateCellFocus } from "../../parts/date-grid/use-date-grid-focus";
import type { FamilyOptions } from "../../parts/family-options/use-family-settings";
import type { PlainDate, ViewSettings } from "../../types";
import { WeekStripLook, type StripDay } from "./model";
import { weekStripStyles } from "./style";
import { useWeekStrip } from "./use-strip";

type WeekStripProps = {
  value: PlainDate;
  onValueChange: (date: PlainDate) => void;
  options: FamilyOptions;
  look?: WeekStripLook;
  isPastLocked?: boolean;
};

type StripShape = {
  look: WeekStripLook;
  thumbId: string;
};

type StripCellProps = {
  day: StripDay;
  strip: StripShape;
  settings: ViewSettings;
  focus: DateCellFocus;
  onSelect: (date: PlainDate) => void;
};

type WeekdayRowProps = {
  days: StripDay[];
  look: WeekStripLook;
  settings: ViewSettings;
};

const instant = { duration: 0 };

function WeekdayRow({ days, look, settings }: WeekdayRowProps) {
  if (look !== WeekStripLook.Island) {
    return null;
  }
  const styles = weekStripStyles({ look });
  return (
    <div className={styles.row()} role="row">
      {days.map((day) => (
        <span key={day.date} className={styles.weekday()} role="columnheader">
          {formatPlainDate(day.date, settings, { weekday: "short" })}
        </span>
      ))}
    </div>
  );
}

function StripCell({ day, strip, settings, focus, onSelect }: StripCellProps) {
  const { look, thumbId } = strip;
  const reduceMotion = useReducedMotion() ?? false;
  const styles = weekStripStyles({ look, isSelected: day.selected, isWeekend: day.weekend });
  const select = () => {
    if (!day.locked) {
      onSelect(day.date);
    }
  };

  return (
    <div aria-disabled={day.locked || undefined} aria-selected={day.selected} className={styles.cell()} role="gridcell">
      <button
        {...focus}
        aria-current={day.today ? "date" : undefined}
        aria-disabled={day.locked || undefined}
        aria-label={formatDayLabel(day.date, settings)}
        className={styles.day()}
        onClick={select}
        type="button"
      >
        {day.selected && (
          <motion.span
            aria-hidden="true"
            className={styles.thumb()}
            layoutId={thumbId}
            transition={reduceMotion ? instant : motionTokens.springSnappy}
          />
        )}
        <span aria-hidden="true" className={styles.label()}>
          {formatPlainDate(day.date, settings, { weekday: "short" })}
        </span>
        <span aria-hidden="true" className={styles.number()}>
          {formatPlainDate(day.date, settings, { day: "numeric" })}
        </span>
      </button>
    </div>
  );
}

function WeekStrip({ value, onValueChange, options, look = WeekStripLook.Soft, isPastLocked = false }: WeekStripProps) {
  const thumbId = useId();
  const { settings, days, focus, monthTitle, weekTitle } = useWeekStrip({ value, options, isPastLocked });
  const { gridRef, onKeyDown, cellFocus } = focus;
  const styles = weekStripStyles({ look });

  return (
    <div
      ref={gridRef}
      aria-label={`${monthTitle}, ${weekTitle}`}
      className={styles.root()}
      data-slot="week-strip"
      onKeyDown={onKeyDown}
      role="grid"
    >
      <div aria-hidden="true" className={styles.head()}>
        <span>{monthTitle}</span>
        <span>{weekTitle}</span>
      </div>
      <WeekdayRow days={days} look={look} settings={settings} />
      <div className={styles.row()} role="row">
        {days.map((day) => (
          <StripCell
            key={day.date}
            day={day}
            focus={cellFocus(day.date)}
            onSelect={onValueChange}
            settings={settings}
            strip={{ look, thumbId }}
          />
        ))}
      </div>
    </div>
  );
}

export { WeekStrip, WeekStripLook };
