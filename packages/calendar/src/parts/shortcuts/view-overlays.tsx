"use client";

import { Fragment } from "react";

import { textDirectionOf } from "../../locale";
import type { ViewSettings } from "../../types";
import { conflictAskOf, type CalendarStatus } from "../state/status";
import { SyncConflict } from "../state/sync-conflict";
import { ShortcutSheet } from "./sheet";

export type ShortcutSheetState = {
  isOpen: boolean;
  onClose: () => void;
};

type ViewOverlaysProps = {
  status: CalendarStatus;
  settings: ViewSettings;
  shortcuts: ShortcutSheetState;
};

function ViewOverlays({ status, settings, shortcuts }: ViewOverlaysProps) {
  return (
    <Fragment>
      <SyncConflict ask={conflictAskOf(status)} settings={settings} />
      <ShortcutSheet direction={textDirectionOf(settings.locale)} isOpen={shortcuts.isOpen} onClose={shortcuts.onClose} />
    </Fragment>
  );
}

export { ViewOverlays };
