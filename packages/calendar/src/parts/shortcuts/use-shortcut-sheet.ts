"use client";

import { useState } from "react";

import type { ShortcutSheetState } from "./view-overlays";

export function useShortcutSheet() {
  const [isOpen, setOpen] = useState(false);
  const sheet: ShortcutSheetState = { isOpen, onClose: () => setOpen(false) };
  return { sheet, open: () => setOpen(true) };
}
