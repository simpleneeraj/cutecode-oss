import type { NowEmphasis } from "./emphasis";
import { nowLineStyles } from "./style";

type NowLineProps = {
  offset: number;
  emphasis: NowEmphasis;
};

function NowLine({ offset, emphasis }: NowLineProps) {
  const styles = nowLineStyles({ emphasis });

  return (
    <div
      aria-hidden="true"
      className={styles.root()}
      data-slot="now-line"
      style={{ insetBlockStart: `calc(var(--hour-height) * ${offset})` }}
    >
      <span className={styles.dot()} />
      <span className={styles.line()} />
    </div>
  );
}

export { NowLine };
