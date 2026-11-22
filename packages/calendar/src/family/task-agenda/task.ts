import type { ClockTime, PlainDate } from "../../types";

export enum TaskStatus {
  Todo = "todo",
  Done = "done",
  Pending = "pending",
}

export enum TaskPeriod {
  Morning = "morning",
  Workload = "workload",
  Night = "night",
}

export enum TaskFilter {
  Todo = "todo",
  Completed = "completed",
  Pending = "pending",
}

export enum TaskGlyph {
  Coffee = "coffee",
  Workout = "workout",
  Design = "design",
  Document = "document",
  Notes = "notes",
  Calendar = "calendar",
  Reminder = "reminder",
}

export type Task = {
  id: string;
  title: string;
  date: PlainDate;
  time: ClockTime;
  period: TaskPeriod;
  status: TaskStatus;
  previousStatus?: TaskStatus;
  glyph: TaskGlyph;
};

export type TaskGroup = {
  period: TaskPeriod;
  tasks: Task[];
};

export const taskPeriods = [TaskPeriod.Morning, TaskPeriod.Workload, TaskPeriod.Night];

export const taskFilters = [TaskFilter.Todo, TaskFilter.Completed, TaskFilter.Pending];

const shownStatuses: Record<TaskFilter, TaskStatus[]> = {
  [TaskFilter.Todo]: [TaskStatus.Todo, TaskStatus.Pending],
  [TaskFilter.Completed]: [TaskStatus.Done],
  [TaskFilter.Pending]: [TaskStatus.Pending],
};

function byTime(first: Task, second: Task): number {
  return first.time.localeCompare(second.time);
}

export function tasksShown(tasks: Task[], date: PlainDate, filter: TaskFilter): Task[] {
  const statuses = shownStatuses[filter];
  return tasks.filter((task) => task.date === date && statuses.includes(task.status)).sort(byTime);
}

export function groupTasks(tasks: Task[]): TaskGroup[] {
  return taskPeriods
    .map((period) => ({ period, tasks: tasks.filter((task) => task.period === period) }))
    .filter((group) => group.tasks.length > 0);
}

export function toggledStatus(task: Task): TaskStatus {
  const isDone = task.status === TaskStatus.Done;
  return isDone ? (task.previousStatus ?? TaskStatus.Todo) : TaskStatus.Done;
}

export function toggleTask(tasks: Task[], toggled: Task): Task[] {
  return tasks.map((task) =>
    task.id === toggled.id ? { ...task, status: toggledStatus(task), previousStatus: task.status } : task,
  );
}

export function hasTasksOn(tasks: Task[], date: PlainDate): boolean {
  return tasks.some((task) => task.date === date);
}
