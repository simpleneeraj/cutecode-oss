import { Tone } from "@cutecode/ui/tactile/tone";
import { BellIcon } from "@solar-icons/react/bold-duotone/bell";
import { BoltIcon } from "@solar-icons/react/bold-duotone/bolt";
import { CardIcon } from "@solar-icons/react/bold-duotone/card";
import { FolderIcon } from "@solar-icons/react/bold-duotone/folder";
import { HeartIcon } from "@solar-icons/react/bold-duotone/heart";
import { HomeSmileIcon } from "@solar-icons/react/bold-duotone/home-smile";
import { StarIcon } from "@solar-icons/react/bold-duotone/star";
import { Widget5Icon } from "@solar-icons/react/bold-duotone/widget-5";

export enum TileSpan {
  Three = "three",
  Four = "four",
  Half = "half",
  Five = "five",
  Seven = "seven",
}

export const pocketCards = [
  { id: "travel", title: "Travel", meta: "4 passes", caption: "Next: Lisbon, Dec 4" },
  { id: "studio", title: "Studio", meta: "Member 0042", caption: "Valid through 2027", tone: Tone.Accent },
  { id: "coffee", title: "Coffee", meta: "9 of 10 stamps", caption: "One more for a free cup" },
];

export const appIcons = [
  { id: "files", label: "Files", icon: FolderIcon, tone: Tone.Accent },
  { id: "health", label: "Health", icon: HeartIcon, tone: Tone.Neutral },
  { id: "power", label: "Power", icon: BoltIcon, tone: Tone.Neutral },
  { id: "wallet", label: "Wallet", icon: CardIcon, tone: Tone.Neutral },
];

export const demoTabs = [
  { id: "home", label: "Home", icon: HomeSmileIcon, isCurrent: true },
  { id: "saved", label: "Saved", icon: StarIcon, isCurrent: false },
  { id: "alerts", label: "Alerts", icon: BellIcon, isCurrent: false },
  { id: "more", label: "More", icon: Widget5Icon, isCurrent: false },
];

export const launchTicket = {
  code: "LN1203",
  label: "Admit one",
  name: "Launch Night",
  when: "Thu, Dec 3, 6:30 PM",
  seats: [
    { id: "door", label: "Door", value: "2" },
    { id: "row", label: "Row", value: "C" },
    { id: "seat", label: "Seat", value: "8" },
  ],
};

export const noteLines = ["first", "second", "third"];
