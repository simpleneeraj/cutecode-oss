"use client";

import { motion, useReducedMotion } from "motion/react";

import { pageControlMotion, pageControlStyles } from "./style";

type PageControlProps = {
  count: number;
  current: number;
};

const styles = pageControlStyles();

function PageControl({ count, current }: PageControlProps) {
  const isReducedMotion = useReducedMotion();
  const pages = Array.from({ length: count }, (_, index) => index);
  const transition = isReducedMotion ? pageControlMotion.instant : pageControlMotion.move;

  return (
    <div aria-label={`Page ${current + 1} of ${count}`} className={styles.root()} data-slot="page-control" role="img">
      {pages.map((page) => {
        const isCurrent = page === current;
        const width = isCurrent ? pageControlMotion.dotWidth.current : pageControlMotion.dotWidth.rest;
        return (
          <motion.span
            animate={{ width }}
            className={styles.dot()}
            data-current={isCurrent ? "" : undefined}
            initial={false}
            key={page}
            transition={transition}
          />
        );
      })}
    </div>
  );
}

export { PageControl };
