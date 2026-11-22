import type { PlainDate } from "@cutecode/calendar/types";
import { useId } from "react";

import type { HeatCell, HeatMonth, WeekdayName } from "./model";
import { heatCellStyles, yearMonthStyles } from "./style";

export type FocusRef = (element: HTMLElement | null) => void;

type YearMonthProps = {
  month: HeatMonth;
  weekdays: WeekdayName[];
  focusedDate: PlainDate | null;
  focusRef: FocusRef;
};

type HeatSquareProps = {
  cell: HeatCell;
  isFocused: boolean;
  focusRef: FocusRef;
};

function HeatSquare({ cell, isFocused, focusRef }: HeatSquareProps) {
  const { day } = cell;
  if (day === null) {
    return <span aria-hidden="true" className={yearMonthStyles().blank()} role="presentation" />;
  }
  return (
    <span
      ref={isFocused ? focusRef : undefined}
      aria-current={day.isToday ? "date" : undefined}
      aria-label={day.label}
      className={heatCellStyles({ level: day.level, isToday: day.isToday })}
      data-date={day.date}
      data-slot="heat-day"
      role="gridcell"
      tabIndex={isFocused ? 0 : -1}
    />
  );
}

function YearMonth({ month, weekdays, focusedDate, focusRef }: YearMonthProps) {
  const styles = yearMonthStyles({ isCurrent: month.isCurrent });
  const titleId = useId();

  return (
    <section className={styles.root()} data-slot="heat-month">
      <h3 className={styles.title()} id={titleId}>
        {month.title}
      </h3>
      <div aria-labelledby={titleId} className={styles.grid()} role="grid">
        <div className={styles.header()} role="row">
          {weekdays.map((weekday) => (
            <span key={weekday.key} role="columnheader">
              {weekday.long}
            </span>
          ))}
        </div>
        {month.weeks.map((week) => (
          <div key={week[0]?.key} className={styles.row()} role="row">
            {week.map((cell) => (
              <HeatSquare key={cell.key} cell={cell} focusRef={focusRef} isFocused={cell.day?.date === focusedDate} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export { YearMonth };
