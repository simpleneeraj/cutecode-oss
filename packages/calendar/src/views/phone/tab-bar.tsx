"use client";

import { tabBarStyles } from "@cutecode/ui/tactile/tab-bar/style";
import { CalendarIcon } from "@solar-icons/react/bold-duotone/calendar";
import { CalendarMarkIcon } from "@solar-icons/react/bold-duotone/calendar-mark";
import { ListIcon } from "@solar-icons/react/bold-duotone/list";
import type { Icon } from "@solar-icons/react/lib/types";

import { ViewKind } from "../../types";
import { viewOptions } from "../../parts/calendar-toolbar/view-options";

type PhoneTabBarProps = {
  tabs: ViewKind[];
  current: ViewKind;
  onSelect: (view: ViewKind) => void;
};

const tabIcons: Partial<Record<ViewKind, Icon>> = {
  [ViewKind.Day]: CalendarIcon,
  [ViewKind.Month]: CalendarMarkIcon,
  [ViewKind.Agenda]: ListIcon,
};

const tabCopy = {
  label: "Views",
};

const styles = tabBarStyles();

function PhoneTabBar({ tabs, current, onSelect }: PhoneTabBarProps) {
  const options = viewOptions.filter((option) => tabs.includes(option.view));

  return (
    <nav aria-label={tabCopy.label} className={styles.root()} data-slot="phone-tab-bar">
      {options.map((option) => {
        const Glyph = tabIcons[option.view] ?? CalendarIcon;
        const isCurrent = option.view === current;
        return (
          <button
            key={option.view}
            aria-current={isCurrent ? "page" : undefined}
            className={styles.tab()}
            data-current={isCurrent ? "" : undefined}
            onClick={() => onSelect(option.view)}
            type="button"
          >
            <Glyph aria-hidden="true" className={styles.icon()} />
            <span className={styles.label()}>{option.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export { PhoneTabBar };
