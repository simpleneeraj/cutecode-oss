"use client";

import { CloseCircleIcon } from "@solar-icons/react/linear/close-circle";
import { Button } from "@cutecode/ui/components/button";
import { Input } from "@cutecode/ui/components/input";
import type { KeyboardEvent } from "react";

import { sidebarCopy } from "./model";
import { SidebarFade } from "./fade";
import { sidebarStyles } from "./style";

export type SearchField = {
  query: string;
  setQuery: (query: string) => void;
};

type SidebarSearchProps = {
  search: SearchField;
};

const styles = sidebarStyles();

function SidebarSearch({ search }: SidebarSearchProps) {
  const clearOnEscape = (event: KeyboardEvent<HTMLInputElement>) => {
    const isEscape = event.key === "Escape";
    if (isEscape) {
      search.setQuery("");
    }
  };

  return (
    <div className={styles.search()} role="search">
      <Input
        aria-label={sidebarCopy.search}
        className={styles.field()}
        data-calendar-search=""
        onChange={(event) => search.setQuery(event.target.value)}
        onKeyDown={clearOnEscape}
        placeholder={sidebarCopy.search}
        type="search"
        value={search.query}
      />
      <SidebarFade fadeKey={search.query === "" ? null : "clear"}>
        <Button aria-label={sidebarCopy.clearSearch} onClick={() => search.setQuery("")} size="icon-sm" variant="ghost">
          <CloseCircleIcon aria-hidden="true" />
        </Button>
      </SidebarFade>
    </div>
  );
}

export { SidebarSearch };
