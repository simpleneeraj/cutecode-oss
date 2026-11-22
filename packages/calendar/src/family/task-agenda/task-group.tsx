"use client";

import { AltArrowDownIcon } from "@solar-icons/react/linear/alt-arrow-down";
import { motion as motionTokens } from "@cutecode/ui/tokens/motion";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId } from "react";

import type { ViewSettings } from "../../types";
import { periodLabels } from "./copy";
import { taskGroupStyles } from "./style";
import type { Task, TaskGroup } from "./task";
import { TaskRow } from "./task-row";

type GroupCollapse = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

type TaskGroupSectionProps = {
  group: TaskGroup;
  settings: ViewSettings;
  collapse: GroupCollapse;
  onToggle: (task: Task) => void;
};

type GroupToggleProps = {
  group: TaskGroup;
  collapse: GroupCollapse;
  listId: string;
};

const styles = taskGroupStyles();

const groupMotion = {
  full: {
    open: { height: "auto", opacity: 1 },
    closed: { height: 0, opacity: 0 },
    transition: motionTokens.springSnappy,
  },
  reduced: { open: { opacity: 1 }, closed: { opacity: 0 }, transition: motionTokens.fade },
};

const chevronTurn = { open: 0, closed: -90 };

const instant = { duration: 0 };

function GroupToggle({ group, collapse, listId }: GroupToggleProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <button
      aria-controls={listId}
      aria-expanded={collapse.isOpen}
      className={styles.toggle()}
      onClick={() => collapse.onOpenChange(!collapse.isOpen)}
      type="button"
    >
      <motion.span
        animate={{ rotate: collapse.isOpen ? chevronTurn.open : chevronTurn.closed }}
        initial={false}
        transition={reduceMotion ? instant : motionTokens.springSnappy}
      >
        <AltArrowDownIcon aria-hidden="true" className={styles.chevron()} />
      </motion.span>
      {periodLabels[group.period]}
      <small className={styles.count()}>{group.tasks.length}</small>
    </button>
  );
}

function TaskGroupSection({ group, settings, collapse, onToggle }: TaskGroupSectionProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const shape = reduceMotion ? groupMotion.reduced : groupMotion.full;
  const listId = useId();

  return (
    <section aria-label={periodLabels[group.period]} className={styles.root()} data-slot="task-group">
      <GroupToggle collapse={collapse} group={group} listId={listId} />
      <AnimatePresence initial={false}>
        {collapse.isOpen && (
          <motion.div
            animate={shape.open}
            className={styles.list()}
            exit={shape.closed}
            id={listId}
            initial={shape.closed}
            transition={shape.transition}
          >
            {group.tasks.map((task) => (
              <TaskRow key={task.id} onToggle={onToggle} settings={settings} task={task} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export { TaskGroupSection };
