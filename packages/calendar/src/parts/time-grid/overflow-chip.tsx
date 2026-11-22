"use client";

import { Drawer, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle } from "@cutecode/ui/components/drawer";
import { Popover, PopoverPopup, PopoverTitle, PopoverTrigger } from "@cutecode/ui/components/popover";
import { Fragment, useRef, useState } from "react";

import type { EventOccurrence } from "../../types";
import { useIsPhone } from "../viewport/use-is-phone";
import type { FocusProps } from "../roving-focus/focus-key";
import { rowsLength } from "./geometry";
import type { GridModel } from "./model";
import { OverflowItem } from "./overflow-item";
import type { ChipPlacement } from "./placement";
import { overflowStyles } from "./style";

type OverflowChipProps = {
  placement: ChipPlacement;
  model: GridModel;
  focusProps: FocusProps;
  onOpen: (occurrence: EventOccurrence) => void;
};

const overflowCopy = {
  label: (count: number) => `${count} more ${count === 1 ? "event" : "events"}`,
};

const styles = overflowStyles();

function hiddenOccurrences(placement: ChipPlacement, model: GridModel): EventOccurrence[] {
  return placement.chip.keys
    .map((key) => model.occurrenceByKey.get(key))
    .filter((occurrence) => occurrence !== undefined);
}

type OverflowListProps = {
  occurrences: EventOccurrence[];
  model: GridModel;
  onOpen: (occurrence: EventOccurrence) => void;
};

function OverflowList({ occurrences, model, onOpen }: OverflowListProps) {
  return (
    <div className={styles.list()}>
      {occurrences.map((occurrence) => (
        <OverflowItem key={occurrence.key} model={model} occurrence={occurrence} onOpen={onOpen} />
      ))}
    </div>
  );
}

function OverflowChip({ placement, model, focusProps, onOpen }: OverflowChipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isPhone = useIsPhone();
  const occurrences = hiddenOccurrences(placement, model);
  const label = overflowCopy.label(occurrences.length);
  const list = <OverflowList model={model} occurrences={occurrences} onOpen={onOpen} />;

  return (
    <Fragment>
      <Popover onOpenChange={setIsOpen} open={isOpen && !isPhone}>
        <PopoverTrigger
          ref={triggerRef}
          {...focusProps}
          aria-label={label}
          className={styles.trigger()}
          data-slot="overflow-chip"
          style={{ insetBlockStart: rowsLength(placement.top) }}
        >
          +{occurrences.length}
        </PopoverTrigger>
        <PopoverPopup className={styles.popup()} side="inline-end">
          <PopoverTitle>{label}</PopoverTitle>
          {list}
        </PopoverPopup>
      </Popover>
      <Drawer onOpenChange={setIsOpen} open={isOpen && isPhone}>
        <DrawerPopup finalFocus={triggerRef}>
          <DrawerHeader>
            <DrawerTitle>{label}</DrawerTitle>
          </DrawerHeader>
          <DrawerPanel>{list}</DrawerPanel>
        </DrawerPopup>
      </Drawer>
    </Fragment>
  );
}

export { OverflowChip };
