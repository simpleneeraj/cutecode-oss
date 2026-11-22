import { Fragment } from "react";

import type { GridColumn } from "./columns";
import { bandStyle, rowsLength } from "./geometry";
import { dayColumnStyles } from "./style";

type ColumnShadingProps = {
  column: GridColumn;
  ringOffset: number | null;
};

const styles = dayColumnStyles();

function ColumnShading({ column, ringOffset }: ColumnShadingProps) {
  return (
    <Fragment>
      {column.offHours.map((band) => (
        <span key={`off-${band.top}`} aria-hidden="true" className={styles.offHours()} style={bandStyle(band)} />
      ))}
      {column.missingRows.map((row) => (
        <span
          key={`missing-${row}`}
          aria-hidden="true"
          className={styles.missing()}
          style={bandStyle({ top: row, height: 1 })}
        />
      ))}
      {column.gapRows.map((row) => (
        <span
          key={`gap-${row}`}
          aria-hidden="true"
          className={styles.gap()}
          style={{ insetBlockStart: rowsLength(row) }}
        />
      ))}
      {ringOffset !== null && (
        <span aria-hidden="true" className={styles.focusRing()} style={bandStyle({ top: ringOffset, height: 1 })} />
      )}
    </Fragment>
  );
}

export { ColumnShading };
