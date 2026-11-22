"use client";

import { formatPlainDate } from "@cutecode/calendar/locale";
import { LiveRegion } from "@cutecode/calendar/parts/live-region";
import type { ViewSettings } from "@cutecode/calendar/types";
import { Button } from "@cutecode/ui/components/button";
import { Skeleton } from "@cutecode/ui/components/skeleton";
import { motion as motionTokens } from "@cutecode/ui/tokens/motion";
import { AltArrowLeftIcon } from "@solar-icons/react/linear/alt-arrow-left";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { HeatLevel } from "../../heat/aggregate";
import { eventCountLabel } from "../year/model";
import type { HeatMonthModel, HeatTile } from "./model";
import type { HeatMonthProps } from "./props";
import { heatMonthStyles, heatSwatchStyles } from "./style";
import { HeatTileButton } from "./tile";
import { useHeatMonth, type HeatMonthView } from "./use-view";

type HeatHeadProps = {
  total: string | null;
  title: string;
  onStep: (offset: number) => void;
};

type HeatGridProps = {
  view: HeatMonthView;
};

type WeekdayHeaderProps = {
  week: HeatTile[];
  settings: ViewSettings;
};

type HeatStageProps = {
  view: HeatMonthView;
  isLoading: boolean;
};

type HeatFootProps = {
  model: HeatMonthModel;
  settings: ViewSettings;
};

const heatCopy = {
  previousMonth: "Previous month",
  nextMonth: "Next month",
  quiet: "A quiet month",
  busiest: (day: string) => `Busiest: ${day}`,
  less: "Less",
  more: "More",
  loading: "Loading events",
};

const heatLevels = Object.values(HeatLevel);

const gridMotion = {
  full: { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: motionTokens.springGentle },
  reduced: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: motionTokens.fade },
  exit: { opacity: 0 },
};

const styles = heatMonthStyles();

function HeatHead({ total, title, onStep }: HeatHeadProps) {
  return (
    <div className={styles.head()}>
      <p className={styles.summary()}>
        <small className={styles.summaryLabel()}>{title}</small>
        {total === null ? (
          <Skeleton aria-hidden="true" className={styles.summarySkeleton()} />
        ) : (
          <b className={styles.summaryValue()}>{total}</b>
        )}
      </p>
      <span className={styles.steps()}>
        <Button aria-label={heatCopy.previousMonth} onClick={() => onStep(-1)} size="icon" variant="outline">
          <AltArrowLeftIcon aria-hidden="true" className={styles.arrow()} />
        </Button>
        <Button aria-label={heatCopy.nextMonth} onClick={() => onStep(1)} size="icon" variant="outline">
          <AltArrowRightIcon aria-hidden="true" className={styles.arrow()} />
        </Button>
      </span>
    </div>
  );
}

function HeatFoot({ model, settings }: HeatFootProps) {
  const busiest = model.busiest;
  const summary =
    busiest === null
      ? heatCopy.quiet
      : heatCopy.busiest(formatPlainDate(busiest, settings, { weekday: "short", month: "short", day: "numeric" }));

  return (
    <div className={styles.foot()} data-slot="heat-month-foot">
      <span>{summary}</span>
      <span className={styles.legend()}>
        <span>{heatCopy.less}</span>
        <span aria-hidden="true" className={styles.swatches()}>
          {heatLevels.map((level) => (
            <span key={level} className={heatSwatchStyles({ level })} />
          ))}
        </span>
        <span>{heatCopy.more}</span>
      </span>
    </div>
  );
}

function WeekdayHeader({ week, settings }: WeekdayHeaderProps) {
  return (
    <div className={styles.row()} role="row">
      {week.map((tile) => (
        <span key={tile.date} className={styles.weekday()} role="columnheader">
          <span aria-hidden="true">{formatPlainDate(tile.date, settings, { weekday: "narrow" })}</span>
          <span className={styles.spoken()}>{formatPlainDate(tile.date, settings, { weekday: "long" })}</span>
        </span>
      ))}
    </div>
  );
}

function HeatSkeleton({ view }: HeatGridProps) {
  return (
    <div>
      <span className={styles.spoken()}>{heatCopy.loading}</span>
      <div aria-hidden="true" className={styles.grid()}>
        <WeekdayHeader settings={view.settings} week={view.model.weeks[0] ?? []} />
        {view.model.weeks.map((week) => (
          <div key={week[0]?.date} className={styles.row()}>
            {week.map((tile) => (
              <Skeleton key={tile.date} className={styles.skeleton()} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeatGrid({ view }: HeatGridProps) {
  const { gridRef, onKeyDown, propsFor } = view.focus;
  const title = formatPlainDate(view.month, view.settings, { month: "long", year: "numeric" });

  return (
    <div ref={gridRef} aria-label={title} className={styles.grid()} onKeyDown={onKeyDown} role="grid">
      <WeekdayHeader settings={view.settings} week={view.model.weeks[0] ?? []} />
      {view.model.weeks.map((week) => (
        <div key={week[0]?.date} className={styles.row()} role="row">
          {week.map((tile) => (
            <HeatTileButton
              key={tile.date}
              focusProps={propsFor(tile.date)}
              look={view.look}
              onSelect={view.select}
              tile={tile}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function HeatStage({ view, isLoading }: HeatStageProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const entrance = reduceMotion ? gridMotion.reduced : gridMotion.full;

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={isLoading ? "loading" : view.month}
        animate={entrance.animate}
        exit={gridMotion.exit}
        initial={entrance.initial}
        transition={entrance.transition}
      >
        {isLoading ? <HeatSkeleton view={view} /> : <HeatGrid view={view} />}
      </motion.div>
    </AnimatePresence>
  );
}

function HeatMonth(props: HeatMonthProps) {
  const view = useHeatMonth(props);
  const isLoading = props.loading ?? false;
  const total = isLoading ? null : eventCountLabel(view.model.total);

  return (
    <div aria-busy={isLoading} className={styles.root()} data-slot="heat-month" dir={view.direction}>
      <HeatHead
        onStep={view.step}
        title={formatPlainDate(view.month, view.settings, { month: "long", year: "numeric" })}
        total={total}
      />
      <HeatStage isLoading={isLoading} view={view} />
      {!isLoading && <HeatFoot model={view.model} settings={view.settings} />}
      {view.message && <LiveRegion message={view.message} />}
    </div>
  );
}

export { HeatMonth };
export { HeatLook } from "./model";
export type { HeatMonthOptions, HeatMonthProps, HeatMonthSelection } from "./props";
