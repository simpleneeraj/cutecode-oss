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

  return (
    <div className={styles.headerRow()} role="row">
      <div aria-hidden="true" className={styles.corner()}>
        {names && <span>{names.secondary}</span>}
        {names && <span>{names.primary}</span>}
      </div>
      <div className={styles.headers()} style={columnsStyle(model.columns.length)}>
        {model.columns.map((column) => (
          <DayHeader key={column.column.day.date} column={column} onOpenDay={onOpenDay} settings={model.settings} />
        ))}
      </div>
    </div>
  );
}

export { HeaderRow };
