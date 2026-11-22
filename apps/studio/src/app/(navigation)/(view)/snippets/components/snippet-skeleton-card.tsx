"use client";

import { Skeleton } from "@cutecode/ui/components/skeleton";
import { snippetCardStyles } from "../style";

const styles = snippetCardStyles();

export function SnippetSkeletonCard() {
  return (
    <div className={styles.link()}>
      <Skeleton className={styles.preview()} />
      <div className={styles.meta()}>
        <Skeleton className={styles.titleLine()} />
        <Skeleton className={styles.detailLine()} />
      </div>
    </div>
  );
}
