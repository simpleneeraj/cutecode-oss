"use client";

import { Button } from "@cutecode/ui/components/button";
import { AltArrowLeftIcon } from "@solar-icons/react/linear/alt-arrow-left";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";

import { useMinuteClock } from "../../parts/now-line/clock";
import { NavigationSource } from "../../parts/time-grid/use-grid-navigation";
import type { TimeGridViewState } from "../../parts/time-grid/use-time-grid-view";
import { navigate } from "../../range";
import { ViewKind, type PlainDate } from "../../types";
import { DayStrip } from "./day-strip";
import { phoneStripDays } from "./layout";
import type { ZoomControl } from "./props";
import { phoneStyles } from "./style";
import { ZoomPicker } from "./zoom-picker";

type PhoneHeaderProps = {
  view: TimeGridViewState;
  date: PlainDate;
  zoom: ZoomControl;
};

const headerCopy = {
  previousWeek: "Previous week",
  nextWeek: "Next week",
  today: "Today",
};

const styles = phoneStyles();

function PhoneHeader({ view, date, zoom }: PhoneHeaderProps) {
  const now = useMinuteClock();
  const { model, navigation } = view;
  const stepWeek = (step: number) => navigation.goTo(navigate(ViewKind.Week, date, step), NavigationSource.Pointer);

  return (
    <header className={styles.header()}>
      <div className={styles.headingRow()}>
        <div className={styles.heading()}>
          <h2 className={styles.title()}>{model.heading.subtitle}</h2>
          <p className={styles.subtitle()}>{model.heading.title}</p>
        </div>
        <Button onClick={navigation.steps.onToday} size="sm" variant="gray">
          {headerCopy.today}
        </Button>
      </div>
      <div className={styles.controls()}>
        <Button aria-label={headerCopy.previousWeek} onClick={() => stepWeek(-1)} size="icon" variant="ghost">
          <AltArrowLeftIcon aria-hidden="true" className={styles.arrow()} />
        </Button>
        <ZoomPicker zoom={zoom} />
        <Button aria-label={headerCopy.nextWeek} onClick={() => stepWeek(1)} size="icon" variant="ghost">
          <AltArrowRightIcon aria-hidden="true" className={styles.arrow()} />
        </Button>
      </div>
      <DayStrip
        days={phoneStripDays(date, model.settings, now)}
        onSelect={(next) => navigation.goTo(next, NavigationSource.Pointer)}
        settings={model.settings}
      />
    </header>
  );
}

export { PhoneHeader };
