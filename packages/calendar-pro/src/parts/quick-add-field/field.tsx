"use client";

import { QuickAddField as ParsedField } from "@cutecode/calendar/types";
import { Button } from "@cutecode/ui/components/button";
import { motion as motionTokens } from "@cutecode/ui/tokens/motion";
import { CalendarAddIcon } from "@solar-icons/react/linear/calendar-add";
import { InfoCircleIcon } from "@solar-icons/react/linear/info-circle";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId } from "react";

import { fixCopy, type EditedChip } from "./fix";
import { FixPanel } from "./fix-panel";
import { hintCopy } from "./hint";
import type { FixContext } from "./options";
import { chipStyles, quickAddStyles } from "./style";
import { useQuickAdd, type QuickAddSetup } from "./use-quick-add";

type ChipListProps = {
  chips: EditedChip[];
  openKey: string | null;
  panelId: string;
  onToggle: (chip: EditedChip) => void;
};

type FixAreaProps = {
  panelId: string;
  chip: EditedChip | null;
  source: FixContext | null;
  onFix: (chip: EditedChip, phrase: string) => void;
};

const fieldCopy = {
  label: "Quick add event",
  chips: "What it understood",
  add: "Add",
};

const panelRise = 4;

const chipRise = 4;

const accentFields = new Set([ParsedField.Day, ParsedField.Time]);

const styles = quickAddStyles();

function ChipList({ chips, openKey, panelId, onToggle }: ChipListProps) {
  const isReducedMotion = useReducedMotion() ?? false;
  const rise = isReducedMotion ? 0 : chipRise;
  const transition = isReducedMotion ? motionTokens.fade : motionTokens.springSnappy;

  return (
    <AnimatePresence initial={false}>
      {chips.map((chip) => {
        const isOpen = chip.key === openKey;
        const chipStyle = chipStyles({ isAccent: accentFields.has(chip.field), isMissing: chip.isMissing, isOpen });
        return (
          <motion.li
            key={chip.key}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: motionTokens.fade }}
            initial={{ opacity: 0, y: rise }}
            transition={transition}
          >
            <button
              aria-controls={isOpen ? panelId : undefined}
              aria-expanded={isOpen}
              className={chipStyle.root()}
              onClick={() => onToggle(chip)}
              type="button"
            >
              <span className={chipStyle.name()}>{fixCopy.fields[chip.field]}</span>
              <span className={chipStyle.value()}>{chip.label}</span>
            </button>
          </motion.li>
        );
      })}
    </AnimatePresence>
  );
}

function FixArea({ panelId, chip, source, onFix }: FixAreaProps) {
  const isReducedMotion = useReducedMotion() ?? false;
  const rise = isReducedMotion ? 0 : panelRise;
  const transition = isReducedMotion ? motionTokens.fade : motionTokens.springSnappy;

  return (
    <AnimatePresence initial={false}>
      {chip && source && (
        <motion.div
          key={chip.key}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: motionTokens.fade }}
          id={panelId}
          initial={{ opacity: 0, y: rise }}
          transition={transition}
        >
          <FixPanel chip={chip} onFix={onFix} source={source} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function QuickAddField(setup: QuickAddSetup) {
  const { form, result, chips, editing, hint, canCreate, today, actions } = useQuickAdd(setup);
  const panelId = useId();
  const hintId = useId();
  const draft = result?.draft ?? null;
  const source = draft && result && { draft, chips: result.chips, settings: setup.context.settings, today };

  return (
    <div className={styles.root()} data-slot="quick-add-field">
      <form className={styles.field()} noValidate onSubmit={actions.create}>
        <CalendarAddIcon aria-hidden="true" className={styles.icon()} />
        <input
          aria-describedby={hintId}
          aria-label={fieldCopy.label}
          autoComplete="off"
          className={styles.input()}
          enterKeyHint="done"
          onFocus={actions.load}
          placeholder={hintCopy.placeholder}
          {...form.register("text", { onChange: actions.load })}
        />
        <Button disabled={!canCreate} size="sm" type="submit">
          {fieldCopy.add}
        </Button>
      </form>
      <ul aria-label={fieldCopy.chips} className={styles.chips()}>
        <ChipList chips={chips} onToggle={actions.toggle} openKey={editing?.key ?? null} panelId={panelId} />
      </ul>
      <FixArea chip={editing} onFix={actions.fix} panelId={panelId} source={source} />
      <p aria-live="polite" className={styles.hint()} id={hintId}>
        <InfoCircleIcon aria-hidden="true" className={styles.hintIcon()} />
        <span>{hint.text}</span>
      </p>
    </div>
  );
}

export { QuickAddField };
