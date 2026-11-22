import { rowsLength } from "./geometry";
import type { GutterLabel } from "./gutter-labels";
import { gutterStyles } from "./style";

type GutterZoneProps = {
  labels: GutterLabel[];
  isSecondary: boolean;
  nowLabel: GutterLabel | null;
};

function GutterZone({ labels, isSecondary, nowLabel }: GutterZoneProps) {
  const styles = gutterStyles({ isSecondary });

  return (
    <div className={styles.zone()}>
      {labels.map((label) => (
        <span key={label.key} className={styles.label()} style={{ insetBlockStart: rowsLength(label.offset) }}>
          <span>{label.text}</span>
          {label.zone && <span>{label.zone}</span>}
        </span>
      ))}
      {nowLabel && (
        <span className={styles.now()} style={{ insetBlockStart: rowsLength(nowLabel.offset) }}>
          {nowLabel.text}
        </span>
      )}
    </div>
  );
}

export { GutterZone };
