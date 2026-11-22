"use client";

import { Button } from "@cutecode/ui/components/button";
import { AddIcon } from "@solar-icons/react/linear/add";

import { addButtonStyles } from "./style";

type AddButtonProps = {
  onAdd: (anchor: HTMLElement) => void;
};

const addCopy = {
  label: "New event",
};

const styles = addButtonStyles();

function AddButton({ onAdd }: AddButtonProps) {
  return (
    <Button
      aria-label={addCopy.label}
      className={styles.root()}
      onClick={(event) => onAdd(event.currentTarget)}
      size="icon-xl"
    >
      <AddIcon aria-hidden="true" className={styles.icon()} />
    </Button>
  );
}

export { AddButton };
