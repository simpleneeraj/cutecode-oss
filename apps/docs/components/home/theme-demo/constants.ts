import { Tone } from "@cutecode/ui/tactile/tone";
import { CalendarIcon } from "@solar-icons/react/bold-duotone/calendar";

export const demoViews = ["Day", "Week", "Month"];

export const demoNotification = {
  icon: CalendarIcon,
  tone: Tone.Accent,
  title: "Calendar",
  time: "now",
  body: "Standup in 5 minutes.",
};
