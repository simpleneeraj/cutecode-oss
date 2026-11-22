"use client";

import { ResponsiveDialog } from "@cutecode/calendar/parts/overlay/responsive-dialog";
import type { EventDraft, QuickAddContext } from "@cutecode/calendar/types";

import { QuickAddField } from "./field";
import { quickAddDialogStyles } from "./style";

type QuickAddDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context: QuickAddContext;
  onEventCreate: (draft: EventDraft) => void;
};

const dialogCopy = {
  title: "Quick add",
  description: "Type it the way you say it.",
};

const styles = quickAddDialogStyles();

function QuickAddDialog({ open, onOpenChange, context, onEventCreate }: QuickAddDialogProps) {
  const create = (draft: EventDraft) => {
    onEventCreate(draft);
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      copyOf={() => dialogCopy}
      dismiss={{ isSaving: false, onClose: () => onOpenChange(false) }}
      value={open ? context : null}
    >
      {(shown) => (
        <div className={styles.body()}>
          <QuickAddField context={shown} onEventCreate={create} />
        </div>
      )}
    </ResponsiveDialog>
  );
}

export { QuickAddDialog };
