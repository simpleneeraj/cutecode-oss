"use client";

import { startOfMonth } from "@cutecode/calendar/time";
import type { PlainDate } from "@cutecode/calendar/types";

import type { HeatMonth, YearModel } from "./model";
import { yearViewStyles } from "./style";
import type { MonthList } from "./use-month-list";
import { YearMonth, type FocusRef } from "./month";

type YearMonthsProps = {
  model: YearModel;
  focusedDate: PlainDate;
  focusRef: FocusRef;
  list: MonthList;
};

const styles = yearViewStyles();

function focusedIn(month: HeatMonth, focusedDate: PlainDate): PlainDate | null {
  return startOfMonth(focusedDate) === month.key ? focusedDate : null;
}

function VirtualMonths({ model, focusedDate, focusRef, list }: YearMonthsProps) {
  const { virtualizer, scrollMargin, placeList } = list;

  return (
    <div ref={placeList} className={styles.list()} style={{ blockSize: virtualizer.getTotalSize() }}>
      {virtualizer.getVirtualItems().map((item) => (
        <div
          key={item.key}
          ref={virtualizer.measureElement}
          className={styles.item()}
          data-index={item.index}
          style={{ transform: `translateY(${item.start - scrollMargin}px)` }}
        >
          {list.monthsInRow(item.index).map((month) => (
            <YearMonth
              key={month.key}
              focusedDate={focusedIn(month, focusedDate)}
              focusRef={focusRef}
              month={month}
              weekdays={model.weekdays}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function YearMonths(props: YearMonthsProps) {
  const { model, focusedDate, focusRef, list } = props;
  if (list.isVirtual) {
    return <VirtualMonths {...props} />;
  }
  return (
    <div className={styles.months()}>
      {model.months.map((month) => (
        <YearMonth
          key={month.key}
          focusedDate={focusedIn(month, focusedDate)}
          focusRef={focusRef}
          month={month}
          weekdays={model.weekdays}
        />
      ))}
    </div>
  );
}

export { YearMonths };
