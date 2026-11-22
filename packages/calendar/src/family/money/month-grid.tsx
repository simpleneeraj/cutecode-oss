"use client";

import { formatPlainDate } from "../../locale";
import { useDateGridFocus, type DateCellFocus } from "../../parts/date-grid/use-date-grid-focus";
import type { PickerDay } from "../../picker";
import type { PlainDate, TextDirection, ViewSettings } from "../../types";
import { moneyCopy } from "./copy";
import { paymentGlyphs } from "./glyphs";
import { dayPaymentsLabel, type Payment } from "./payment";
import { moneyDayStyles, moneyStyles } from "./style";

export type MoneyGridProps = {
  weeks: PickerDay[][];
  byDate: Map<PlainDate, Payment[]>;
  settings: ViewSettings;
  direction: TextDirection;
  onSelect: (date: PlainDate) => void;
};

type MoneyDayProps = {
  day: PickerDay;
  payments: Payment[];
  settings: ViewSettings;
  focusProps: DateCellFocus;
  onSelect: (date: PlainDate) => void;
};

const styles = moneyStyles();

function MoneyDay({ day, payments, settings, focusProps, onSelect }: MoneyDayProps) {
  const isSelected = day.inMonth && day.selected;
  const dayStyles = moneyDayStyles({ inMonth: day.inMonth, today: day.inMonth && day.today, selected: isSelected });
  const number = formatPlainDate(day.date, settings, { day: "numeric" });
  if (!day.inMonth) {
    return (
      <span aria-disabled="true" className={dayStyles.root()} role="gridcell">
        {number}
      </span>
    );
  }
  const [first] = payments;
  const Glyph = first === undefined ? null : paymentGlyphs[first.glyph];
  return (
    <button
      {...focusProps}
      aria-current={day.today ? "date" : undefined}
      aria-label={dayPaymentsLabel(day.date, payments.length, settings)}
      aria-selected={isSelected}
      className={dayStyles.root()}
      onClick={() => onSelect(day.date)}
      role="gridcell"
      type="button"
    >
      <span aria-hidden="true">{number}</span>
      {Glyph && (
        <span aria-hidden="true" className={dayStyles.glyph()}>
          <Glyph className={dayStyles.glyphIcon()} />
        </span>
      )}
      {payments.length > 1 && (
        <span aria-hidden="true" className={dayStyles.more()}>
          {moneyCopy.more(payments.length - 1)}
        </span>
      )}
    </button>
  );
}

function MoneyGrid({ weeks, byDate, settings, direction, onSelect }: MoneyGridProps) {
  const dates = weeks
    .flat()
    .filter((day) => day.inMonth)
    .map((day) => day.date);
  const selected = weeks.flat().find((day) => day.inMonth && day.selected)?.date;
  const { gridRef, onKeyDown, cellFocus } = useDateGridFocus({
    dates,
    fallbackDate: selected ?? dates[0] ?? "",
    direction,
    timeZone: settings.timeZone,
  });
  const title = formatPlainDate(dates[0] ?? "", settings, { month: "long", year: "numeric" });

  return (
    <div ref={gridRef} aria-label={title} className={styles.grid()} onKeyDown={onKeyDown} role="grid">
      <div className={styles.row()} role="row">
        {weeks[0]?.map((day) => (
          <span key={day.date} className={styles.weekday()} role="columnheader">
            <span aria-hidden="true">{formatPlainDate(day.date, settings, { weekday: "narrow" })}</span>
            <span className={styles.spoken()}>{formatPlainDate(day.date, settings, { weekday: "long" })}</span>
          </span>
        ))}
      </div>
      {weeks.map((week) => (
        <div key={week[0]?.date} className={styles.row()} role="row">
          {week.map((day) => (
            <MoneyDay
              key={day.date}
              day={day}
              focusProps={cellFocus(day.date)}
              onSelect={onSelect}
              payments={byDate.get(day.date) ?? []}
              settings={settings}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export { MoneyGrid };
