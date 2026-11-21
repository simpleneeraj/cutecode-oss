import { FolderItem } from "@cutecode/ui/tactile/folder-items/style";
import { Tone } from "@cutecode/ui/tactile/tone";
import { BellIcon } from "@solar-icons/react/linear/bell";
import { CopyIcon } from "@solar-icons/react/linear/copy";
import { MoonIcon } from "@solar-icons/react/linear/moon";
import { PenNewSquareIcon } from "@solar-icons/react/linear/pen-new-square";
import { ShareIcon } from "@solar-icons/react/linear/share";
import { CalendarIcon } from "@solar-icons/react/bold-duotone/calendar";
import { CameraIcon } from "@solar-icons/react/bold-duotone/camera";
import { ChatRoundDotsIcon } from "@solar-icons/react/bold-duotone/chat-round-dots";
import { MapPointIcon } from "@solar-icons/react/bold-duotone/map-point";
import { MusicNote2Icon } from "@solar-icons/react/bold-duotone/music-note-2";
import { NotebookIcon } from "@solar-icons/react/bold-duotone/notebook";
import { PaletteIcon } from "@solar-icons/react/bold-duotone/palette";
import { Widget5Icon } from "@solar-icons/react/bold-duotone/widget-5";

export const folderContents = {
  photos: [FolderItem.Sunset, FolderItem.Bloom, FolderItem.Meadow],
  mixed: [FolderItem.Bloom, FolderItem.Paper, FolderItem.Sunset],
};

export const settingSwitches = [
  { id: "notifications", icon: BellIcon, tone: Tone.Pink, title: "Notifications", isChecked: true },
  { id: "dark-mode", icon: MoonIcon, tone: Tone.Indigo, title: "Dark Mode", isChecked: false },
];

export const stackCards = [
  {
    id: "brew",
    tone: Tone.Orange,
    title: "Product Designer",
    meta: "Hybrid",
    chips: ["Full time"],
    caption: "Posted yesterday",
  },
  {
    id: "spark",
    tone: Tone.Yellow,
    title: "Lead Designer",
    meta: "Remote",
    chips: ["Contract"],
    caption: "Posted 3 days ago",
  },
  {
    id: "studio",
    tone: Tone.Purple,
    title: "Senior UI Designer",
    meta: "Remote",
    chips: ["Remote", "Full time"],
    caption: "Posted 2 days ago",
  },
];

export const billingPeriods = ["Monthly", "Yearly"];

export const menuActions = [
  { label: "Copy", icon: CopyIcon },
  { label: "Share", icon: ShareIcon },
  { label: "Edit", icon: PenNewSquareIcon },
];

export const appIcons = [
  { id: "camera", icon: CameraIcon, tone: Tone.Pink },
  { id: "calendar", icon: CalendarIcon, tone: Tone.Orange },
  { id: "notebook", icon: NotebookIcon, tone: Tone.Yellow },
  { id: "chat", icon: ChatRoundDotsIcon, tone: Tone.Green },
  { id: "map-point", icon: MapPointIcon, tone: Tone.Teal },
  { id: "widget", icon: Widget5Icon, tone: Tone.Blue },
  { id: "palette", icon: PaletteIcon, tone: Tone.Purple },
  { id: "music", icon: MusicNote2Icon, tone: Tone.Gray },
];
