"use client";

import { Button } from "@cutecode/ui/components/button";
import { Input } from "@cutecode/ui/components/input";
import { CloseIcon } from "@solar-icons/react/linear/close";
import { useState, type KeyboardEvent } from "react";

import { InviteeKey, inviteeKeyOf, withInvitee } from "./invitees";
import { inviteeStyles } from "./style";

type InviteeFieldProps = {
  invitees: string[];
  onInviteesChange: (invitees: string[]) => void;
};

type InviteeChipProps = {
  name: string;
  onRemove: () => void;
};

const inviteeCopy = {
  placeholder: "Add people",
  entryLabel: "Invite someone",
  remove: (name: string) => `Remove ${name}`,
};

const styles = inviteeStyles();

function InviteeChip({ name, onRemove }: InviteeChipProps) {
  return (
    <span className={styles.chip()}>
      <span className={styles.chipName()}>{name}</span>
      <Button
        aria-label={inviteeCopy.remove(name)}
        className={styles.remove()}
        onClick={onRemove}
        size="icon-xs"
        variant="ghost"
      >
        <CloseIcon aria-hidden="true" className={styles.removeIcon()} />
      </Button>
    </span>
  );
}

function InviteeField({ invitees, onInviteesChange }: InviteeFieldProps) {
  const [entry, setEntry] = useState("");

  const addEntry = () => {
    onInviteesChange(withInvitee(invitees, entry));
    setEntry("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const action = inviteeKeyOf(event.key, entry);
    if (action === InviteeKey.Add) {
      event.preventDefault();
      addEntry();
    }
    if (action === InviteeKey.RemoveLast) {
      onInviteesChange(invitees.slice(0, -1));
    }
  };

  return (
    <div className={styles.root()}>
      {invitees.map((name) => (
        <InviteeChip
          key={name}
          name={name}
          onRemove={() => onInviteesChange(invitees.filter((invitee) => invitee !== name))}
        />
      ))}
      <Input
        aria-label={inviteeCopy.entryLabel}
        className={styles.entry()}
        nativeInput
        onBlur={addEntry}
        onChange={(event) => setEntry(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={inviteeCopy.placeholder}
        size="sm"
        unstyled
        value={entry}
      />
    </div>
  );
}

export { InviteeField };
