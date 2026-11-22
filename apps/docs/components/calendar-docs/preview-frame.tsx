"use client";

import { Switch } from "@cutecode/ui/components/switch";
import { useId, useState } from "react";

import { type ExampleId, FrameSize } from "./example-id";
import { examplePreviews } from "./previews";
import { calendarDocsStyles } from "./style";

type PreviewFrameProps = {
  id: ExampleId;
  size?: FrameSize;
  canNarrow?: boolean;
  startNarrow?: boolean;
};

const styles = calendarDocsStyles();

export function PreviewFrame({ id, size = FrameSize.Tall, canNarrow = false, startNarrow = false }: PreviewFrameProps) {
  const [isNarrow, setIsNarrow] = useState(startNarrow);
  const labelId = useId();
  const Preview = examplePreviews[id];

  return (
    <div className={styles.root()}>
      {canNarrow ? (
        <div className={styles.toolbar()}>
          <span id={labelId}>Narrow frame</span>
          <Switch aria-labelledby={labelId} checked={isNarrow} onCheckedChange={setIsNarrow} />
        </div>
      ) : null}
      <div className={styles.frame({ size, isNarrow })}>
        <Preview />
      </div>
    </div>
  );
}
