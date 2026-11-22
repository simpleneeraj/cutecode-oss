"use client";

import { Skeleton } from "@cutecode/ui/components/skeleton";
import type { ReactNode } from "react";

import { formatDayLabel } from "../../../locale";
import { ContentSwap } from "../../../parts/view-motion/content-swap";
import type { TextDirection, ViewSettings } from "../../../types";
import { widgetCopy, type WidgetDay } from "./model";
import type { WidgetSize } from "./props";
import { widgetCardStyles, widgetPlaceholderStyles } from "./style";

export type WidgetView = {
  settings: ViewSettings;
  day: WidgetDay | null;
  isPlaceholder: boolean;
  direction: TextDirection;
};

type WidgetShellProps = {
  size: WidgetSize;
  view: WidgetView;
  placeholderLineIds: string[];
  accessory?: ReactNode;
  children: (day: WidgetDay) => ReactNode;
};

type WidgetPlaceholderProps = {
  lineIds: string[];
};

const placeholderStyles = widgetPlaceholderStyles();

function WidgetPlaceholder({ lineIds }: WidgetPlaceholderProps) {
  return (
    <div className={placeholderStyles.root()} data-slot="widget-placeholder">
      <span className={placeholderStyles.spoken()}>{widgetCopy.loading}</span>
      <Skeleton aria-hidden="true" className={placeholderStyles.label()} />
      <Skeleton aria-hidden="true" className={placeholderStyles.number()} />
      {lineIds.map((id) => (
        <Skeleton key={id} aria-hidden="true" className={placeholderStyles.line()} />
      ))}
    </div>
  );
}

function WidgetShell({ size, view, placeholderLineIds, accessory, children }: WidgetShellProps) {
  const shownDay = view.isPlaceholder ? null : view.day;
  const label = shownDay === null ? undefined : formatDayLabel(shownDay.today, view.settings);

  return (
    <section
      aria-busy={view.isPlaceholder}
      aria-label={label}
      className={widgetCardStyles({ size })}
      data-slot="calendar-widget"
      data-size={size}
      dir={view.direction}
    >
      {accessory}
      <ContentSwap swapKey={shownDay === null ? "placeholder" : "ready"}>
        {shownDay === null ? <WidgetPlaceholder lineIds={placeholderLineIds} /> : children(shownDay)}
      </ContentSwap>
    </section>
  );
}

export { WidgetShell };
