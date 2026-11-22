import { Fragment } from "react";

import type { EventOccurrence } from "../../types";
import { eventKey, type FocusProps } from "../roving-focus/focus-key";
import type { GridColumn } from "./columns";
import { EventSlot } from "./event-slot";
import { chipKeyOf } from "./focus";
import type { GridModel } from "./model";
import { OverflowChip } from "./overflow-chip";

type ColumnEventsProps = {
  column: GridColumn;
  model: GridModel;
  focusPropsFor: (key: string) => FocusProps;
  onOpen: (occurrence: EventOccurrence) => void;
};

function ColumnEvents({ column, model, focusPropsFor, onOpen }: ColumnEventsProps) {
  return (
    <Fragment>
      {column.blocks.map((placement) => (
        <EventSlot
          key={`${placement.box.key}|${placement.box.date}`}
          focusProps={focusPropsFor(eventKey(placement.box.key, placement.box.date, column.focusKey))}
          model={model}
          onOpen={onOpen}
          placement={placement}
        />
      ))}
      {column.chips.map((placement) => (
        <OverflowChip
          key={`chip-${placement.chip.startMinute}`}
          focusProps={focusPropsFor(chipKeyOf(placement.chip, column.focusKey))}
          model={model}
          onOpen={onOpen}
          placement={placement}
        />
      ))}
    </Fragment>
  );
}

export { ColumnEvents };
