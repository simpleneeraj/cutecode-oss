"use client";

import { MagnifierIcon } from "@solar-icons/react/linear/magnifier";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import type { FullSearchTriggerProps } from "fumadocs-ui/layouts/shared/slots/search-trigger";

import { chromeStyles } from "./style";

const styles = chromeStyles();

export function SearchField({ hideIfDisabled }: FullSearchTriggerProps) {
  const { enabled, hotKey, setOpenSearch } = useSearchContext();
  const isHidden = hideIfDisabled && !enabled;
  if (isHidden) {
    return null;
  }

  return (
    <button className={styles.searchField()} data-search-full="" onClick={() => setOpenSearch(true)} type="button">
      <MagnifierIcon aria-hidden="true" className={styles.searchIcon()} />
      <span className={styles.searchLabel()}>Search docs</span>
      <span aria-hidden="true" className={styles.searchKeys()}>
        {hotKey.map((key, index) => (
          <kbd className={styles.searchKey()} key={index}>
            {key.display}
          </kbd>
        ))}
      </span>
    </button>
  );
}
