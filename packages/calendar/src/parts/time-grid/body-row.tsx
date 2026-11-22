import { use } from "react";

import type { EventOccurrence } from "../../types";
import { DragContext } from "../drag/context";
import { useDropCellRef } from "../drag/source";
import { NowLine } from "../now-line";
import { NowEmphasis } from "../now-line/emphasis";
import { CalendarSkeleton } from "../skeleton";
import { DayColumn, type ColumnFocus } from "./day-column";
import { columnsStyle } from "./geometry";
import { GutterZone } from "./gutter-zone";
import type { GridModel } from "./model";
import { gutterStyles, timeGridStyles } from "./style";

type BodyRowProps = {
  model: GridModel;
  focus: ColumnFocus;
  isBusy: boolean;
  onOpen: (occurrence: EventOccurrence) => void;
};

const styles = timeGridStyles();

function BodyRow({ model, focus, isBusy, onOpen }: BodyRowProps) {
  const isMultiDay = model.columns.length > 1;
  const faintOffset = isMultiDay ? (model.nowLabel?.offset ?? null) : null;
  const gutter = gutterStyles({ hasSecondaryZone: model.secondary !== null });
  const dropRef = useDropCellRef(use(DragContext)?.gridId ?? null, null);

  return (
    <div ref={dropRef} className={styles.bodyRow()} role="row">
      <div aria-hidden="true" className={gutter.root()} data-slot="gutter">
        {model.secondary && <GutterZone isSecondary labels={model.secondary.labels} nowLabel={null} />}
        <GutterZone isSecondary={false} labels={model.gutter} nowLabel={model.nowLabel} />
      </div>
      <div className={styles.columns()} style={columnsStyle(model.columns.length)}>
        {model.columns.map((column) => (
          <DayColumn key={column.column.day.date} column={column} focus={focus} model={model} onOpen={onOpen} />
        ))}
        {faintOffset !== null && <NowLine emphasis={NowEmphasis.Week} offset={faintOffset} />}
        {isBusy && (
          <div className={styles.busy()}>
            <CalendarSkeleton view={model.range.kind} />
          </div>
        )}
      </div>
    </div>
  );
}

export { BodyRow };
