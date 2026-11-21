import { FolderItem } from "@cutecode/ui/tactile/folder-items/style";
import { Tone } from "@cutecode/ui/tactile/tone";
import { CalendarIcon } from "@solar-icons/react/bold-duotone/calendar";
import { ChatRoundDotsIcon } from "@solar-icons/react/bold-duotone/chat-round-dots";
import { Widget5Icon } from "@solar-icons/react/bold-duotone/widget-5";

export const folderPeople = [
  { id: "wc", initials: "WC" },
  { id: "mj", initials: "MJ", tone: Tone.Accent },
  { id: "tl", initials: "TL" },
];

export const folderContents = {
  designs: [FolderItem.Photo, FolderItem.AccentPhoto, FolderItem.Photo],
  photos: [FolderItem.Photo, FolderItem.Paper, FolderItem.AccentPhoto],
  launch: [FolderItem.Paper, FolderItem.Photo, FolderItem.Paper],
};

export const heroNotifications = [
  {
    id: "install",
    icon: Widget5Icon,
    tone: Tone.Accent,
    title: "CuteUI",
    time: "now",
    body: "Folder added to components/ui.",
  },
  { id: "message", icon: ChatRoundDotsIcon, title: "Maya", time: "20m", body: "Love the new folders." },
  { id: "calendar", icon: CalendarIcon, title: "Calendar", time: "2h", body: "Design review at 3 PM." },
];
