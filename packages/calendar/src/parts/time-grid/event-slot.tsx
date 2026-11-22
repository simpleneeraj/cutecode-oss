"use client";

import { Fragment, use } from "react";

import { calendarOf } from "../../event";
import { DragKind, type EventOccurrence } from "../../types";
import { DragContext, inertDragStore } from "../drag/context";
import { DragTip } from "../drag/tip";
import { ResizeGrip } from "../drag/resize-grip";
import { useDragSourceRef } from "../drag/source";
import { isMovingLook, slotLookOf, useDragState } from "../drag/store";
import { dragSlotStyles } from "../drag/style";
import { EventBlock } from "../event-block";
import type { FocusProps } from "../roving-focus/focus-key";
import { blockStyle } from "./geometry";
import type { GridModel } from "./model";
import { canResize, type BlockPlacement } from "./placement";

type EventSlotProps = {
  placement: BlockPlacement;
  model: GridModel;
  focusProps: FocusProps;
  onOpen: (occurrence: EventOccurrence) => void;
};

function EventSlot({ placement, model, focusProps, onOpen }: EventSlotProps) {
  const drag = use(DragContext);
  const { box } = placement;
  const gridId = drag?.gridId ?? null;
  const store = drag?.store ?? inertDragStore;
  const calendar = calendarOf(box.occurrence.event, model.calendars);
  const moveRef = useDragSourceRef(gridId, box.key, box.date, DragKind.Move);
  const look = useDragState(store, (state) => slotLookOf(state, box.key, box.date));
  const styles = dragSlotStyles({ look });
  const style = blockStyle(placement);
  const isWritable = calendar?.readOnly === false && !box.marker;
  const moveHintId = isWritable ? (drag?.moveHintId ?? null) : null;
  const blockFocus = moveHintId === null ? focusProps : { ...focusProps, "aria-describedby": moveHintId };

  return (
    <Fragment>
      {isMovingLook(look) && <span aria-hidden="true" className={styles.origin()} style={style} />}
      <div ref={moveRef} className={styles.root()} data-occurrence-key={box.key} data-slot="event-slot" style={style}>
        <EventBlock box={box} calendar={calendar} focusProps={blockFocus} onOpen={onOpen} view={model.blockView} />
        {gridId !== null && isWritable && canResize(box) && <ResizeGrip date={box.date} gridId={gridId} slotKey={box.key} />}
        <DragTip date={box.date} settings={model.settings} slotKey={box.key} store={store} />
      </div>
    </Fragment>
  );
}

export { EventSlot };
