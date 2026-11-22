"use client";

import { Skeleton } from "@cutecode/ui/components/skeleton";

import { dayCellName } from "../../announce";
import { formatPlainDate } from "../../locale";
import { fallbackDateOf } from "../../parts/date-grid/fallback";
import { useDateGridFocus, type DateCellFocus } from "../../parts/date-grid/use-date-grid-focus";
import type { FamilySettings } from "../../parts/family-options/use-family-settings";
import type { PlainDate, ViewSettings } from "../../types";
import { TileKind, type TileDay } from "./model";
import { tileGridStyles } from "./style";

type TileGridProps = {
  weeks: TileDay[][];
  family: FamilySettings;
  isLoading: boolean;
  onSelect: (date: PlainDate) => void;
  onReveal: (date: PlainDate) => void;
};

type TileCellProps = {
  tile: TileDay;
  settings: ViewSettings;
  focus: DateCellFocus;
  isLoading: boolean;
  onSelect: (date: PlainDate) => void;
};

type WeekdayHeaderProps = {
  week: TileDay[];
  settings: ViewSettings;
};

type TileLinesProps = {
  tile: TileDay;
};

const styles = tileGridStyles();

function TileLines({ tile }: TileLinesProps) {
  if (tile.lines.length === 0) {
    return null;
  }
  return (
    <span aria-hidden="true" className={styles.lines()}>
      {tile.lines.map((line) => (
        <i key={line.key} className={tileGridStyles({ kind: tile.kind, isAccent: line.isAccent }).line()} />
      ))}
    </span>
  );
}

function TileCell({ tile, settings, focus, isLoading, onSelect }: TileCellProps) {
  const { day } = tile;
  const number = formatPlainDate(day.date, settings, { day: "numeric" });
  const tileStyles = tileGridStyles({ kind: tile.kind, isToday: day.today });
  if (tile.kind === TileKind.Outside) {
    return (
      <div className={styles.cell()} role="gridcell">
        <span aria-hidden="true" className={tileStyles.tile()}>
          {number}
        </span>
      </div>
    );
  }
  return (
    <div aria-selected={day.selected} className={styles.cell()} role="gridcell">
      <button
        {...focus}
        aria-current={day.today ? "date" : undefined}
        aria-label={dayCellName(day.date, tile.eventCount, settings)}
        className={tileStyles.tile()}
        onClick={() => onSelect(day.date)}
        type="button"
      >
        {isLoading ? <Skeleton className={styles.skeleton()} /> : <span aria-hidden="true">{number}</span>}
        <TileLines tile={tile} />
      </button>
    </div>
  );
}

function WeekdayHeader({ week, settings }: WeekdayHeaderProps) {
  return (
    <div className={styles.row()} role="row">
      {week.map((tile) => (
        <span key={tile.day.date} className={styles.weekday()} role="columnheader">
          <span aria-hidden="true">{formatPlainDate(tile.day.date, settings, { weekday: "narrow" })}</span>
          <span className={styles.spoken()}>{formatPlainDate(tile.day.date, settings, { weekday: "long" })}</span>
        </span>
      ))}
    </div>
  );
}

function shownDates(weeks: TileDay[][], today: PlainDate | null) {
  const days = weeks.flat().map((tile) => tile.day);
  const dates = days.filter((day) => day.inMonth).map((day) => day.date);
  const selected = days.find((day) => day.selected)?.date ?? null;
  return { dates, fallbackDate: fallbackDateOf(dates, [selected, today]) };
}

function TileGrid({ weeks, family, isLoading, onSelect, onReveal }: TileGridProps) {
  const { settings, direction, today } = family;
  const { dates, fallbackDate } = shownDates(weeks, today);
  const { gridRef, onKeyDown, cellFocus } = useDateGridFocus({
    dates,
    fallbackDate,
    direction,
    timeZone: settings.timeZone,
    onReveal,
  });
  const title = formatPlainDate(fallbackDate, settings, { month: "long", year: "numeric" });

  return (
    <div
      ref={gridRef}
      aria-busy={isLoading}
      aria-label={title}
      className={styles.root()}
      onKeyDown={onKeyDown}
      role="grid"
    >
      <WeekdayHeader settings={settings} week={weeks[0] ?? []} />
      {weeks.map((week) => (
        <div key={week[0]?.day.date} className={styles.row()} role="row">
          {week.map((tile) => (
            <TileCell
              key={tile.day.date}
              focus={cellFocus(tile.day.date)}
              isLoading={isLoading}
              onSelect={onSelect}
              settings={settings}
              tile={tile}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export { TileGrid };
