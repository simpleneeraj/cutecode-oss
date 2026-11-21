import { FolderItem } from "@cutecode/ui/tactile/folder-items/style";
import { Tone } from "@cutecode/ui/tactile/tone";
import { BellIcon } from "@solar-icons/react/linear/bell";
import { CloudUploadIcon } from "@solar-icons/react/linear/cloud-upload";
import { MoonIcon } from "@solar-icons/react/linear/moon";
import { CalendarIcon } from "@solar-icons/react/bold-duotone/calendar";
import { ChatRoundDotsIcon } from "@solar-icons/react/bold-duotone/chat-round-dots";
import { Widget5Icon } from "@solar-icons/react/bold-duotone/widget-5";

export const themeBuilder = {
  path: "/themes",
  previewId: "theme-preview",
  codeTokens: ["--brand:", "--radius-control:", "--radius-surface:", "--edge-width:", "--font-heading:"],
};

export const previewLinks = [
  { id: "overview", label: "Overview", isCurrent: true },
  { id: "projects", label: "Projects", isCurrent: false },
  { id: "billing", label: "Billing", isCurrent: false },
];

export const previewStats = [
  { id: "visitors", label: "Visitors", value: "12.4k", change: "+8%" },
  { id: "signups", label: "Sign ups", value: "861", change: "+12%" },
  { id: "uptime", label: "Uptime", value: "99.9%", change: "+0.1%" },
];

export const previewSwitches = [
  { id: "alerts", icon: BellIcon, tone: Tone.Pink, title: "Alerts", isChecked: true },
  { id: "backups", icon: CloudUploadIcon, tone: Tone.Teal, title: "Nightly backups", isChecked: true },
  { id: "dark", icon: MoonIcon, tone: Tone.Indigo, title: "Dark mode", isChecked: false },
];

export const previewFolders = [
  { id: "designs", title: "Designs", count: "32 items", tone: undefined, items: [FolderItem.Sunset, FolderItem.Bloom] },
  { id: "notes", title: "Notes", count: "14 items", tone: Tone.Blue, items: [FolderItem.Paper, FolderItem.Meadow] },
  { id: "assets", title: "Assets", count: "88 items", tone: Tone.Orange, items: [FolderItem.Bloom, FolderItem.Paper] },
];

export const previewNotifications = [
  { id: "calendar", icon: CalendarIcon, tone: Tone.Pink, title: "Calendar", time: "2h", body: "Design review at 3 PM" },
  { id: "message", icon: ChatRoundDotsIcon, tone: Tone.Green, title: "Maya", time: "20m", body: "The new theme looks great" },
  { id: "deploy", icon: Widget5Icon, tone: Tone.Blue, title: "Deploys", time: "now", body: "Preview is live" },
];

export const previewPlan = {
  name: "Team",
  badge: "Popular",
  price: "$12",
  period: "per seat / month",
  features: ["Unlimited projects", "Shared folders", "Priority support"],
};
