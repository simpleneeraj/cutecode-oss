"use client";

import { Skeleton } from "@cutecode/ui/components/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@cutecode/ui/components/toggle-group";
import { useState } from "react";

import { formatPlainDate, resolveSettings, textDirectionOf } from "../../locale";
import { LiveRegion } from "../../parts/live-region";
import { useLiveMessage } from "../../parts/live-region/use-announcer";
import { useMinuteClock } from "../../parts/now-line/clock";
import { ContentSwap } from "../../parts/view-motion/content-swap";
import { dateOf, parseDateTime } from "../../time";
import type { PlainDate, ViewSettings } from "../../types";
import { AgendaBar } from "./agenda-bar";
import { emptyCopy, filterLabels, noTasksCopy, taskCopy } from "./copy";
import type { TaskAgendaProps } from "./props";
import { taskAgendaStyles } from "./style";
import {
  groupTasks,
  hasTasksOn,
  TaskFilter,
  taskFilters,
  TaskStatus,
  tasksShown,
  type Task,
  type TaskPeriod,
} from "./task";
import { TaskGroupSection } from "./task-group";
import { AgendaWeekStrip } from "./week-strip";

type TaskListProps = {
  tasks: Task[];
  filter: TaskFilter;
  hasDayTasks: boolean;
  settings: ViewSettings;
  onToggle: (task: Task) => void;
};

type FilterControlProps = {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
};

type AgendaHeadProps = {
  value: PlainDate;
  today: PlainDate;
  settings: ViewSettings;
};

const styles = taskAgendaStyles();

const skeletonIds = ["first", "second", "third"];

function isTaskFilter(value: unknown): value is TaskFilter {
  return taskFilters.some((filter) => filter === value);
}

function TaskList({ tasks, filter, hasDayTasks, settings, onToggle }: TaskListProps) {
  const [closed, setClosed] = useState<TaskPeriod[]>([]);
  const groups = groupTasks(tasks);
  if (groups.length === 0) {
    const empty = hasDayTasks ? emptyCopy[filter] : noTasksCopy;
    return (
      <div className={styles.empty()} data-slot="task-empty">
        <strong className={styles.emptyTitle()}>{empty.title}</strong>
        <span className={styles.emptyText()}>{empty.description}</span>
      </div>
    );
  }
  const openChange = (period: TaskPeriod, isOpen: boolean) =>
    setClosed((current) => (isOpen ? current.filter((item) => item !== period) : [...current, period]));
  return groups.map((group) => (
    <TaskGroupSection
      key={group.period}
      collapse={{ isOpen: !closed.includes(group.period), onOpenChange: (isOpen) => openChange(group.period, isOpen) }}
      group={group}
      onToggle={onToggle}
      settings={settings}
    />
  ));
}

function TaskSkeleton() {
  return (
    <div className={styles.skeletons()}>
      <span className={styles.spoken()}>{taskCopy.loading}</span>
      {skeletonIds.map((id) => (
        <Skeleton key={id} aria-hidden="true" className={styles.skeleton()} />
      ))}
    </div>
  );
}

function AgendaHead({ value, today, settings }: AgendaHeadProps) {
  const title = value === today ? taskCopy.today : formatPlainDate(value, settings, { weekday: "long" });

  return (
    <div className={styles.head()}>
      <small className={styles.date()}>
        {formatPlainDate(value, settings, { weekday: "long", month: "short", day: "numeric" })}
      </small>
      <h2 className={styles.title()}>{title}</h2>
    </div>
  );
}

function FilterControl({ filter, onFilterChange }: FilterControlProps) {
  const choose = (values: unknown[]) => {
    const [next] = values;
    if (isTaskFilter(next)) {
      onFilterChange(next);
    }
  };

  return (
    <ToggleGroup aria-label={taskCopy.filter} className={styles.filter()} onValueChange={choose} value={[filter]}>
      {taskFilters.map((item) => (
        <ToggleGroupItem key={item} className={styles.filterItem()} value={item}>
          {filterLabels[item]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

function useTaskAgenda({ selection, actions, options, state = {} }: TaskAgendaProps) {
  const settings = resolveSettings(options);
  const pinned = options.now === undefined ? undefined : parseDateTime(options.now, settings.timeZone);
  const now = useMinuteClock(pinned);
  const [filter, setFilter] = useState(state.initialFilter ?? TaskFilter.Todo);
  const live = useLiveMessage();
  const toggle = (task: Task) => {
    live.speak(task.status === TaskStatus.Done ? taskCopy.reopened(task.title) : taskCopy.done(task.title));
    actions.onTaskToggle(task);
  };
  return {
    settings,
    direction: textDirectionOf(settings.locale),
    today: now === null ? selection.value : dateOf(now, settings.timeZone),
    filter,
    setFilter,
    toggle,
    message: live.message,
    isLoading: state.loading ?? false,
  };
}

function TaskAgenda(props: TaskAgendaProps) {
  const { tasks, selection, actions, state } = props;
  const agenda = useTaskAgenda(props);
  const { settings, filter, isLoading } = agenda;

  return (
    <div className={styles.root()} data-slot="task-agenda" dir={agenda.direction}>
      <AgendaHead settings={settings} today={agenda.today} value={selection.value} />
      <AgendaWeekStrip direction={agenda.direction} selection={selection} settings={settings} today={agenda.today} />
      <FilterControl filter={filter} onFilterChange={agenda.setFilter} />
      <div aria-busy={isLoading} className={styles.body()} data-slot="task-body">
        <ContentSwap swapKey={isLoading ? "loading" : "ready"}>
          {isLoading ? (
            <TaskSkeleton />
          ) : (
            <TaskList
              filter={filter}
              hasDayTasks={hasTasksOn(tasks, selection.value)}
              onToggle={agenda.toggle}
              settings={settings}
              tasks={tasksShown(tasks, selection.value, filter)}
            />
          )}
        </ContentSwap>
      </div>
      <AgendaBar navigation={state?.navigation} onTaskAdd={actions.onTaskAdd} />
      <LiveRegion message={agenda.message} />
    </div>
  );
}

export { TaskAgenda };
export type { AgendaNavigation, TaskActions, TaskAgendaOptions, TaskAgendaProps, TaskAgendaState } from "./props";
export { AgendaTab } from "./props";
export { TaskFilter, TaskGlyph, TaskPeriod, TaskStatus, toggledStatus, toggleTask, type Task } from "./task";
