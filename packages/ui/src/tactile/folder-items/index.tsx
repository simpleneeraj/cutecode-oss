"use client";

import { motion, useReducedMotion } from "motion/react";

import { type FolderItem, folderItemPositions, folderItemsStyles, paperLineIds, readFolderItemVariants } from "./style";

type FolderItemsProps = {
  items: FolderItem[];
};

function FolderItems({ items }: FolderItemsProps) {
  const isReducedMotion = useReducedMotion();
  const placedItems = folderItemPositions
    .slice(0, items.length)
    .map((position, index) => ({ position, index, item: items[index] }));

  return (
    <span aria-hidden="true" className={folderItemsStyles().root()} data-slot="folder-items">
      {placedItems.map(({ position, index, item }) => {
        const styles = folderItemsStyles({ item, position });
        return (
          <motion.span
            className={styles.item()}
            key={position}
            variants={isReducedMotion ? undefined : readFolderItemVariants(position, index)}
          >
            <span className={styles.photo()}>
              <span className={styles.firstBlob()} />
              <span className={styles.secondBlob()} />
            </span>
            <span className={styles.lines()}>
              {paperLineIds.map((lineId) => (
                <span className={styles.line()} key={lineId} />
              ))}
            </span>
          </motion.span>
        );
      })}
    </span>
  );
}

export { FolderItems };
