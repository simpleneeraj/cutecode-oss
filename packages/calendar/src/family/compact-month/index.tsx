"use client";

import { AnimatePresence, motion } from "motion/react";

import { CalendarEmpty } from "../../parts/state/empty";
import { stateCopy } from "../../parts/state/copy";
import { ContentSwap } from "../../parts/view-motion/content-swap";
import { viewSwitchMotion } from "../../parts/view-motion/presets";
import type { FamilyOptions } from "../../parts/family-options/use-family-settings";
import type { PlainDate } from "../../types";
import { FilterChips } from "./filter-chips";
import { MonthHead } from "./month-head";
import { MonthList } from "./month-list";
import { CompactLayout, compactMonthCopy } from "./model";
import { compactMonthStyles } from "./style";
import { TileGrid } from "./tile-grid";
import { useCompactMonth, type CompactMonthData } from "./use-month-state";

type CompactMonthProps = {
  data: CompactMonthData;
  value: PlainDate;
  onValueChange: (date: PlainDate) => void;
  options: FamilyOptions;
  isLoading?: boolean;
};

type CompactMonthState = ReturnType<typeof useCompactMonth>;

type MonthBodyProps = {
  month: CompactMonthState;
  data: CompactMonthData;
  selection: { value: PlainDate; onValueChange: (date: PlainDate) => void };
  isLoading: boolean;
};

type MonthEmptyProps = {
  isEmpty: boolean;
  title: string;
};

const styles = compactMonthStyles();

function MonthBody({ month, data, selection, isLoading }: MonthBodyProps) {
  const isList = month.layout.value === CompactLayout.List && !isLoading;
  return (
    <div inert={month.isEmpty}>
      <ContentSwap swapKey={month.layout.value}>
        {isList ? (
          <MonthList
            calendars={data.calendars}
            days={month.list}
            selection={selection}
            settings={month.family.settings}
          />
        ) : (
          <TileGrid
            family={month.family}
            isLoading={isLoading}
            onReveal={month.showMonth}
            onSelect={selection.onValueChange}
            weeks={month.tiles}
          />
        )}
      </ContentSwap>
    </div>
  );
}

function MonthEmpty({ isEmpty, title }: MonthEmptyProps) {
  return (
    <AnimatePresence>
      {isEmpty && (
        <motion.div
          animate={viewSwitchMotion.reduced.animate}
          className={styles.empty()}
          exit={viewSwitchMotion.reduced.initial}
          initial={viewSwitchMotion.reduced.initial}
          transition={viewSwitchMotion.reduced.transition}
        >
          <CalendarEmpty description={compactMonthCopy.emptyDescription(title)} title={stateCopy.emptyTitle} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CompactMonth({ data, value, onValueChange, options, isLoading = false }: CompactMonthProps) {
  const month = useCompactMonth({ data, value, options, isLoading });

  return (
    <section aria-busy={isLoading} aria-label={month.title} className={styles.root()} data-slot="compact-month">
      <MonthHead
        layout={month.layout.value}
        onLayoutChange={month.layout.onValueChange}
        onStep={month.step}
        title={month.title}
      />
      <FilterChips
        chips={month.filter.chips}
        isLoading={isLoading}
        onValueChange={month.filter.onValueChange}
        value={month.filter.value}
      />
      <div className={styles.body()}>
        <MonthBody data={data} isLoading={isLoading} month={month} selection={{ value, onValueChange }} />
        <MonthEmpty isEmpty={month.isEmpty} title={month.title} />
      </div>
    </section>
  );
}

export { CompactMonth };
