import { useSetAtom } from "jotai";
import { PlayIcon } from "@solar-icons/react/linear/play";
import { Button } from "@cutecode/ui/components/button";
import { TypingMode, typingModeAtom } from "@/store/editor/editor";
import { panelButton, panelText } from "../dock-styles";

export default function OffPanel() {
  const setMode = useSetAtom(typingModeAtom);

  return (
    <div className="flex flex-col gap-2">
      <p className={panelText()}>
        Your code shows up all at once. Replay types it out for you, one character at a time.
      </p>
      <Button
        size="sm"
        variant="secondary"
        className={panelButton({ className: "self-start" })}
        onClick={() => setMode(TypingMode.Replay)}
       
      >
        <PlayIcon aria-hidden="true" />
        Turn on Replay
      </Button>
    </div>
  );
}
