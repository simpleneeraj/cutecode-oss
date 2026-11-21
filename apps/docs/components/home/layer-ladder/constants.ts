import { FolderItem } from "@cutecode/ui/tactile/folder-items/style";
import { Tone } from "@cutecode/ui/tactile/tone";

export const layers = [
  {
    id: "components",
    title: "Components",
    count: "Free, MIT licensed",
    badge: "Free",
    badgeTone: Tone.Green,
    items: [FolderItem.Sunset, FolderItem.Bloom, FolderItem.Meadow],
    description: "Buttons, lists, folders, menus and sheets. Copy them into your app.",
  },
  {
    id: "blocks",
    title: "Blocks",
    count: "Pro",
    tone: Tone.Blue,
    badge: "Pro",
    badgeTone: Tone.Blue,
    items: [FolderItem.Bloom, FolderItem.Paper, FolderItem.Sunset],
    description: "Heroes, pricing, sign-in, settings and dashboards, made from the components.",
  },
  {
    id: "templates",
    title: "Templates",
    count: "Pro, coming soon",
    badge: "Soon",
    badgeTone: Tone.Orange,
    items: [FolderItem.Paper, FolderItem.Meadow, FolderItem.Paper],
    description: "A SaaS starter with Dodo Payments, a dashboard and a landing page, made from the blocks.",
  },
];
