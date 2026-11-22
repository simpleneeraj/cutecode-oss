import { Fragment, use } from "react";

import { ColumnHeaderContext } from "./column-header";
import type { GridColumn } from "./columns";
import { DayHeader } from "./day-header";
import { columnsStyle } from "./geometry";
import type { GridModel } from "./model";
import { timeGridStyles } from "./style";

type HeaderRowProps = {
  model: GridModel;
  onOpenDay: ((column: GridColumn) => void) | null;
};

function HeaderRow({ model, onOpenDay }: HeaderRowProps) {
  const styles = timeGridStyles({ hasSecondaryZone: model.secondary !== null });
  const names = model.secondary?.names ?? null;
  const renderHeader = use(ColumnHeaderContext);

  return (
    <div className={styles.headerRow()} role="row">
      <div aria-hidden="true" className={styles.corner()}>
        {names && <span>{names.secondary}</span>}
        {names && <span>{names.primary}</span>}
      </div>
      <div className={styles.headers()} style={columnsStyle(model.columns.length)}>
        {model.columns.map((column) =>
          renderHeader === null ? (
            <DayHeader key={column.column.columnKey} column={column} onOpenDay={onOpenDay} settings={model.settings} />
          ) : (
            <Fragment key={column.column.columnKey}>{renderHeader(column)}</Fragment>
          ),
        )}
      </div>
    </div>
  );
}

export { HeaderRow };
