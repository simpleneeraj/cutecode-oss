"use client";

import { Button } from "@cutecode/ui/components/button";
import { Fragment } from "react";

import { occurrenceOf } from "../../event";
import type { CalendarEvent, ViewSettings } from "../../types";
import { occurrenceWhen } from "../event-details/when";
import { ResponsiveDialog } from "../overlay/responsive-dialog";
import { stateCopy } from "./copy";
import { ConflictChoice, type ConflictAsk } from "./status";
import { conflictStyles } from "./style";

type SyncConflictProps = {
  ask: ConflictAsk | null;
  settings: ViewSettings;
};

type ConflictBodyProps = {
  ask: ConflictAsk;
  settings: ViewSettings;
};

type VersionProps = {
  label: string;
  event: CalendarEvent;
  settings: ViewSettings;
};

const styles = conflictStyles();

const conflictCopy = {
  title: stateCopy.conflictTitle,
  description: stateCopy.conflictDescription,
};

function Version({ label, event, settings }: VersionProps) {
  const when = occurrenceWhen(occurrenceOf(event), settings);

  return (
    <div className={styles.version()}>
      <span className={styles.label()}>{label}</span>
      <span className={styles.title()}>{event.title}</span>
      <span className={styles.when()}>{`${when.day}, ${when.time}`}</span>
    </div>
  );
}

function ConflictBody({ ask, settings }: ConflictBodyProps) {
  return (
    <Fragment>
      <div className={styles.body()}>
        <Version event={ask.conflict.yours} label={stateCopy.yours} settings={settings} />
        <Version event={ask.conflict.theirs} label={stateCopy.theirs} settings={settings} />
      </div>
      <div className={styles.actions()}>
        <Button
          className={styles.action()}
          disabled={ask.isSaving}
          onClick={() => ask.onResolve(ConflictChoice.KeepMine)}
          variant="gray"
        >
          {stateCopy.keepMine}
        </Button>
        <Button
          className={styles.action()}
          disabled={ask.isSaving}
          onClick={() => ask.onResolve(ConflictChoice.UseTheirs)}
        >
          {stateCopy.useTheirs}
        </Button>
      </div>
    </Fragment>
  );
}

function SyncConflict({ ask, settings }: SyncConflictProps) {
  const dismiss = { isSaving: ask?.isSaving ?? false, onClose: () => ask?.onDismiss() };

  return (
    <ResponsiveDialog copyOf={() => conflictCopy} dismiss={dismiss} value={ask}>
      {(shown) => <ConflictBody ask={shown} settings={settings} />}
    </ResponsiveDialog>
  );
}

export { SyncConflict };
