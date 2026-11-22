import type { SettingsInput } from "../../locale";
import type { IsoDateTime, PlainDate } from "../../types";
import type { Task, TaskFilter } from "./task";

export enum AgendaTab {
  Home = "home",
  Insights = "insights",
  Profile = "profile",
}

export type TaskAgendaOptions = SettingsInput & {
  now?: IsoDateTime;
};

export type DateSelectionProps = {
  value: PlainDate;
  onValueChange: (date: PlainDate) => void;
};

export type TaskActions = {
  onTaskToggle: (task: Task) => void;
  onTaskAdd: () => void;
};

export type AgendaNavigation = {
  tab: AgendaTab;
  onTabChange: (tab: AgendaTab) => void;
};

export type TaskAgendaProps = {
  tasks: Task[];
  selection: DateSelectionProps;
  actions: TaskActions;
  options: TaskAgendaOptions;
  state?: TaskAgendaState;
};

export type TaskAgendaState = {
  loading?: boolean;
  initialFilter?: TaskFilter;
  navigation?: AgendaNavigation;
};
