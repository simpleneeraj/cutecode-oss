"use client";

import type { VirtualItem } from "@tanstack/react-virtual";
import type { CSSProperties } from "react";

import { AgendaItemKind, type AgendaItem } from "../../agenda/virtual";
import { calendarOf } from "../../event";
import { ViewKind, type Calendar, type EventOccurrence, type PlainDate, type ViewSettings } from "../../types";
import type { BlockView } from "../event-block/appearance";
import { CalendarSkeleton } from "../skeleton";
import { CalendarEmpty } from "../state/empty";
import { AgendaRow } from "./agenda-row";
import { agendaCopy, dayHeading } from "./row-text";
import { agendaHeaderStyles, agendaListStyles } from "./style";
import { useAgendaScroll } from "./use-agenda-scroll";
import type { AgendaItemsSource } from "./use-agenda-items";

export type AgendaListContext = {
  anchor: PlainDate;
  today: PlainDate | null;
  view: BlockView;
  calendars: Calendar[];
  onOpen: (occurrence: EventOccurrence) => void;
};

type AgendaListProps = {
  list: AgendaListContext;
  source: AgendaItemsSource;
  isBusy: boolean;
};

type AgendaSlotProps = {
  item: AgendaItem;
  virtualItem: VirtualItem;
  isSticky: boolean;
  list: AgendaListContext;
};

type AgendaHeaderProps = {
  date: PlainDate;
  settings: ViewSettings;
  isToday: boolean;
};

const styles = agendaListStyles();
const headerStyles = agendaHeaderStyles();

function AgendaHeader({ date, settings, isToday }: AgendaHeaderProps) {
  const heading = dayHeading(date, settings);

  return (
    <div className={headerStyles.root()} data-slot="agenda-header">
      <h3 className={headerStyles.title()}>{heading.title}</h3>
      <span className={headerStyles.subtitle()}>{heading.subtitle}</span>
      {isToday && <span className={headerStyles.today()}>{agendaCopy.today}</span>}
    </div>
  );
}

function slotStyle(virtualItem: VirtualItem, isSticky: boolean): CSSProperties {
  return isSticky ? {} : { transform: `translateY(${virtualItem.start}px)` };
}

function AgendaSlot({ item, virtualItem, isSticky, list }: AgendaSlotProps) {
  const slot = styles.slot({ isSticky });
  if (item.kind === AgendaItemKind.Header) {
    return (
      <div className={slot} style={slotStyle(virtualItem, isSticky)}>
        <AgendaHeader date={item.date} isToday={item.date === list.today} settings={list.view.settings} />
      </div>
    );
  }
  return (
    <div className={styles.rowInset({ class: slot })} style={slotStyle(virtualItem, isSticky)}>
      <AgendaRow
        calendar={calendarOf(item.row.occurrence.event, list.calendars)}
        onOpen={list.onOpen}
        row={item.row}
        view={list.view}
      />
    </div>
  );
}

type AgendaTrackProps = {
  scroll: ReturnType<typeof useAgendaScroll>;
  list: AgendaListContext;
};

function AgendaTrack({ scroll, list }: AgendaTrackProps) {
  const { items, virtualizer, stickyIndex } = scroll;
  return (
    <div className={styles.track()} style={{ blockSize: virtualizer.getTotalSize() }}>
      {virtualizer.getVirtualItems().map((virtualItem) => {
        const item = items[virtualItem.index];
        return item === undefined ? null : (
          <AgendaSlot
            key={virtualItem.key}
            isSticky={virtualItem.index === stickyIndex}
            item={item}
            list={list}
            virtualItem={virtualItem}
          />
        );
      })}
    </div>
  );
}

function AgendaList({ list, source, isBusy }: AgendaListProps) {
  const scroll = useAgendaScroll({ anchor: list.anchor, itemsFor: source.itemsFor });
  const { scrollRef, onScroll } = scroll;
  const hasItems = scroll.items.length > 0;
  if (!hasItems && isBusy) {
    return (
      <div aria-busy="true">
        <CalendarSkeleton view={ViewKind.Agenda} />
      </div>
    );
  }
  if (!hasItems) {
    return (
      <div className={styles.empty()}>
        <CalendarEmpty description={agendaCopy.emptyDescription} title={agendaCopy.empty} />
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      aria-busy={isBusy}
      aria-label={agendaCopy.label}
      className={styles.scroller()}
      data-slot="agenda-list"
      onScroll={onScroll}
      role="region"
      tabIndex={-1}
    >
      <AgendaTrack list={list} scroll={scroll} />
    </div>
  );
}

export { AgendaList };
