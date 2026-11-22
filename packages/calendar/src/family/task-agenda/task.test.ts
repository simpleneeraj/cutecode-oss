import { describe, expect, it } from "vitest";
import {
  groupTasks,
  hasTasksOn,
  TaskFilter,
  TaskGlyph,
  TaskPeriod,
  TaskStatus,
  tasksShown,
  toggleTask,
  type Task,
} from "./task";

function task(id: string, overrides: Partial<Task> = {}): Task {
  return {
    id,
    title: id,
    date: "2026-11-18",
    time: "09:00",
    period: TaskPeriod.Morning,
    status: TaskStatus.Todo,
    glyph: TaskGlyph.Notes,
    ...overrides,
  };
}

const tasks = [
  task("late", { time: "10:00" }),
  task("early", { time: "07:30" }),
  task("done", { status: TaskStatus.Done }),
  task("waiting", { status: TaskStatus.Pending, period: TaskPeriod.Workload }),
  task("tomorrow", { date: "2026-11-19" }),
];

function idsOf(list: Task[]): string[] {
  return list.map((item) => item.id);
}

describe("tasksShown", () => {
  it("shows open and pending tasks under To do, by time", () => {
    expect(idsOf(tasksShown(tasks, "2026-11-18", TaskFilter.Todo))).toEqual(["early", "waiting", "late"]);
  });

  it("splits completed and pending", () => {
    expect(idsOf(tasksShown(tasks, "2026-11-18", TaskFilter.Completed))).toEqual(["done"]);
    expect(idsOf(tasksShown(tasks, "2026-11-18", TaskFilter.Pending))).toEqual(["waiting"]);
  });

  it("keeps to the chosen day", () => {
    expect(idsOf(tasksShown(tasks, "2026-11-19", TaskFilter.Todo))).toEqual(["tomorrow"]);
    expect(tasksShown(tasks, "2026-11-20", TaskFilter.Todo)).toEqual([]);
  });
});

describe("groupTasks", () => {
  it("orders Morning, Workload, Night and drops empty groups", () => {
    const groups = groupTasks([task("night", { period: TaskPeriod.Night }), task("morning")]);
    expect(groups.map((group) => group.period)).toEqual([TaskPeriod.Morning, TaskPeriod.Night]);
  });
});

describe("toggleTask", () => {
  it("checks open and pending tasks and reopens done ones", () => {
    const toggled = toggleTask(tasks, tasks[3] ?? task("missing"));
    expect(toggled.find((item) => item.id === "waiting")?.status).toBe(TaskStatus.Done);
    const reopened = toggleTask(tasks, tasks[2] ?? task("missing"));
    expect(reopened.find((item) => item.id === "done")?.status).toBe(TaskStatus.Todo);
    expect(reopened.find((item) => item.id === "late")?.status).toBe(TaskStatus.Todo);
  });

  it("brings a pending task back to pending when it is unchecked", () => {
    const pending = [task("waiting", { status: TaskStatus.Pending })];
    const checked = toggleTask(pending, pending[0] ?? task("missing"));
    expect(checked[0]?.status).toBe(TaskStatus.Done);
    const unchecked = toggleTask(checked, checked[0] ?? task("missing"));
    expect(unchecked[0]?.status).toBe(TaskStatus.Pending);
  });
});

describe("hasTasksOn", () => {
  it("tells a day with tasks from an empty day", () => {
    expect(hasTasksOn([task("one")], task("one").date)).toBe(true);
    expect(hasTasksOn([task("one")], "2001-01-01")).toBe(false);
  });
});
