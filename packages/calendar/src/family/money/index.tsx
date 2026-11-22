"use client";

import { Button } from "@cutecode/ui/components/button";
import { AltArrowLeftIcon } from "@solar-icons/react/linear/alt-arrow-left";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { useState } from "react";

import { formatPlainDate, resolveSettings, textDirectionOf } from "../../locale";
import { LiveRegion } from "../../parts/live-region";
import { useLiveMessage } from "../../parts/live-region/use-announcer";
import { useMinuteClock } from "../../parts/now-line/clock";
import { pickerMonth, SelectionMode } from "../../picker";
import { addMonths, dateOf, parseDateTime, startOfMonth } from "../../time";
import type { PlainDate, ViewSettings } from "../../types";
import { filterLabels, moneyCopy } from "./copy";
import { DayDetail } from "./day-detail";
import { MoneyGrid } from "./month-grid";
import {
  dayPaymentsLabel,
  formatAmount,
  monthTotals,
  PaymentFilter,
  paymentFilters,
  paymentsByDate,
  paymentsInMonth,
  paymentsShown,
} from "./payment";
import type { MoneyCalendarProps, MoneyOptions } from "./props";
import { moneyStyles } from "./style";

type MonthNavProps = {
  title: string;
  onStep: (offset: number) => void;
};

type FilterStripProps = {
  filter: PaymentFilter;
  onFilterChange: (filter: PaymentFilter) => void;
};

type TotalsProps = {
  total: string;
  upcoming: string;
};

const noRules = {};

const styles = moneyStyles();

function MonthNav({ title, onStep }: MonthNavProps) {
  return (
    <div className={styles.nav()}>
      <Button aria-label={moneyCopy.previousMonth} onClick={() => onStep(-1)} size="icon" variant="outline">
        <AltArrowLeftIcon aria-hidden="true" className={styles.arrow()} />
      </Button>
      <h2 aria-live="polite" className={styles.month()}>
        {title}
      </h2>
      <Button aria-label={moneyCopy.nextMonth} onClick={() => onStep(1)} size="icon" variant="outline">
        <AltArrowRightIcon aria-hidden="true" className={styles.arrow()} />
      </Button>
    </div>
  );
}

function Totals({ total, upcoming }: TotalsProps) {
  return (
    <div className={styles.totals()}>
      <p className={styles.total()}>
        <small className={styles.totalLabel()}>{moneyCopy.total}</small>
        <b className={styles.totalValue()}>{total}</b>
      </p>
      <p className={styles.totalEnd()}>
        <small className={styles.totalLabel()}>{moneyCopy.upcoming}</small>
        <b className={styles.totalValue()}>{upcoming}</b>
      </p>
    </div>
  );
}

function FilterStrip({ filter, onFilterChange }: FilterStripProps) {
  return (
    <div aria-label={moneyCopy.filter} className={styles.filters()} role="group">
      {paymentFilters.map((item) => (
        <button
          key={item}
          aria-pressed={item === filter}
          className={styles.chip()}
          onClick={() => onFilterChange(item)}
          type="button"
        >
          {filterLabels[item]}
        </button>
      ))}
    </div>
  );
}

function useToday(options: MoneyOptions, settings: ViewSettings): PlainDate {
  const pinned = options.now === undefined ? undefined : parseDateTime(options.now, settings.timeZone);
  const now = useMinuteClock(pinned);
  return now === null ? "" : dateOf(now, settings.timeZone);
}

function MoneyCalendar({ payments, selection, options }: MoneyCalendarProps) {
  const settings = resolveSettings(options);
  const today = useToday(options, settings);
  const [filter, setFilter] = useState(PaymentFilter.All);
  const month = startOfMonth(selection.value);
  const step = (offset: number) => selection.onValueChange(addMonths(selection.value, offset));
  const live = useLiveMessage();
  const shown = paymentsInMonth(paymentsShown(payments, filter), month);
  const byDate = paymentsByDate(shown);
  const totals = monthTotals(shown, month, today);
  const weeks = pickerMonth(month, settings, { mode: SelectionMode.Single, date: selection.value }, noRules, today);
  const select = (date: PlainDate) => {
    live.speak(dayPaymentsLabel(date, byDate.get(date)?.length ?? 0, settings));
    selection.onValueChange(date);
  };
  const money = (cents: number) => formatAmount(cents, settings, options.currency);

  return (
    <div className={styles.root()} data-slot="money-calendar" dir={textDirectionOf(settings.locale)}>
      <MonthNav onStep={step} title={formatPlainDate(month, settings, { month: "long", year: "numeric" })} />
      <Totals total={money(totals.totalCents)} upcoming={money(totals.upcomingCents)} />
      <FilterStrip filter={filter} onFilterChange={setFilter} />
      <MoneyGrid
        byDate={byDate}
        direction={textDirectionOf(settings.locale)}
        onSelect={select}
        settings={settings}
        weeks={weeks}
      />
      <DayDetail
        currency={options.currency}
        date={selection.value}
        payments={byDate.get(selection.value) ?? []}
        settings={settings}
      />
      <LiveRegion message={live.message} />
    </div>
  );
}

export { MoneyCalendar };
export type { MoneyCalendarProps, MoneyOptions, MoneySelection } from "./props";
export { PaymentFilter, PaymentGlyph, PaymentKind, type Payment } from "./payment";
