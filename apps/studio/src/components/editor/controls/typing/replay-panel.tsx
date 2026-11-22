import { useSetAtom } from "jotai";
import { PlayIcon } from "@solar-icons/react/linear/play";
import { Button } from "@cutecode/ui/components/button";
import { typingIsPausedAtom, typingReplayCountAtom } from "@/store/editor/editor";
import HoldToggle from "./hold-toggle";
import SettingRow from "./setting-row";
import SpeedToggle from "./speed-toggle";
import { panelButton } from "../dock-styles";

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
      <Button size="sm" variant="outline" className={panelButton()} onClick={preview}>
        <PlayIcon aria-hidden="true" />
        Play preview
      </Button>
    </div>
  );
}
