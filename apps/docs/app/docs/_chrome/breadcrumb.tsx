"use client";

import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { getBreadcrumbItemsFromPath } from "fumadocs-core/breadcrumb";
import Link from "fumadocs-core/link";
import { useTreeContext, useTreePath } from "fumadocs-ui/contexts/tree";
import { Fragment } from "react";

import { chromeStyles } from "./style";

const styles = chromeStyles();

export function DocsBreadcrumb() {
  const path = useTreePath();
  const { root } = useTreeContext();
  const items = getBreadcrumbItemsFromPath(root, path, { includePage: true, includeSeparator: true });
  const isEmpty = items.length === 0;
  if (isEmpty) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumb()}>
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 ? <AltArrowRightIcon aria-hidden="true" className={styles.crumbIcon()} /> : null}
          {item.url ? (
            <Link className={styles.crumbLink()} href={item.url}>
              {item.name}
            </Link>
          ) : (
            <span className={styles.crumb()}>{item.name}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
