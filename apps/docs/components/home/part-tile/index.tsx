import type { ReactNode } from "react";

import { partTileStyles } from "./style";

type PartTileProps = {
  title: string;
  description: string;
  children: ReactNode;
};

const styles = partTileStyles();

export function PartTile({ title, description, children }: PartTileProps) {
  return (
    <article className={styles.root()}>
      <div className={styles.demo()}>{children}</div>
      <div className={styles.caption()}>
        <h3 className={styles.title()}>{title}</h3>
        <p className={styles.description()}>{description}</p>
      </div>
    </article>
  );
}
