import { TextDirection } from "../types";

export enum KeyPlatform {
  Mac = "mac",
  Other = "other",
}

export type ShortcutRow = {
  label: string;
  keys: string[];
};

export type ShortcutGroup = {
  title: string;
  rows: ShortcutRow[];
};

type PlatformKeys = {
  command: string;
  shift: string;
  enter: string;
};

type GroupKeys = PlatformKeys & {
  arrows: string[];
};

const arrowKeys: Record<TextDirection, string[]> = {
  [TextDirection.LeftToRight]: ["←", "→"],
  [TextDirection.RightToLeft]: ["→", "←"],
};

const platformKeys: Record<KeyPlatform, PlatformKeys> = {
  [KeyPlatform.Mac]: { command: "⌘", shift: "⇧", enter: "Return" },
  [KeyPlatform.Other]: { command: "Ctrl", shift: "Shift", enter: "Enter" },
};

const applePlatform = /Mac|iPhone|iPad|iPod/;

export function platformOf(userAgent: string): KeyPlatform {
  return applePlatform.test(userAgent) ? KeyPlatform.Mac : KeyPlatform.Other;
}

function navigateGroup(keys: GroupKeys): ShortcutGroup {
  return {
    title: "Navigate",
    rows: [
      { label: "Today", keys: ["T"] },
      { label: "Previous or next day", keys: keys.arrows },
      { label: "Previous or next hour", keys: ["↑", "↓"] },
      { label: "Previous or next week", keys: [keys.shift, ...keys.arrows] },
      { label: "Day, Week, Month, Year, Agenda", keys: ["D", "W", "M", "Y", "A"] },
    ],
  };
}

function eventGroup(keys: GroupKeys): ShortcutGroup {
  return {
    title: "Events",
    rows: [
      { label: "New event at the focused slot", keys: ["N"] },
      { label: "Open the focused event", keys: [keys.enter] },
      { label: "Delete the focused event", keys: ["Delete"] },
      { label: "Duplicate the focused event", keys: [keys.command, "D"] },
      { label: "Undo", keys: [keys.command, "Z"] },
    ],
  };
}

function moveGroup(keys: GroupKeys): ShortcutGroup {
  return {
    title: "Move with the keyboard",
    rows: [
      { label: "Pick up the focused event", keys: ["Space"] },
      { label: "Move 15 minutes", keys: ["↑", "↓"] },
      { label: "Move a day", keys: keys.arrows },
      { label: "Move a week", keys: [keys.shift, ...keys.arrows] },
      { label: "Drop", keys: [keys.enter] },
      { label: "Cancel", keys: ["Esc"] },
    ],
  };
}

function generalGroup(keys: GroupKeys): ShortcutGroup {
  return {
    title: "General",
    rows: [
      { label: "Search", keys: ["/"] },
      { label: "Quick add", keys: [keys.command, "K"] },
      { label: "Keyboard shortcuts", keys: ["?"] },
      { label: "Close or cancel", keys: ["Esc"] },
    ],
  };
}

export function shortcutGroups(platform: KeyPlatform, direction = TextDirection.LeftToRight): ShortcutGroup[] {
  const keys = { ...platformKeys[platform], arrows: arrowKeys[direction] };
  return [navigateGroup(keys), eventGroup(keys), moveGroup(keys), generalGroup(keys)];
}
