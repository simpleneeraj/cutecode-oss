import { Fragment } from "react";

import { formatDayLabel, formatPlainDate } from "../../locale";
import type { PlainDate, ViewSettings } from "../../types";
import type { GridColumn } from "./columns";
import { dayHeaderStyles } from "./style";

type DayHeaderProps = {
  column: GridColumn;
  settings: ViewSettings;
  onOpenDay: ((column: GridColumn) => void) | null;
};

type DayFaceProps = {
  date: PlainDate;
  settings: ViewSettings;
  styles: ReturnType<typeof dayHeaderStyles>;
};

function DayFace({ date, settings, styles }: DayFaceProps) {
  return (
    <Fragment>
      <span aria-hidden="true" className={styles.weekdayLong()}>
        {formatPlainDate(date, settings, { weekday: "short" })}
      </span>
      <span aria-hidden="true" className={styles.weekdayShort()}>
        {formatPlainDate(date, settings, { weekday: "narrow" })}
      </span>
      <span aria-hidden="true" className={styles.number()}>
        {formatPlainDate(date, settings, { day: "numeric" })}
      </span>
    </Fragment>
  );
}

function DayHeader({ column, settings, onOpenDay }: DayHeaderProps) {
  const { date } = column.column.day;
  const styles = dayHeaderStyles({
    isPressable: onOpenDay !== null,
    isToday: column.isToday,
    isSelected: column.isSelected,
    isWeekend: column.isWeekend,
  });
  const label = formatDayLabel(date, settings);
  const current = column.isToday ? "date" : undefined;
  const face = <DayFace date={date} settings={settings} styles={styles} />;

  return (
    <div className={styles.root()} data-slot="day-header" role="columnheader">
      {onOpenDay === null ? (
        <span aria-current={current} className={styles.day()}>
          <span className={styles.spokenLabel()}>{label}</span>
          {face}
        </span>
      ) : (
        <button
          aria-current={current}
          aria-label={label}
          className={styles.day()}
          onClick={() => onOpenDay(column)}
          tabIndex={-1}
          type="button"
        >
          {face}
        </button>
      )}
    </div>
  );
}

export { DayHeader };
