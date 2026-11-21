import { useSetAtom } from "jotai";
import { motion } from "motion/react";
import { PlayIcon } from "@solar-icons/react/linear/play";
import { Button } from "@cutecode/ui/components/button";
import { typingIsPausedAtom, typingReplayCountAtom } from "@/store/editor/editor";
import HoldToggle from "./hold-toggle";
import SettingRow from "./setting-row";
import SpeedToggle from "./speed-toggle";

export default function ReplayPanel() {
  const setIsPaused = useSetAtom(typingIsPausedAtom);
  const setReplayCount = useSetAtom(typingReplayCountAtom);

  const preview = () => {
    setIsPaused(false);
    setReplayCount((count) => count + 1);
  };

  return (
    <div className="flex flex-col gap-2">
      <SettingRow label="Speed">
        <SpeedToggle />
      </SettingRow>
      <SettingRow label="Hold at end">
        <HoldToggle />
      </SettingRow>
      <Button size="sm" variant="outline" onClick={preview} render={<motion.button whileTap={{ scale: 0.96 }} />}>
        <PlayIcon aria-hidden="true" />
        Play preview
      </Button>
    </div>
  );
}
