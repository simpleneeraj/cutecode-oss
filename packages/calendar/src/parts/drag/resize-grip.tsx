"use client";

import { DragKind, type PlainDate } from "../../types";
import { useDragSourceRef } from "./source";
import { resizeGripStyles } from "./style";

type ResizeGripProps = {
  gridId: string;
  slotKey: string;
  date: PlainDate;
};

const styles = resizeGripStyles();

function ResizeGrip({ gridId, slotKey, date }: ResizeGripProps) {
  const gripRef = useDragSourceRef(gridId, slotKey, date, DragKind.Resize);

  return (
    <span ref={gripRef} aria-hidden="true" className={styles.root()} data-slot="resize-grip">
      <span className={styles.bar()} />
    </span>
  );
}

export { ResizeGrip };
