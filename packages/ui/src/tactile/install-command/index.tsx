"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

import { Button } from "../../components/button";
import { ToggleGroup, ToggleGroupItem } from "../../components/toggle-group";
import { CopyState, installCommand, PackageManager } from "./constants";
import { installCommandStyles } from "./style";

type InstallCommandProps = {
  item: string;
};

type CopyCommandButtonProps = {
  command: string;
};

const styles = installCommandStyles();
const packageManagers = Object.values(PackageManager);

function CopyCommandButton({ command }: CopyCommandButtonProps) {
  const [copyState, setCopyState] = useState<CopyState>(CopyState.Idle);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const CopyIcon = installCommand.copyIcons[copyState];

  async function copyCommand() {
    clearTimeout(resetTimer.current);
    const nextState = await Promise.resolve()
      .then(() => navigator.clipboard.writeText(command))
      .then(
        () => CopyState.Copied,
        () => CopyState.Failed,
      );
    setCopyState(nextState);
    resetTimer.current = setTimeout(() => setCopyState(CopyState.Idle), installCommand.resetDelay);
  }

  return (
    <Button aria-live="polite" onClick={copyCommand} size="sm" variant={installCommand.copyVariants[copyState]}>
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          animate={{ opacity: 1 }}
          className={styles.copyLabel()}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key={copyState}
          transition={{ duration: 0.12 }}
        >
          <CopyIcon aria-hidden="true" className={styles.copyIcon()} />
          {installCommand.copyLabels[copyState]}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}

function InstallCommand({ item }: InstallCommandProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>(PackageManager.Npm);
  const command = `${installCommand.runners[packageManager]} ${item}`;

  function selectPackageManager(values: string[]) {
    const selected = packageManagers.find((manager) => values.includes(manager));
    if (selected) {
      setPackageManager(selected);
    }
  }

  return (
    <div className={styles.root()} data-slot="install-command">
      <ToggleGroup aria-label="Package manager" onValueChange={selectPackageManager} size="sm" value={[packageManager]}>
        {packageManagers.map((manager) => (
          <ToggleGroupItem key={manager} value={manager}>
            {manager}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className={styles.row()}>
        <span aria-hidden="true" className={styles.prompt()}>
          $
        </span>
        <code className={styles.command()}>{command}</code>
        <CopyCommandButton command={command} key={command} />
      </div>
    </div>
  );
}

export { InstallCommand };
