"use client";

import { CalendarToolbar } from "@cutecode/calendar/parts/calendar-toolbar";
import { LiveRegion } from "@cutecode/calendar/parts/live-region";
import { CalendarError } from "@cutecode/calendar/parts/state/error";
import { CalendarStatusKind } from "@cutecode/calendar/parts/state/status";
import { ViewSwitch } from "@cutecode/calendar/parts/view-motion";
import { formatPlainDate } from "@cutecode/calendar/locale";
import type { PlainDate, ViewSettings } from "@cutecode/calendar/types";

import { HeatLevel } from "../../heat/aggregate";
import { eventCountLabel, type YearModel } from "./model";
import { YearMonths } from "./months";
import type { YearViewProps } from "./props";
import { heatLegendStyles, heatSwatchStyles, yearViewStyles } from "./style";
import { useYearView } from "./use-year-view";

type YearFootProps = {
  model: YearModel;
  settings: ViewSettings;
  readoutDate: PlainDate;
  isEmpty: boolean;
};

const footCopy = {
  empty: "Nothing planned this year.",
  summary: (year: string, total: string) => `${year}: ${total} events`,
  busiest: (month: string) => `, busiest in ${month}`,
  less: "Less",
  more: "More",
};

const heatLevels = Object.values(HeatLevel);

const styles = yearViewStyles();

const legendStyles = heatLegendStyles();

function HeatLegend() {
  return (
    <span className={legendStyles.root()} data-slot="heat-legend">
      <span>{footCopy.less}</span>
      <span aria-hidden="true" className={legendStyles.swatches()}>
        {heatLevels.map((level) => (
          <span key={level} className={heatSwatchStyles({ level })} />
        ))}
      </span>
      <span>{footCopy.more}</span>
    </span>
  );
}

function summaryOf(model: YearModel, settings: ViewSettings): string {
  const total = new Intl.NumberFormat(settings.locale).format(model.total);
  const busiest = model.busiestMonth === null ? "" : footCopy.busiest(model.busiestMonth);
  return `${footCopy.summary(model.year, total)}${busiest}`;
}

function YearFoot({ model, settings, readoutDate, isEmpty }: YearFootProps) {
  const count = model.days.get(readoutDate)?.count ?? 0;
  const day = formatPlainDate(readoutDate, settings, { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className={styles.foot()} data-slot="year-foot">
      <span>{isEmpty ? footCopy.empty : summaryOf(model, settings)}</span>
      <span aria-hidden="true" className={styles.readout()}>
        {`${day}: ${eventCountLabel(count)}`}
      </span>
      <HeatLegend />
    </div>
  );
}

function YearView(props: YearViewProps) {
  const { model, settings, direction, message, navigation, status, list, focus, cellEvents, readoutDate, isBusy, isEmpty } =
    useYearView(props);

  return (
    <div className={styles.root()} data-slot="year-view" dir={direction}>
      <CalendarToolbar
        heading={{ title: model.year, subtitle: eventCountLabel(model.total) }}
        onViewChange={navigation.changeView}
        steps={navigation.steps}
        view={props.navigation.view}
        views={navigation.views}
      />
      <div className={styles.surface()}>
        <ViewSwitch kind={navigation.viewSwitch.kind} surfaceRef={navigation.viewSwitch.surfaceRef} viewKey={model.year}>
          {status.kind === CalendarStatusKind.Failed ? (
            <CalendarError onRetry={status.onRetry} />
          ) : (
            <div aria-busy={isBusy} aria-label={model.year} data-slot="year-months" role="group" {...cellEvents}>
              <YearMonths focusRef={focus.focusRef} focusedDate={focus.active} list={list} model={model} />
            </div>
          )}
        </ViewSwitch>
        <YearFoot isEmpty={isEmpty} model={model} readoutDate={readoutDate} settings={settings} />
      </div>
      {message && <LiveRegion message={message} />}
    </div>
  );
}

export { YearView };
export type { YearOptions, YearViewProps } from "./props";
