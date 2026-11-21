import { ControlsDemo } from "./controls-demo";
import { FoldersDemo } from "./folders-demo";
import { IconsDemo } from "./icons-demo";
import { MenuDemo } from "./menu-demo";
import { SettingsDemo } from "./settings-demo";
import { StackDemo } from "./stack-demo";

export const parts = [
  { id: "folder", title: "Folder", description: "Collections with things peeking out.", demo: <FoldersDemo /> },
  {
    id: "list-group",
    title: "List group",
    description: "Inset grouped rows, the Settings way.",
    demo: <SettingsDemo />,
  },
  { id: "card-stack", title: "Card stack", description: "Pocket cards fanned on the desk.", demo: <StackDemo /> },
  {
    id: "glass-controls",
    title: "Glass controls",
    description: "Segments, search and a floating tab bar.",
    demo: <ControlsDemo />,
  },
  { id: "menu", title: "Menu", description: "Label left, glyph right, destructive last.", demo: <MenuDemo /> },
  { id: "app-icon", title: "App icon", description: "Solar Bold Duotone, lit from above.", demo: <IconsDemo /> },
];
