"use client";

import { MagnifierIcon } from "@solar-icons/react/linear/magnifier";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import type { SearchTriggerProps } from "fumadocs-ui/layouts/shared/slots/search-trigger";

import { chromeStyles } from "./style";

const styles = chromeStyles();

export function SearchButton({ hideIfDisabled }: SearchTriggerProps) {
  const { enabled, setOpenSearch } = useSearchContext();
  const isHidden = hideIfDisabled && !enabled;
  if (isHidden) {
    return null;
  }

  return (
    <button aria-label="Search docs" className={styles.iconButton()} data-search="" onClick={() => setOpenSearch(true)} type="button">
      <MagnifierIcon aria-hidden="true" className={styles.icon()} />
    </button>
  );
}
