"use client";

import { usePathname } from "fumadocs-core/framework";
import Link from "fumadocs-core/link";
import type { Item } from "fumadocs-core/page-tree";
import { useFooterItems } from "fumadocs-ui/utils/use-footer-items";

import { chromeStyles } from "./style";

const styles = chromeStyles();

function trimSlash(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function DocsPager() {
  const items = useFooterItems();
  const pathname = trimSlash(usePathname());
  const index = items.findIndex((item) => trimSlash(item.url) === pathname);
  const isUnlisted = index === -1;
  if (isUnlisted) {
    return null;
  }

  const previous: Item | undefined = items[index - 1];
  const next: Item | undefined = items[index + 1];

  return (
    <nav aria-label="Pages" className={styles.pager()}>
      {previous ? (
        <Link className={styles.pagerCard()} href={previous.url}>
          <span className={styles.pagerLabel()}>Previous</span>
          <span className={styles.pagerTitle()}>{previous.name}</span>
        </Link>
      ) : null}
      {next ? (
        <Link className={styles.pagerCard({ className: styles.pagerNext() })} href={next.url}>
          <span className={styles.pagerLabel()}>Next</span>
          <span className={styles.pagerTitle()}>{next.name}</span>
        </Link>
      ) : null}
    </nav>
  );
}
