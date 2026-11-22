"use client";

import { calendarOf } from "../../event";
import type { Calendar, EventOccurrence, ViewSettings } from "../../types";
import { toneStyles } from "../tone/style";
import { resultWhen, sidebarCopy } from "./model";
import { resultsStyles } from "./style";

export type SearchState = {
  query: string;
  results: EventOccurrence[];
};

type SearchResultsProps = {
  search: SearchState;
  calendars: Calendar[];
  settings: ViewSettings;
  onOpen: (occurrence: EventOccurrence) => void;
};

const styles = resultsStyles();

function SearchResults({ search, calendars, settings, onOpen }: SearchResultsProps) {
  if (search.results.length === 0) {
    return (
      <p className={styles.empty()} role="status">
        {sidebarCopy.noResults} “{search.query.trim()}”.
      </p>
    );
  }

  return (
    <div aria-label={sidebarCopy.results} className={styles.root()} data-slot="search-results" role="group">
      <p aria-hidden="true" className={styles.heading()}>
        {sidebarCopy.results}
      </p>
      {search.results.map((occurrence) => {
        const tone = toneStyles({ tone: calendarOf(occurrence.event, calendars)?.tone });
        return (
          <button key={occurrence.key} className={styles.item()} onClick={() => onOpen(occurrence)} type="button">
            <span aria-hidden="true" className={styles.dot({ class: tone.bar() })} />
            <span className={styles.text()}>
              <span className={styles.title()}>{occurrence.event.title}</span>
              <span className={styles.when()}>{resultWhen(occurrence, settings)}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { SearchResults };
