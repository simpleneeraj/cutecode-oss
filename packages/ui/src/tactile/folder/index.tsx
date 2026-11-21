import type { ReactNode } from "react";

import type { Tone } from "../tone";
import { toneTint } from "../tone/style";
import { folderStyles } from "./style";

type FolderProps = {
  title: string;
  count: string;
  tone?: Tone;
  front?: ReactNode;
  children?: ReactNode;
};

function Folder({ title, count, tone, front, children }: FolderProps) {
  const styles = folderStyles();
  const hasTint = tone !== undefined;

  return (
    <div className={styles.root()} data-slot="folder">
      <div aria-hidden="true" className={styles.body()}>
        <span className={styles.tab()} />
        <span className={styles.back()} />
        {children}
        <div className={styles.front()}>
          {hasTint ? <span className={styles.tint({ class: toneTint[tone] })} /> : null}
          <div className={styles.frontContent()}>{front}</div>
        </div>
      </div>
      <span className={styles.title()}>{title}</span>
      <span className={styles.count()}>{count}</span>
    </div>
  );
}

export { Folder };
