"use client";

import { motion, useReducedMotion } from "motion/react";
import { motion as motionTokens } from "@cutecode/ui/tokens/motion";
import { useId } from "react";

import { formatDayLabel, formatPlainDate, weekInfo } from "../../locale";
import { useDateGridFocus, type DateCellFocus } from "../../parts/date-grid/use-date-grid-focus";
import { weekdayOf } from "../../time";
import type { PlainDate, TextDirection, ViewSettings } from "../../types";
import { weekStrip, type WeekStripDay } from "../../widgets";
import { taskCopy } from "./copy";
import type { DateSelectionProps } from "./props";
import { weekStripStyles } from "./style";

type AgendaWeekStripProps = {
  selection: DateSelectionProps;
  settings: ViewSettings;
  today: PlainDate;
  direction: TextDirection;
};

type StripDayProps = {
  day: WeekStripDay;
  settings: ViewSettings;
  thumbId: string;
  focusProps: DateCellFocus;
  onSelect: (date: PlainDate) => void;
};

const instant = { duration: 0 };

function StripDay({ day, settings, thumbId, focusProps, onSelect }: StripDayProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const isWeekend = weekInfo(settings.locale).weekend.includes(weekdayOf(day.date));
  const styles = weekStripStyles({ isWeekend, isSelected: day.selected });

  return (
    <button
      {...focusProps}
      aria-current={day.today ? "date" : undefined}
      aria-label={formatDayLabel(day.date, settings)}
      aria-selected={day.selected}
      className={styles.day()}
      onClick={() => onSelect(day.date)}
      role="gridcell"
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
      <span aria-hidden="true">{formatPlainDate(day.date, settings, { weekday: "short" })}</span>
      <b aria-hidden="true" className={styles.number()}>
        {formatPlainDate(day.date, settings, { day: "numeric" })}
      </b>
    </button>
  );
}

function AgendaWeekStrip({ selection, settings, today, direction }: AgendaWeekStripProps) {
  const days = weekStrip(selection.value, settings, today);
  const dates = days.map((day) => day.date);
  const { gridRef, onKeyDown, cellFocus } = useDateGridFocus({
    dates,
    fallbackDate: selection.value,
    direction,
    timeZone: settings.timeZone,
  });
  const thumbId = useId();
  const styles = weekStripStyles();

  return (
    <div ref={gridRef} aria-label={taskCopy.week} className={styles.root()} onKeyDown={onKeyDown} role="grid">
      <div className={styles.row()} role="row">
        {days.map((day) => (
          <StripDay
            key={day.date}
            day={day}
            focusProps={cellFocus(day.date)}
            onSelect={selection.onValueChange}
            settings={settings}
            thumbId={thumbId}
          />
        ))}
      </div>
    </div>
  );
}

export { AgendaWeekStrip };
