import { TaskFilter, TaskPeriod } from "./task";

export const taskCopy = {
  today: "Today",
  week: "Week",
  filter: "Task filter",
  newTask: "New task",
  app: "App",
  pending: "pending",
  loading: "Loading tasks",
  done: (title: string) => `Done: ${title}`,
  reopened: (title: string) => `Not done: ${title}`,
};

export const filterLabels: Record<TaskFilter, string> = {
  [TaskFilter.Todo]: "To do",
  [TaskFilter.Completed]: "Completed",
  [TaskFilter.Pending]: "Pending",
};

export const periodLabels: Record<TaskPeriod, string> = {
  [TaskPeriod.Morning]: "Morning",
  [TaskPeriod.Workload]: "Workload",
  [TaskPeriod.Night]: "Night",
};

type EmptyCopy = { title: string; description: string };

export const noTasksCopy: EmptyCopy = { title: "Nothing planned", description: "Tap + to add a task." };

export const emptyCopy: Record<TaskFilter, EmptyCopy> = {
  [TaskFilter.Todo]: { title: "All done", description: "Every task on this day is checked off." },
  [TaskFilter.Completed]: { title: "Nothing completed yet", description: "Checked tasks show up here." },
  [TaskFilter.Pending]: { title: "Nothing pending", description: "Tasks waiting on someone show up here." },
};
