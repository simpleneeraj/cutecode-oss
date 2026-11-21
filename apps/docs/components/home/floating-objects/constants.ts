import { Tone } from "@cutecode/ui/tactile/tone";
import { CalendarIcon } from "@solar-icons/react/bold-duotone/calendar";
import { CameraIcon } from "@solar-icons/react/bold-duotone/camera";
import { ChatRoundDotsIcon } from "@solar-icons/react/bold-duotone/chat-round-dots";
import { MapPointIcon } from "@solar-icons/react/bold-duotone/map-point";
import { Widget5Icon } from "@solar-icons/react/bold-duotone/widget-5";

export const heroNotifications = [
  { id: "calendar", icon: CalendarIcon, tone: Tone.Pink, title: "Calendar", time: "2h", body: "Design review at 3 PM" },
  {
    id: "message",
    icon: ChatRoundDotsIcon,
    tone: Tone.Green,
    title: "Matthew",
    time: "20m",
    body: "Love the new folders",
  },
  {
    id: "install",
    icon: Widget5Icon,
    tone: Tone.Blue,
    title: "CuteUI",
    time: "now",
    body: "Folder installed in components/ui",
  },
];

export const folderPeople = [
  { id: "wc", initials: "WC", tone: Tone.Orange },
  { id: "mj", initials: "MJ", tone: Tone.Blue },
  { id: "tl", initials: "TL", tone: Tone.Green },
];

export const solarIcons = [
  { id: "camera", icon: CameraIcon, tone: Tone.Pink },
  { id: "calendar", icon: CalendarIcon, tone: Tone.Orange },
  { id: "map-point", icon: MapPointIcon, tone: Tone.Teal },
];
