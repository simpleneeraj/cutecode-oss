import { testZones } from "../../testing";
import type { TaskAgendaOptions } from "./props";
import { TaskGlyph, TaskPeriod, TaskStatus, type Task } from "./task";

export enum TaskExampleState {
  Ready = "ready",
  Completed = "completed",
  Loading = "loading",
  AllDone = "allDone",
}

export const taskExampleChoices = [
  { kind: TaskExampleState.Ready, label: "Today" },
  { kind: TaskExampleState.Completed, label: "Completed" },
  { kind: TaskExampleState.Loading, label: "Loading" },
  { kind: TaskExampleState.AllDone, label: "All done" },
];

export const taskExampleCopy = {
  states: "Task agenda state",
};

export const taskExampleDate = "2026-11-18";

export const taskExampleOptions: TaskAgendaOptions = {
  locale: "en-US",
  timeZone: testZones.losAngeles,
  now: "2026-11-18T09:40",
};

type TaskSeed = [string, TaskGlyph, string, string, TaskStatus];

const seeds: [TaskPeriod, TaskSeed[]][] = [
  [
    TaskPeriod.Morning,
    [
      ["coffee", TaskGlyph.Coffee, "Make coffee and plan", "07:30", TaskStatus.Done],
      ["gym", TaskGlyph.Workout, "Gym, upper body", "08:00", TaskStatus.Todo],
    ],
  ],
  [
    TaskPeriod.Workload,
    [
      ["polish", TaskGlyph.Design, "Polish UI components", "10:00", TaskStatus.Todo],
      ["update", TaskGlyph.Document, "Send update to the team", "13:00", TaskStatus.Pending],
      ["case-study", TaskGlyph.Notes, "Write the case study", "15:00", TaskStatus.Todo],
    ],
  ],
  [
    TaskPeriod.Night,
    [
      ["plan", TaskGlyph.Calendar, "Plan tomorrow", "21:00", TaskStatus.Todo],
      ["phone", TaskGlyph.Reminder, "No phone 30 min before bed", "22:30", TaskStatus.Todo],
    ],
  ],
];

export const exampleTasks: Task[] = seeds.flatMap(([period, items]) =>
  items.map(([id, glyph, title, time, status]) => ({ id, glyph, title, time, status, period, date: taskExampleDate })),
);

export function tasksFor(state: TaskExampleState, tasks: Task[]): Task[] {
  if (state === TaskExampleState.AllDone) {
    return tasks.map((task) => ({ ...task, status: TaskStatus.Done }));
  }
  return tasks;
}
