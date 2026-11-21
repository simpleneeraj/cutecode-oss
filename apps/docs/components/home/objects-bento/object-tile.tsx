import { Chip } from "@cutecode/ui/tactile/chip";
import { Tone } from "@cutecode/ui/tactile/tone";
import type { ReactNode } from "react";

import type { TileSpan } from "./constants";
import { objectTileStyles } from "./style";

type ObjectTileProps = {
  name: string;
  line: string;
  span: TileSpan;
  hint?: string;
  children: ReactNode;
};

export function ObjectTile({ name, line, span, hint, children }: ObjectTileProps) {
  const styles = objectTileStyles({ span });

  return (
    <article className={styles.root()}>
      <div className={styles.stage()}>
        {hint ? (
          <span className={styles.hint()}>
            <Chip tone={Tone.Gray}>{hint}</Chip>
          </span>
        ) : null}
        {children}
      </div>
      <div className={styles.text()}>
        <h3 className={styles.name()}>{name}</h3>
        <p className={styles.line()}>{line}</p>
      </div>
    </article>
  );
}
