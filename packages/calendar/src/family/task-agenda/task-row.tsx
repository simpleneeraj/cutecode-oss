import { BellIcon } from "@solar-icons/react/bold-duotone/bell";
import { CalendarIcon } from "@solar-icons/react/bold-duotone/calendar";
import { CupIcon } from "@solar-icons/react/bold-duotone/cup";
import { DocumentTextIcon } from "@solar-icons/react/bold-duotone/document-text";
import { DumbbellIcon } from "@solar-icons/react/bold-duotone/dumbbell";
import { NotebookIcon } from "@solar-icons/react/bold-duotone/notebook";
import { Widget2Icon } from "@solar-icons/react/bold-duotone/widget-2";
import type { Icon } from "@solar-icons/react/lib/types";
import { CheckIcon } from "@solar-icons/react/linear/check";

import { formatClock } from "../../locale";
import type { ViewSettings } from "../../types";
import { taskCopy } from "./copy";
import { taskRowStyles } from "./style";
import { TaskGlyph, TaskStatus, type Task } from "./task";

type TaskRowProps = {
  task: Task;
  settings: ViewSettings;
  onToggle: (task: Task) => void;
};

const taskGlyphs: Record<TaskGlyph, Icon> = {
  [TaskGlyph.Coffee]: CupIcon,
  [TaskGlyph.Workout]: DumbbellIcon,
  [TaskGlyph.Design]: Widget2Icon,
  [TaskGlyph.Document]: DocumentTextIcon,
  [TaskGlyph.Notes]: NotebookIcon,
  [TaskGlyph.Calendar]: CalendarIcon,
  [TaskGlyph.Reminder]: BellIcon,
};

function TaskRow({ task, settings, onToggle }: TaskRowProps) {
  const styles = taskRowStyles({ status: task.status });
  const Glyph = taskGlyphs[task.glyph];
  const isDone = task.status === TaskStatus.Done;
  const isPending = task.status === TaskStatus.Pending;

  return (
    <button
      aria-checked={isDone}
      className={styles.root()}
      data-slot="task-row"
      onClick={() => onToggle(task)}
      role="checkbox"
      type="button"
    >
      <span aria-hidden="true" className={styles.box()}>
        {isDone && <CheckIcon className={styles.check()} strokeWidth={3} />}
      </span>
      <span className={styles.title()}>{task.title}</span>
      {isPending && <span className={styles.spoken()}>{`, ${taskCopy.pending}`}</span>}
      <time className={styles.time()}>{formatClock(task.time, settings)}</time>
      <span aria-hidden="true" className={styles.glyph()}>
        <Glyph className={styles.glyphIcon()} />
      </span>
    </button>
  );
}

export { TaskRow };
