"use client";

import { Drawer, DrawerPanel, DrawerPopup } from "@cutecode/ui/components/drawer";
import { Popover, PopoverPopup } from "@cutecode/ui/components/popover";
import { Fragment } from "react";

import { AnnouncementKind } from "../../types";
import { LiveRegion } from "../live-region";
import { useAnnouncer } from "../live-region/use-announcer";
import { useOverlay } from "../overlay/use-overlay";
import { QuickEventContent } from "./content";
import { quickEventCopy, targetKey, targetLabel } from "./session";
import { quickEventStyles } from "./style";
import type { QuickEventActions, QuickEventContext, QuickEventSession, RepeatSlot } from "./target";

type QuickEventProps = {
  session: QuickEventSession;
  context: QuickEventContext;
  actions: QuickEventActions;
  repeat?: RepeatSlot;
};

const quickEventPlacement = {
  sideOffset: 8,
};

const styles = quickEventStyles();

function useAnnouncedActions(actions: QuickEventActions, context: QuickEventContext) {
  const { announce, message } = useAnnouncer(context.settings);
  const announced: QuickEventActions = {
    onSave: actions.onSave,
    onDelete: (occurrence, scope) => {
      actions.onDelete(occurrence, scope);
      announce({ kind: AnnouncementKind.Deleted, title: occurrence.event.title });
    },
  };
  return { announced, message };
}

function QuickEvent({ session, context, actions, repeat }: QuickEventProps) {
  const overlay = useOverlay(session.target, { isSaving: session.isSaving, onClose: session.onClose });
  const { announced, message } = useAnnouncedActions(actions, context);
  const { shown } = overlay;
  const label = shown === null ? quickEventCopy.newEvent : targetLabel(shown);
  const returnFocus = () => shown?.anchor ?? true;
  const handlers = { onOpenChange: overlay.changeOpen, onOpenChangeComplete: overlay.release };
  const content = shown && (
    <QuickEventContent
      key={targetKey(shown)}
      actions={announced}
      context={context}
      isSaving={session.isSaving}
      repeat={repeat}
      target={shown}
    />
  );

  return (
    <Fragment>
      <Popover {...handlers} open={overlay.isDesktopOpen}>
        <PopoverPopup
          anchor={shown?.anchor}
          aria-label={label}
          className={styles.popup()}
          data-slot="quick-event"
          finalFocus={returnFocus}
          side="inline-end"
          sideOffset={quickEventPlacement.sideOffset}
        >
          {content}
        </PopoverPopup>
      </Popover>
      <Drawer {...handlers} disablePointerDismissal={session.isSaving} open={overlay.isPhoneOpen}>
        <DrawerPopup aria-label={label} data-slot="quick-event-drawer" finalFocus={returnFocus}>
          <DrawerPanel>
            <div className={styles.drawerBody()}>{content}</div>
          </DrawerPanel>
        </DrawerPopup>
      </Drawer>
      {message && <LiveRegion message={message} />}
    </Fragment>
  );
}

export { QuickEvent };
export {
  QuickEventMode,
  type NewEventSlot,
  type QuickEventActions,
  type QuickEventContext,
  type QuickEventDraft,
  type QuickEventSession,
  type QuickEventTarget,
  type RepeatFieldProps,
  type RepeatSlot,
} from "./target";
export { ChangeScope } from "../../types";
