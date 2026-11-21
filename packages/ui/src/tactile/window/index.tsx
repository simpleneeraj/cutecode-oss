import type { ReactNode } from "react";

import { windowStyles } from "./style";

type WindowProps = {
  title: string;
  children: ReactNode;
};

function Window({ title, children }: WindowProps) {
  const styles = windowStyles();

  return (
    <div className={styles.root()} data-slot="window">
      <div className={styles.bar()}>
        <span aria-hidden="true" className={styles.lights()}>
          <span className={styles.closeLight()} />
          <span className={styles.minimizeLight()} />
          <span className={styles.zoomLight()} />
        </span>
        <span className={styles.title()}>{title}</span>
      </div>
      <div className={styles.body()}>{children}</div>
    </div>
  );
}

export { Window };
