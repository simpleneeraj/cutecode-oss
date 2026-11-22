"use client";

import { pinch, type PinchInfo } from "motion/react";
import { useCallback } from "react";

import { calendarOf } from "../../event";
import { BodyRow } from "../../parts/time-grid/body-row";
import { FoldPill } from "../../parts/time-grid/fold-pill";
import { barKeyOf, shownBars } from "../../parts/time-grid/focus";
import { hourHeightStyle } from "../../parts/time-grid/geometry";
import { SpanBar } from "../../parts/time-grid/span-bar";
import type { TimeGridViewState } from "../../parts/time-grid/use-time-grid-view";
import { CalendarStatusKind } from "../../parts/state/status";
import { pinchedZoom } from "./layout";
import type { ZoomControl } from "./props";
import { timelineStyles } from "./style";

type PhoneTimelineProps = {
  view: TimeGridViewState;
  zoom: ZoomControl;
};

type AllDayRowProps = {
  view: TimeGridViewState;
  bars: ReturnType<typeof shownBars>;
};

const timelineCopy = {
  allDay: "all-day",
};

const pinchOptions = { scale: false, rotate: false, pan: false };

const styles = timelineStyles();

function usePinchZoom({ value, onChange }: ZoomControl) {
  return useCallback(
    (element: HTMLElement | null) => {
      if (element === null) {
        return undefined;
      }
      const changeOnRelease = () => ({
        onComplete: (_: Event, info: PinchInfo) => {
          const next = pinchedZoom(value, info.scale);
          if (next !== value) {
            onChange(next);
          }
        },
      });
      return pinch(element, changeOnRelease, pinchOptions);
    },
    [value, onChange],
  );
}

function AllDayRow({ view, bars }: AllDayRowProps) {
  const { model, keyboard, actions } = view;

  return (
    <div role="row">
      <div aria-label={timelineCopy.allDay} className={styles.allDay()} role="gridcell">
        {bars.map((bar) => (
          <SpanBar
            key={`${bar.key}|${bar.startIndex}`}
            bar={bar}
            calendar={calendarOf(bar.occurrence.event, model.calendars)}
            focusProps={keyboard.focus.focusPropsFor(barKeyOf(bar, model))}
            onOpen={actions.onOpen}
            view={model.blockView}
          />
        ))}
      </div>
    </div>
  );
}

function PhoneTimeline({ view, zoom }: PhoneTimelineProps) {
  const { model, keyboard, actions, gridRef, status } = view;
  const pinchRef = usePinchZoom(zoom);
  const [earlier, later] = model.pills;
  const bars = shownBars(model);
  const columnCount = model.columns.length;
  const isBusy = status.kind === CalendarStatusKind.Loading;

  return (
    <div ref={pinchRef} className={styles.pinch()} data-slot="phone-pinch">
    <div
      ref={gridRef}
      aria-busy={isBusy}
      aria-label={`${model.heading.subtitle}, ${model.heading.title}`}
      className={styles.root()}
      data-slot="phone-timeline"
      onBlur={keyboard.onBlur}
      onFocusCapture={keyboard.onFocusCapture}
      onKeyDown={keyboard.onKeyDown}
      role="grid"
      style={hourHeightStyle(model.blockView.hourHeight)}
    >
      {bars.length > 0 && <AllDayRow bars={bars} view={view} />}
      <div role="rowgroup">
        {earlier && <FoldPill columnCount={columnCount} onToggle={actions.onToggleFold} pill={earlier} />}
        <BodyRow focus={keyboard.focus} isBusy={isBusy} model={model} onOpen={actions.onOpen} />
        {later && <FoldPill columnCount={columnCount} onToggle={actions.onToggleFold} pill={later} />}
      </div>
    </div>
    </div>
  );
}

export { PhoneTimeline };
