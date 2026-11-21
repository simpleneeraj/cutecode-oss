import { CalendarIcon } from "@solar-icons/react/bold-duotone/calendar";
import { CameraIcon } from "@solar-icons/react/bold-duotone/camera";
import { ChatRoundDotsIcon } from "@solar-icons/react/bold-duotone/chat-round-dots";
import { DocumentTextIcon } from "@solar-icons/react/bold-duotone/document-text";
import { FolderIcon } from "@solar-icons/react/bold-duotone/folder";
import { GalleryIcon } from "@solar-icons/react/bold-duotone/gallery";
import { HeartIcon } from "@solar-icons/react/bold-duotone/heart";
import { MusicNoteIcon } from "@solar-icons/react/bold-duotone/music-note";
import { PaletteIcon } from "@solar-icons/react/bold-duotone/palette";
import { StarIcon } from "@solar-icons/react/bold-duotone/star";

export enum ScenePlace {
  Window = "window",
  Notifications = "notifications",
  Ticket = "ticket",
  Sticky = "sticky",
  Dock = "dock",
}

export const sceneDepths = {
  [ScenePlace.Window]: 3,
  [ScenePlace.Notifications]: 7,
  [ScenePlace.Ticket]: 10,
  [ScenePlace.Sticky]: 9,
  [ScenePlace.Dock]: 2,
} satisfies Record<ScenePlace, number>;

export const sidebarPlaces = [
  { id: "projects", label: "Projects", icon: FolderIcon, isCurrent: true },
  { id: "photos", label: "Photos", icon: GalleryIcon, isCurrent: false },
  { id: "documents", label: "Documents", icon: DocumentTextIcon, isCurrent: false },
];

export const sidebarTags = [
  { id: "design", label: "Design", isAccent: true },
  { id: "launch", label: "Launch", isAccent: false },
];

export const dockApps = [
  { id: "folder", icon: FolderIcon },
  { id: "gallery", icon: GalleryIcon },
  { id: "calendar", icon: CalendarIcon },
  { id: "chat", icon: ChatRoundDotsIcon },
  { id: "music", icon: MusicNoteIcon },
  { id: "palette", icon: PaletteIcon },
];

export const phoneApps = [
  { id: "camera", icon: CameraIcon },
  { id: "heart", icon: HeartIcon },
  { id: "music", icon: MusicNoteIcon },
  { id: "star", icon: StarIcon },
];

export const heroTicket = {
  code: "DW2026",
  label: "Admit one",
  name: "Design Week",
  when: "Fri, Nov 27, 7:00 PM",
  seats: [
    { id: "hall", label: "Hall", value: "B" },
    { id: "row", label: "Row", value: "4" },
    { id: "seat", label: "Seat", value: "12" },
  ],
};
