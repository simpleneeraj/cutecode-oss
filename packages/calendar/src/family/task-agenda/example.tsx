"use client";

import { useState } from "react";

import { StateSwitch } from "../../parts/family-options/state-switch";
import {
  exampleTasks,
  TaskExampleState,
  taskExampleCopy,
  taskExampleDate,
  taskExampleOptions,
  taskExampleChoices,
  tasksFor,
} from "./example-data";
import { AgendaTab, TaskAgenda } from "./index";
import { taskExampleStyles } from "./style";
import { TaskFilter, toggleTask, type Task } from "./task";

const styles = taskExampleStyles();

function ignoreAdd() {
  return undefined;
}

function TaskAgendaExample() {
  const [state, setState] = useState(TaskExampleState.Ready);
  const [date, setDate] = useState(taskExampleDate);
  const [tasks, setTasks] = useState(exampleTasks);
  const [tab, setTab] = useState(AgendaTab.Home);
  const toggle = (task: Task) => setTasks((current) => toggleTask(current, task));
  const agendaState = {
    loading: state === TaskExampleState.Loading,
    initialFilter: state === TaskExampleState.Completed ? TaskFilter.Completed : TaskFilter.Todo,
    navigation: { tab, onTabChange: setTab },
  };

  return (
    <div className={styles.root()}>
      <StateSwitch choices={taskExampleChoices} label={taskExampleCopy.states} onValueChange={setState} value={state} />
      <div className={styles.stage()}>
        <TaskAgenda
          key={state}
          actions={{ onTaskToggle: toggle, onTaskAdd: ignoreAdd }}
          options={taskExampleOptions}
          selection={{ value: date, onValueChange: setDate }}
          state={agendaState}
          tasks={tasksFor(state, tasks)}
        />
      </div>
    </div>
  );
}

export { TaskAgendaExample };
